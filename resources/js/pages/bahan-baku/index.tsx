import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import bahanBaku from '@/routes/bahan-baku';
import type { BahanBakuIndexProps } from '@/types';

export default function BahanBakuIndex({ bahanBakus, filters }: BahanBakuIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            bahanBaku.index.url(),
            { search },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus bahan baku ini?')) {
            router.delete(bahanBaku.destroy.url(id), {
                preserveScroll: true,
            });
        }
    };

    const formatNumber = (value: number | null) => {
        if (value === null) return '-';
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    return (
        <>
            <Head title="Data Master - Bahan Baku" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Data Master - Bahan Baku</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data bahan baku untuk produksi
                        </p>
                    </div>
                    <Link href={bahanBaku.create()}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah Bahan Baku
                        </Button>
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari kode, nama, atau satuan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Cari
                        </Button>
                    </form>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">No</TableHead>
                                <TableHead>Kode Bahan</TableHead>
                                <TableHead>Nama Bahan</TableHead>
                                <TableHead>Satuan</TableHead>
                                <TableHead className="text-right">Stok</TableHead>
                                <TableHead className="text-right">Min. Stok</TableHead>
                                <TableHead className="w-32 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bahanBakus.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        {filters.search
                                            ? 'Tidak ada data yang ditemukan.'
                                            : 'Belum ada data bahan baku.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bahanBakus.data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {bahanBakus.from + index}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {item.kode_bahan}
                                        </TableCell>
                                        <TableCell>{item.nama_bahan}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                                {item.satuan}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatNumber(item.stok)}
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatNumber(item.minimum_stok)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={bahanBaku.show(item.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={bahanBaku.edit(item.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                               <Link href={bahanBaku.destroy(item.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {bahanBakus.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {bahanBakus.from} - {bahanBakus.to} dari{' '}
                            {bahanBakus.total} data
                        </p>
                        <div className="flex gap-1">
                            {bahanBakus.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={link.url === null}
                                    onClick={() => {
                                        if (link.url) {
                                            router.visit(link.url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

BahanBakuIndex.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Bahan Baku',
            href: bahanBaku.index(),
        },
    ],
};
