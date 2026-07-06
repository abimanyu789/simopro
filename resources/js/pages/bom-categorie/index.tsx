import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { BomCategorieDeleteDialog } from '@/components/bom/bom-categorie-delete-dialog';
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
import bomCategorie from '@/routes/bom-categorie';
import type { BomCategorieIndexProps } from '@/types';

export default function BomCategorieIndex({ bomCategories, filters }: BomCategorieIndexProps) {
    const [search, setSearch] = useState(filters.search ?? '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            bomCategorie.index.url(),
            { search },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Bill of Materials (BOM)" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Bill of Materials (BOM)
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola komposisi bahan baku untuk setiap produk
                        </p>
                    </div>
                    <Link href={bomCategorie.create()}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah BOM
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
                                placeholder="Cari nama BOM atau keterangan..."
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
                                <TableHead>Nama BOM</TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead className="text-center">Jml Bahan</TableHead>
                                <TableHead className="text-center">Dipakai Produk</TableHead>
                                <TableHead className="w-32 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bomCategories.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        {filters.search
                                            ? 'Tidak ada data yang ditemukan.'
                                            : 'Belum ada data BOM.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                bomCategories.data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {bomCategories.from + index}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.nama_bom}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                            {item.keterangan ?? '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                                                {item.bom_details_count ?? 0} bahan
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {(item.produk_count ?? 0) > 0 ? (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
                                                    {item.produk_count} produk
                                                </span>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1">
                                                <Link href={bomCategorie.show(item.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={bomCategorie.edit(item.id)}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <BomCategorieDeleteDialog bomCategorie={item} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {bomCategories.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {bomCategories.from} - {bomCategories.to} dari{' '}
                            {bomCategories.total} data
                        </p>
                        <div className="flex gap-1">
                            {bomCategories.links.map((link, i) => (
                                <Button
                                    key={i}
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

BomCategorieIndex.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Bill of Materials', href: bomCategorie.index() },
    ],
};
