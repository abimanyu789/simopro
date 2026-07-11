import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, Pencil, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
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
import pembayaran from '@/routes/pembayaran';
import type {
    PesananShowProps,
    StatusPesanan,
    PembayaranFormData,
} from '@/types';

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
                        {/* Cetak Invoice — tersedia untuk semua status */}
                        <a
                            href={pesanan.invoice.url(item.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline">
                                <FileText className="mr-2 size-4" />
                                Cetak Invoice
                            </Button>
                        </a>
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
                                        Jenis Pembayaran
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {item.jenis_pembayaran ? (
                                            {
                                                dp: 'DP (Down Payment)',
                                                lunas: 'Lunas',
                                                bertahap: 'Bertahap',
                                                cod: 'COD',
                                                termin: 'Termin',
                                            }[item.jenis_pembayaran]
                                        ) : (
                                            <span className="text-muted-foreground">
                                                —
                                            </span>
                                        )}
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

            {/* Section Riwayat Pembayaran */}
            <div className="mx-auto w-full max-w-6xl">
                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Riwayat Pembayaran
                        </h2>
                        {!isLocked && <PembayaranForm pesananId={item.id} />}
                    </div>
                    {(item.pembayarans ?? []).length > 0 ? (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="px-6 py-3 text-left font-medium">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Metode
                                    </th>
                                    <th className="px-6 py-3 text-right font-medium">
                                        Nominal
                                    </th>
                                    <th className="px-6 py-3 text-left font-medium">
                                        Keterangan
                                    </th>
                                    <th className="w-12 px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {(item.pembayarans ?? []).map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-6 py-3">
                                            {p.tanggal
                                                ? new Date(
                                                      p.tanggal,
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      },
                                                  )
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-3 capitalize">
                                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                                                {p.jenis_pembayaran.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {p.metode ?? '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono font-semibold text-green-600 dark:text-green-400">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0,
                                            }).format(Number(p.nominal))}
                                        </td>
                                        <td className="max-w-xs truncate px-6 py-3 text-muted-foreground">
                                            {p.keterangan ?? '-'}
                                        </td>
                                        <td className="px-6 py-3">
                                            {!isLocked && (
                                                <button
                                                    onClick={() =>
                                                        router.delete(
                                                            pembayaran.destroy.url(
                                                                p.id,
                                                            ),
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-destructive"
                                                    title="Hapus pembayaran"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                            Belum ada pembayaran yang dicatat.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Inline form tambah pembayaran ───────────────────────────────────────────

function PembayaranForm({ pesananId }: { pesananId: number }) {
    const { data, setData, post, processing, errors, reset } =
        useForm<PembayaranFormData>({
            tanggal: new Date().toISOString().slice(0, 10),
            jenis_pembayaran: '',
            nominal: '',
            metode: '',
            keterangan: '',
        });
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(pembayaran.store.url(pesananId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return open ? (
        <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-end gap-2"
        >
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tanggal</label>
                <input
                    type="date"
                    value={data.tanggal}
                    onChange={(e) => setData('tanggal', e.target.value)}
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Jenis</label>
                <select
                    value={data.jenis_pembayaran}
                    onChange={(e) =>
                        setData('jenis_pembayaran', e.target.value as any)
                    }
                    className="h-8 rounded-md border bg-background px-2 text-sm"
                >
                    <option value="">Pilih...</option>
                    <option value="dp">DP</option>
                    <option value="pelunasan">Pelunasan</option>
                    <option value="termin">Termin</option>
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                    Nominal (Rp)
                </label>
                <input
                    type="number"
                    min="0.01"
                    value={data.nominal}
                    onChange={(e) =>
                        setData(
                            'nominal',
                            e.target.value === '' ? '' : Number(e.target.value),
                        )
                    }
                    placeholder="0"
                    className="h-8 w-36 rounded-md border bg-background px-2 text-sm"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Metode</label>
                <input
                    type="text"
                    value={data.metode}
                    onChange={(e) => setData('metode', e.target.value)}
                    placeholder="Transfer/Tunai..."
                    className="h-8 w-28 rounded-md border bg-background px-2 text-sm"
                />
            </div>
            <Button type="submit" size="sm" disabled={processing}>
                {processing ? 'Menyimpan...' : 'Simpan'}
            </Button>
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
            >
                Batal
            </Button>
            {Object.values(errors).filter(Boolean).length > 0 && (
                <p className="w-full text-xs text-destructive">
                    {Object.values(errors)[0]}
                </p>
            )}
        </form>
    ) : (
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            + Tambah Pembayaran
        </Button>
    );
}

PesananShow.layout = {
    breadcrumbs: [
        { title: 'Pesanan', href: pesanan.index.url() },
        { title: 'Detail', href: '#' },
    ],
};
