import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { ProdukDeleteDialog } from '@/components/produk/produk-delete-dialog';
import { Button } from '@/components/ui/button';
import produk from '@/routes/produk';
import type { ProdukShowProps } from '@/types';

export default function ProdukShow({ produk: item }: ProdukShowProps) {
    const formatHarga = (value: number | null) => {
        if (value === null) {
            return '-';
        }

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const deleteRedirectHref = produk.index.url();

    return (
        <>
            <Head title={`Detail Produk - ${item.nama_produk}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={produk.index()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Produk
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {item.nama_produk}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={produk.edit(item.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                        <ProdukDeleteDialog
                            produk={item}
                            redirectTo={deleteRedirectHref}
                            trigger={
                                <Button variant="destructive">Hapus</Button>
                            }
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Informasi Produk */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Produk
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Kode Produk
                                </p>
                                <p className="mt-1 font-mono text-sm">
                                    {item.kode_produk}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Produk
                                </p>
                                <p className="mt-1">{item.nama_produk}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="mt-1">
                                    {item.ukuran ? (
                                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                            {item.ukuran}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Warna
                                </p>
                                <p className="mt-1">
                                    {item.warna ? (
                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                            {item.warna}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Harga Jual
                                </p>
                                <p className="mt-1 text-lg font-semibold">
                                    {formatHarga(item.harga_jual)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi BOM */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Bill of Materials (BOM)
                        </h2>
                        {item.bom_categorie ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        {item.bom_categorie.nama_bom}
                                    </span>
                                    {item.bom_categorie.keterangan && (
                                        <span className="text-sm text-muted-foreground">
                                            {item.bom_categorie.keterangan}
                                        </span>
                                    )}
                                </div>
                                {(item.bom_categorie.bom_details ?? []).length >
                                0 ? (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-muted-foreground">
                                                <th className="pb-2 text-left font-medium">
                                                    Bahan Baku
                                                </th>
                                                <th className="pb-2 text-left font-medium">
                                                    Kode
                                                </th>
                                                <th className="pb-2 text-right font-medium">
                                                    Qty/Pasang
                                                </th>
                                                <th className="pb-2 text-right font-medium">
                                                    Satuan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(
                                                item.bom_categorie
                                                    .bom_details ?? []
                                            ).map((detail) => (
                                                <tr
                                                    key={detail.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="py-2">
                                                        {detail.bahan_baku
                                                            ?.nama_bahan ?? '-'}
                                                    </td>
                                                    <td className="py-2 font-mono text-xs text-muted-foreground">
                                                        {detail.bahan_baku
                                                            ?.kode_bahan ?? '-'}
                                                    </td>
                                                    <td className="py-2 text-right font-mono">
                                                        {detail.qty_per_pair}
                                                    </td>
                                                    <td className="py-2 text-right text-muted-foreground">
                                                        {detail.bahan_baku
                                                            ?.satuan ?? '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        BOM belum memiliki detail bahan.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Produk ini belum memiliki BOM.
                            </p>
                        )}
                    </div>

                    {/* Riwayat Stok */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Riwayat Stok Terakhir
                        </h2>
                        {(item.stok_history ?? []).length > 0 ? (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="pb-2 text-left font-medium">
                                            Tanggal
                                        </th>
                                        <th className="pb-2 text-left font-medium">
                                            Jenis
                                        </th>
                                        <th className="pb-2 text-right font-medium">
                                            Qty
                                        </th>
                                        <th className="pb-2 text-right font-medium">
                                            Sebelum
                                        </th>
                                        <th className="pb-2 text-right font-medium">
                                            Sesudah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(item.stok_history ?? []).map((h) => (
                                        <tr
                                            key={h.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-2 text-muted-foreground">
                                                {new Date(
                                                    h.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-2 capitalize">
                                                {h.jenis_transaksi}
                                            </td>
                                            <td className="py-2 text-right font-mono">
                                                {h.qty}
                                            </td>
                                            <td className="py-2 text-right font-mono text-muted-foreground">
                                                {h.stok_sebelum}
                                            </td>
                                            <td className="py-2 text-right font-mono font-medium">
                                                {h.stok_sesudah}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Belum ada riwayat perubahan stok.
                            </p>
                        )}
                    </div>

                    {/* Informasi Sistem */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Sistem
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Dibuat Pada
                                </p>
                                <p className="mt-1 text-sm">
                                    {formatDate(item.created_at)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Terakhir Diubah
                                </p>
                                <p className="mt-1 text-sm">
                                    {formatDate(item.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ProdukShow.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Produk', href: produk.index() },
        { title: 'Detail', href: '#' },
    ],
};
