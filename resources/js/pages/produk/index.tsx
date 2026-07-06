import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ProdukDeleteDialog } from '@/components/produk/produk-delete-dialog';
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
import produk from '@/routes/produk';
import type { ProdukIndexProps } from '@/types';

export default function ProdukIndex({ produks, filters }: ProdukIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            produk.index.url(),
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

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

    return (
        <>
            <Head title="Data Master - Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Master - Produk
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data produk sepatu Provillo
                        </p>
                    </div>
                    <Link href={produk.create()}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah Produk
                        </Button>
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari kode, nama, atau warna..."
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
                                <TableHead>Kode Produk</TableHead>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead>Ukuran</TableHead>
                                <TableHead>Warna</TableHead>
                                <TableHead className="text-right">
                                    Harga Jual
                                </TableHead>
                                <TableHead className="text-right">
                                    Stok
                                </TableHead>
                                <TableHead className="w-32 text-center">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {produks.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="h-24 text-center"
                                    >
                                        {filters.search
                                            ? 'Tidak ada data yang ditemukan.'
                                            : 'Belum ada data produk.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                produks.data.map((item, index) => {
                                    const isLowStock =
                                        item.minimum_stok !== null &&
                                        item.stok <= item.minimum_stok;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {produks.from + index}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {item.kode_produk}
                                            </TableCell>
                                            <TableCell>
                                                {item.nama_produk}
                                            </TableCell>
                                            <TableCell>
                                                {item.ukuran ? (
                                                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                        {item.ukuran}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.warna ? (
                                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                                        {item.warna}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm">
                                                {formatHarga(item.harga_jual)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span
                                                        className={`font-mono text-sm font-medium ${
                                                            isLowStock
                                                                ? 'text-orange-600 dark:text-orange-400'
                                                                : ''
                                                        }`}
                                                    >
                                                        {item.stok}
                                                    </span>
                                                    {isLowStock && (
                                                        <span className="text-xs text-orange-500">
                                                            ⚠ min{' '}
                                                            {item.minimum_stok}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        href={produk.show(
                                                            item.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <Eye className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={produk.edit(
                                                            item.id,
                                                        )}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                    </Link>
                                                    <ProdukDeleteDialog
                                                        produk={item}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {produks.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {produks.from} - {produks.to} dari{' '}
                            {produks.total} data
                        </p>
                        <div className="flex gap-1">
                            {produks.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
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
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ProdukIndex.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Produk', href: produk.index() },
    ],
};
