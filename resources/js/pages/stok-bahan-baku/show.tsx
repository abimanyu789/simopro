import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import stokBahanBaku from '@/routes/stok-bahan-baku';
import bahanBaku from '@/routes/bahan-baku';
import type { JenisTransaksiStok, StokBahanBakuShowProps } from '@/types';

export default function StokBahanBakuShow({ transaksi }: StokBahanBakuShowProps) {
    const formatNumber = (value: number) =>
        new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const jenisBadge = (jenis: JenisTransaksiStok) => {
        const map: Record<JenisTransaksiStok, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
            restock:    { label: 'Restock',    variant: 'default' },
            produksi:   { label: 'Produksi',   variant: 'secondary' },
            rollback:   { label: 'Rollback',   variant: 'outline' },
            adjustment: { label: 'Adjustment', variant: 'outline' },
        };
        const config = map[jenis] ?? { label: jenis, variant: 'outline' as const };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const bahan = transaksi.bahan_baku;

    return (
        <>
            <Head title={`Detail Transaksi Stok #${transaksi.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={stokBahanBaku.index.url()}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Detail Transaksi Stok
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            ID Transaksi #{transaksi.id}
                        </p>
                    </div>
                </div>

                {/* Detail Card */}
                <div className="mx-auto w-full max-w-2xl">
                    <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                        {/* Bahan Baku Section */}
                        <div className="border-b px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Bahan Baku
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-0 divide-x divide-y">
                            <div className="px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">Nama Bahan</p>
                                <p className="mt-1 font-semibold">
                                    {bahan?.nama_bahan ?? '-'}
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">Kode Bahan</p>
                                <p className="mt-1 font-mono font-semibold">
                                    {bahan ? (
                                        <Link
                                            href={bahanBaku.show.url(bahan.id)}
                                            className="text-primary underline-offset-4 hover:underline"
                                        >
                                            {bahan.kode_bahan}
                                        </Link>
                                    ) : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Transaksi Section */}
                        <div className="border-b border-t px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Detail Transaksi
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 gap-0 divide-x divide-y">
                            <div className="px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">Jenis Transaksi</p>
                                <p className="mt-1">
                                    {jenisBadge(transaksi.jenis_transaksi)}
                                </p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">Tanggal</p>
                                <p className="mt-1 text-sm">{formatDate(transaksi.created_at)}</p>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Qty{bahan ? ` (${bahan.satuan})` : ''}
                                </p>
                                <p className="mt-1 font-mono text-lg font-bold">
                                    +{formatNumber(transaksi.qty)}
                                </p>
                            </div>
                            <div className="col-span-1 px-6 py-4">
                                <p className="text-sm font-medium text-muted-foreground">Keterangan</p>
                                <p className="mt-1 text-sm">
                                    {transaksi.keterangan ?? (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Perubahan Stok Section */}
                        <div className="border-b border-t px-6 py-4">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Perubahan Stok
                            </h2>
                        </div>
                        <div className="grid grid-cols-3 gap-0 divide-x">
                            <div className="px-6 py-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">Stok Sebelum</p>
                                <p className="mt-1 font-mono text-xl font-semibold text-muted-foreground">
                                    {formatNumber(transaksi.stok_sebelum)}
                                </p>
                            </div>
                            <div className="px-6 py-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">Perubahan</p>
                                <p className="mt-1 font-mono text-xl font-bold text-green-600 dark:text-green-400">
                                    +{formatNumber(transaksi.qty)}
                                </p>
                            </div>
                            <div className="px-6 py-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">Stok Sesudah</p>
                                <p className="mt-1 font-mono text-xl font-semibold">
                                    {formatNumber(transaksi.stok_sesudah)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StokBahanBakuShow.layout = {
    breadcrumbs: [
        { title: 'Stok', href: '#' },
        { title: 'Bahan Baku', href: stokBahanBaku.index.url() },
        { title: 'Detail', href: '#' },
    ],
};
