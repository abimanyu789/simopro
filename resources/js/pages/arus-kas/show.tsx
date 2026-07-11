import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { ArusKasBadge } from '@/components/arus-kas/arus-kas-badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import arusKas from '@/routes/arus-kas';
import pesanan from '@/routes/pesanan';
import type { ArusKasShowProps } from '@/types';
import { router } from '@inertiajs/react';

export default function ArusKasShow({ transaksi }: ArusKasShowProps) {
    const formatRupiah = (v: string | number | null) =>
        v !== null && v !== undefined
            ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v))
            : '-';

    const formatDate = (s: string | null) =>
        s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

    const formatDateTime = (s: string) =>
        new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const isManual = !transaksi.pembayaran_id;

    return (
        <>
            <Head title={`Detail Transaksi — ${transaksi.jenis}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={arusKas.index.url()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Detail Transaksi</h1>
                            <div className="mt-1 flex items-center gap-2">
                                <ArusKasBadge jenis={transaksi.jenis} />
                                {!isManual && (
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                        Dari Pembayaran Pesanan
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {isManual && (
                        <div className="flex items-center gap-2">
                            <Link href={arusKas.edit.url(transaksi.id)}>
                                <Button variant="outline">
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </Button>
                            </Link>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="mr-2 size-4" />
                                        Hapus
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Hapus Transaksi</DialogTitle>
                                        <DialogDescription>
                                            Transaksi ini akan dihapus permanen. Saldo kas akan dihitung ulang otomatis.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">Batal</Button>
                                        </DialogClose>
                                        <Button
                                            variant="destructive"
                                            onClick={() => router.delete(arusKas.destroy.url(transaksi.id))}
                                        >
                                            Ya, Hapus
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                        <div className="border-b px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Informasi Transaksi
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-y">
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Jenis</p>
                                <div className="mt-1"><ArusKasBadge jenis={transaksi.jenis} /></div>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Tanggal</p>
                                <p className="mt-1 font-medium">{formatDate(transaksi.tanggal)}</p>
                            </div>
                            <div className="col-span-2 px-6 py-4">
                                <p className="text-sm text-muted-foreground">Nominal</p>
                                <p className={`mt-1 text-2xl font-bold ${transaksi.jenis === 'pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {transaksi.jenis === 'pengeluaran' ? '− ' : '+ '}
                                    {formatRupiah(transaksi.nominal)}
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Kategori</p>
                                <p className="mt-1">{transaksi.kategori ?? '-'}</p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                                <p className="mt-1">{transaksi.metode_pembayaran ?? '-'}</p>
                            </div>
                            {transaksi.keterangan && (
                                <div className="col-span-2 px-6 py-4">
                                    <p className="text-sm text-muted-foreground">Keterangan</p>
                                    <p className="mt-1">{transaksi.keterangan}</p>
                                </div>
                            )}
                            {transaksi.pembayaran?.pesanan && (
                                <div className="col-span-2 px-6 py-4">
                                    <p className="text-sm text-muted-foreground">Pesanan Terkait</p>
                                    <Link
                                        href={pesanan.show.url(transaksi.pembayaran.pesanan_id)}
                                        className="mt-1 font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        {transaksi.pembayaran.pesanan.nomor_pesanan}
                                    </Link>
                                </div>
                            )}
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Dicatat Pada</p>
                                <p className="mt-1 text-sm">{formatDateTime(transaksi.created_at)}</p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm text-muted-foreground">Sumber</p>
                                <p className="mt-1 text-sm">
                                    {isManual ? 'Transaksi Manual' : 'Pembayaran Pesanan (read-only)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {!isManual && (
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
                            Transaksi ini berasal dari pembayaran pesanan dan bersifat read-only.
                            Untuk mengubah atau menghapus, gunakan menu Pembayaran di
                            {transaksi.pembayaran?.pesanan && (
                                <>
                                    {' '}
                                    <Link
                                        href={pesanan.show.url(transaksi.pembayaran.pesanan_id)}
                                        className="font-medium underline underline-offset-2"
                                    >
                                        Detail Pesanan
                                    </Link>
                                    .
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ArusKasShow.layout = {
    breadcrumbs: [
        { title: 'Arus Kas', href: arusKas.index.url() },
        { title: 'Detail', href: '#' },
    ],
};
