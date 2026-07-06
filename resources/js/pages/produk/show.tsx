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

    const isLowStock =
        item.minimum_stok !== null && item.stok <= item.minimum_stok;

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

                    {/* Informasi Stok */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Stok
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Stok Saat Ini
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <p
                                        className={`text-2xl font-bold ${
                                            isLowStock
                                                ? 'text-orange-600 dark:text-orange-400'
                                                : ''
                                        }`}
                                    >
                                        {item.stok}
                                    </p>
                                    <span className="text-sm text-muted-foreground">
                                        pasang
                                    </span>
                                </div>
                                {isLowStock && (
                                    <p className="mt-1 text-sm text-orange-600 dark:text-orange-500">
                                        ⚠️ Stok di bawah minimum
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Minimum Stok
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-2xl font-bold">
                                        {item.minimum_stok ?? '-'}
                                    </p>
                                    {item.minimum_stok !== null && (
                                        <span className="text-sm text-muted-foreground">
                                            pasang
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Informasi BOM */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Bill of Materials (BOM)
                        </h2>
                        <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                            <p className="text-sm text-muted-foreground">
                                Informasi BOM akan tersedia setelah Modul 5
                                (Bill of Materials) selesai
                            </p>
                        </div>
                    </div>

                    {/* Riwayat Stok */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Riwayat Stok
                        </h2>
                        <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                            <p className="text-sm text-muted-foreground">
                                Riwayat perubahan stok akan tersedia setelah
                                Modul 10 (Stok Produk Jadi) selesai
                            </p>
                        </div>
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
