import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { BahanBakuDeleteDialog } from '@/components/bahan-baku/bahan-baku-delete-dialog';
import { Button } from '@/components/ui/button';
import bahanBaku from '@/routes/bahan-baku';
import type { BahanBaku } from '@/types';

interface BahanBakuShowProps {
    bahanBaku: BahanBaku;
}

export default function BahanBakuShow({ bahanBaku: item }: BahanBakuShowProps) {
    const formatNumber = (value: number | null) => {
        if (value === null) {
            return '-';
        }

        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
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
        item.minimum_stok !== null && Number(item.stok) <= Number(item.minimum_stok);

    return (
        <>
            <Head title={`Detail Bahan Baku - ${item.nama_bahan}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={bahanBaku.index()}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="size-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Detail Bahan Baku
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {item.nama_bahan}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={bahanBaku.edit(item.id)}>
                            <Button variant="outline">
                                <Pencil className="mr-2 size-4" />
                                Edit
                            </Button>
                        </Link>
                        <BahanBakuDeleteDialog
                            bahanBaku={item}
                            redirectTo={bahanBaku.index.url()}
                            trigger={
                                <Button variant="destructive">Hapus</Button>
                            }
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Informasi Bahan Baku
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Kode Bahan
                                </p>
                                <p className="mt-1 font-mono text-sm">
                                    {item.kode_bahan}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Nama Bahan
                                </p>
                                <p className="mt-1">{item.nama_bahan}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Satuan
                                </p>
                                <p className="mt-1">
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                        {item.satuan}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Info */}
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
                                    <p className="text-2xl font-bold">
                                        {formatNumber(item.stok)}
                                    </p>
                                    <span className="text-sm text-muted-foreground">
                                        {item.satuan}
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
                                        {formatNumber(item.minimum_stok)}
                                    </p>
                                    <span className="text-sm text-muted-foreground">
                                        {item.satuan}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h2 className="mb-4 text-lg font-semibold">
                            Riwayat Stok
                        </h2>
                        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                            <p className="text-sm text-muted-foreground">
                                Riwayat perubahan stok akan tersedia setelah
                                Modul 9 (Stok Bahan Baku) selesai
                            </p>
                        </div>
                    </div>

                    {/* Metadata */}
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

BahanBakuShow.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Bahan Baku',
            href: bahanBaku.index(),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ],
};
