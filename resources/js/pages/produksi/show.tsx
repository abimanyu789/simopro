import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { ProduksiActionDialog } from '@/components/produksi/produksi-action-dialog';
import { ProduksiStatusBadge } from '@/components/produksi/produksi-status-badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import pesanan from '@/routes/pesanan';
import produksi from '@/routes/produksi';
import type { KebutuhanBahan, ProduksiShowProps } from '@/types';

export default function ProduksiShow({
    produksi: item,
    kebutuhanBahan,
    stokCukup,
}: ProduksiShowProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const progressPct =
        item.qty_target > 0
            ? Math.round((item.qty_selesai / item.qty_target) * 100)
            : 0;

    return (
        <>
            <Head
                title={`Produksi — ${item.pesanan?.nomor_pesanan ?? item.id}`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={produksi.index.url()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Produksi
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <ProduksiStatusBadge status={item.status} />
                                <span className="text-sm text-muted-foreground">
                                    {item.pesanan?.nomor_pesanan}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Tombol aksi — Mulai & Batalkan */}
                    <ProduksiActionDialog
                        produksi={item}
                        stokCukup={stokCukup}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Kolom kiri — info & BOM */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Informasi Produksi */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Informasi Produksi
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-y">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Pesanan
                                    </p>
                                    <Link
                                        href={pesanan.show.url(item.pesanan_id)}
                                        className="mt-1 font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                        {item.pesanan?.nomor_pesanan ?? '-'}
                                    </Link>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Customer
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {item.pesanan?.customer
                                            ?.nama_customer ?? '-'}
                                    </p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Status
                                    </p>
                                    <div className="mt-1">
                                        <ProduksiStatusBadge
                                            status={item.status}
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Deadline
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {formatDate(item.deadline)}
                                    </p>
                                </div>
                                {item.catatan && (
                                    <div className="col-span-2 px-6 py-4">
                                        <p className="text-sm text-muted-foreground">
                                            Catatan
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {item.catatan}
                                        </p>
                                    </div>
                                )}
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Dibuat Pada
                                    </p>
                                    <p className="mt-1 text-sm">
                                        {formatDateTime(item.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kebutuhan Bahan Baku */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                            <div className="flex items-center justify-between border-b px-6 py-4">
                                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Kebutuhan Bahan Baku
                                </h2>
                                {kebutuhanBahan.length > 0 &&
                                    (stokCukup ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                                            <CheckCircle className="size-4" />
                                            Semua stok mencukupi
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm font-medium text-destructive">
                                            <XCircle className="size-4" />
                                            Ada stok tidak mencukupi
                                        </span>
                                    ))}
                            </div>
                            {kebutuhanBahan.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bahan Baku</TableHead>
                                            <TableHead>Kode</TableHead>
                                            <TableHead className="text-right">
                                                Dibutuhkan
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Tersedia
                                            </TableHead>
                                            <TableHead className="text-center">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kebutuhanBahan.map(
                                            (bahan: KebutuhanBahan) => (
                                                <TableRow key={bahan.id}>
                                                    <TableCell className="font-medium">
                                                        {bahan.nama_bahan}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                                        {bahan.kode_bahan}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {bahan.kebutuhan.toFixed(
                                                            2,
                                                        )}{' '}
                                                        {bahan.satuan}
                                                    </TableCell>
                                                    <TableCell
                                                        className={`text-right font-mono ${!bahan.cukup ? 'font-semibold text-destructive' : ''}`}
                                                    >
                                                        {bahan.stok_tersedia.toFixed(
                                                            2,
                                                        )}{' '}
                                                        {bahan.satuan}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {bahan.cukup ? (
                                                            <CheckCircle className="mx-auto size-4 text-green-600 dark:text-green-400" />
                                                        ) : (
                                                            <XCircle className="mx-auto size-4 text-destructive" />
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                                    Produk pada pesanan ini belum memiliki BOM.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kolom kanan — progress */}
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                Progress Produksi
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Selesai
                                    </span>
                                    <span className="font-medium">
                                        {item.qty_selesai} / {item.qty_target}{' '}
                                        pcs
                                    </span>
                                </div>
                                {/* Progress bar */}
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                <p className="text-right text-sm font-semibold">
                                    {progressPct}%
                                </p>
                            </div>

                            {/* Status QC */}
                            <div className="mt-4 border-t pt-4">
                                <p className="mb-1 text-sm text-muted-foreground">
                                    Status QC
                                </p>
                                <span
                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                        item.status_qc === 'lolos'
                                            ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                                            : item.status_qc === 'tidak_lolos'
                                              ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                    }`}
                                >
                                    {item.status_qc === 'belum_dicek' &&
                                        'Belum Dicek'}
                                    {item.status_qc === 'lolos' && 'Lolos QC'}
                                    {item.status_qc === 'tidak_lolos' &&
                                        'Tidak Lolos'}
                                </span>
                            </div>
                        </div>

                        {/* Warning stok tidak cukup — tampil saat draft & stok kurang */}
                        {item.status === 'draft' &&
                            !stokCukup &&
                            kebutuhanBahan.length > 0 && (
                                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                                    Stok bahan baku tidak mencukupi. Produksi
                                    belum bisa dimulai. Lakukan restock terlebih
                                    dahulu.
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}

ProduksiShow.layout = {
    breadcrumbs: [
        { title: 'Produksi', href: produksi.index.url() },
        { title: 'Detail', href: '#' },
    ],
};
