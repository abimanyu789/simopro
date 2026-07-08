import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { PesananDeleteDialog } from '@/components/pesanan/pesanan-delete-dialog';
import { PesananStatusBadge } from '@/components/pesanan/pesanan-status-badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import pesanan from '@/routes/pesanan';
import type { PesananShowProps, StatusPesanan } from '@/types';

export default function PesananShow({
    pesanan: item,
    statusTransisi,
}: PesananShowProps) {
    const formatRupiah = (value: string | number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(value));

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

    const formatDateTime = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const handleUpdateStatus = (statusBaru: string) => {
        router.patch(
            pesanan.updateStatus.url(item.id),
            { status: statusBaru },
            { preserveScroll: true },
        );
    };

    const statusLabels: Record<StatusPesanan, string> = {
        pending: 'Pending',
        proses: 'Proses',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
    };

    const isLocked = item.status === 'selesai';

    return (
        <>
            <Head title={`Pesanan — ${item.nomor_pesanan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={pesanan.index.url()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {item.nomor_pesanan}
                            </h1>
                            <div className="mt-1 flex items-center gap-2">
                                <PesananStatusBadge status={item.status} />
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(item.tanggal)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isLocked && (
                            <Link href={pesanan.edit.url(item.id)}>
                                <Button variant="outline">
                                    <Pencil className="mr-2 size-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {!isLocked && (
                            <PesananDeleteDialog
                                pesanan={item}
                                redirectTo={pesanan.index.url()}
                                trigger={
                                    <Button
                                        variant="outline"
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                        Hapus
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Kolom kiri — detail & items */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Info Pesanan */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Informasi Pesanan
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-y">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Customer
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {item.customer?.nama_customer ?? '-'}
                                    </p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Tanggal Pesanan
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {formatDate(item.tanggal)}
                                    </p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Dibuat oleh
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {(item as any).created_by_nama ??
                                            'Admin'}
                                    </p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Tanggal Dibuat
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {formatDateTime(item.created_at)}
                                    </p>
                                </div>
                                {item.keterangan && (
                                    <div className="col-span-2 px-6 py-4">
                                        <p className="text-sm text-muted-foreground">
                                            Keterangan
                                        </p>
                                        <p className="mt-1 text-sm">
                                            {item.keterangan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabel Item */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Item Pesanan
                                </h2>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-right">
                                            Harga
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Qty
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Subtotal
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(item.detail_pesanan ?? []).map(
                                        (detail) => (
                                            <TableRow key={detail.id}>
                                                <TableCell>
                                                    <div className="font-medium">
                                                        {detail.produk
                                                            ?.nama_produk ??
                                                            '-'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {detail.produk
                                                            ?.kode_produk ??
                                                            '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm">
                                                    {formatRupiah(detail.harga)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {detail.qty}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-sm font-medium">
                                                    {formatRupiah(
                                                        detail.subtotal,
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ),
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Kolom kanan — ringkasan & status */}
                    <div className="space-y-6">
                        {/* Update Status */}
                        {statusTransisi.length > 0 && (
                            <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                                <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                    Ubah Status
                                </h2>
                                <Select onValueChange={handleUpdateStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih status baru..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusTransisi.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {statusLabels[s]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Ringkasan Pembayaran */}
                        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                Ringkasan Pembayaran
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Subtotal
                                    </span>
                                    <span className="font-mono">
                                        {formatRupiah(item.subtotal)}
                                    </span>
                                </div>
                                {Number(item.diskon) > 0 && (
                                    <div className="flex justify-between text-red-600 dark:text-red-400">
                                        <span>Diskon</span>
                                        <span className="font-mono">
                                            -{formatRupiah(item.diskon)}
                                        </span>
                                    </div>
                                )}
                                {Number(item.ongkir) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Ongkos Kirim
                                        </span>
                                        <span className="font-mono">
                                            {formatRupiah(item.ongkir)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t pt-3 font-semibold">
                                    <span>Total</span>
                                    <span className="font-mono text-lg">
                                        {formatRupiah(item.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PesananShow.layout = {
    breadcrumbs: [
        { title: 'Pesanan', href: pesanan.index.url() },
        { title: 'Detail', href: '#' },
    ],
};
