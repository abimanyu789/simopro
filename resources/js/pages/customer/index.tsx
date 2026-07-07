import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { CustomerBadge } from '@/components/customer/customer-badge';
import { CustomerDeleteDialog } from '@/components/customer/customer-delete-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import customer from '@/routes/customer';
import type { CustomerIndexProps } from '@/types';

export default function CustomerIndex({ customers, filters }: CustomerIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');

    const sortBy  = filters.sort_by  || 'created_at';
    const sortDir = filters.sort_dir || 'desc';

    type SortableColumn = 'nama_customer' | 'jenis_customer' | 'no_hp' | 'created_at';

    const navigate = (overrides: Record<string, unknown> = {}) => {
        router.get(
            customer.index.url(),
            {
                search: search || undefined,
                jenis:  jenis  || undefined,
                sort_by: sortBy,
                sort_dir: sortDir,
                ...overrides,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSort = (column: SortableColumn) => {
        const newDir = sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        navigate({ sort_by: column, sort_dir: newDir });
    };

    const SortIcon = ({ column }: { column: SortableColumn }) => {
        if (sortBy !== column) return <ChevronsUpDown className="ml-1 inline size-3.5 text-muted-foreground/50" />;
        return sortDir === 'asc'
            ? <ChevronUp className="ml-1 inline size-3.5" />
            : <ChevronDown className="ml-1 inline size-3.5" />;
    };

    const sortableHead = (column: SortableColumn, label: string, className?: string) => (
        <TableHead
            className={`cursor-pointer select-none hover:bg-muted/50 ${className ?? ''}`}
            onClick={() => handleSort(column)}
        >
            {label}<SortIcon column={column} />
        </TableHead>
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ search: search || undefined });
    };

    const handleJenisFilter = (value: string) => {
        const newJenis = value === 'semua' ? '' : value;
        setJenis(newJenis);
        navigate({ jenis: newJenis || undefined });
    };

    return (
        <>
            <Head title="Data Master - Customer" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Master - Customer
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data customer Provillo
                        </p>
                    </div>
                    <Link href={customer.create.url()}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah Customer
                        </Button>
                    </Link>
                </div>

                {/* Toolbar: Search + Filter Jenis */}
                <div className="flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama, no. HP, alamat, atau jenis..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Cari
                        </Button>
                    </form>

                    {/* Filter Jenis */}
                    <Select
                        value={jenis || 'semua'}
                        onValueChange={handleJenisFilter}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Semua Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Jenis</SelectItem>
                            <SelectItem value="b2b">B2B</SelectItem>
                            <SelectItem value="b2c">B2C</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">No</TableHead>
                                {sortableHead('nama_customer', 'Nama Customer')}
                                {sortableHead('jenis_customer', 'Jenis')}
                                {sortableHead('no_hp', 'No. HP')}
                                <TableHead>Alamat</TableHead>
                                <TableHead className="w-32 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center"
                                    >
                                        {filters.search || filters.jenis
                                            ? 'Tidak ada data yang ditemukan.'
                                            : 'Belum ada data customer.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {customers.from + index}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.nama_customer}
                                        </TableCell>
                                        <TableCell>
                                            <CustomerBadge
                                                jenis={item.jenis_customer}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">
                                            {item.no_hp ?? (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                            {item.alamat ?? (
                                                <span className="italic">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={customer.show.url(
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
                                                    href={customer.edit.url(
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
                                                <CustomerDeleteDialog
                                                    customer={item}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {customers.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan {customers.from} - {customers.to} dari{' '}
                            {customers.total} data
                        </p>
                        <div className="flex gap-1">
                            {customers.links.map((link, index) => (
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

CustomerIndex.layout = {
    breadcrumbs: [
        {
            title: 'Data Master',
            href: '#',
        },
        {
            title: 'Customer',
            href: customer.index.url(),
        },
    ],
};
