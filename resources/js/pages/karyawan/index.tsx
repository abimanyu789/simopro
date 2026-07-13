import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Pencil, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { KaryawanBadge } from '@/components/karyawan/karyawan-badge';
import { KaryawanDeleteDialog } from '@/components/karyawan/karyawan-delete-dialog';
import { ExportImportMenu } from '@/components/shared/export-import-menu';
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
import karyawan from '@/routes/karyawan';
import type { KaryawanIndexProps } from '@/types';

type SortableColumn = 'nama_karyawan' | 'jabatan' | 'no_hp' | 'status' | 'created_at';

export default function KaryawanIndex({
    karyawans,
    jabatanOptions,
    filters,
}: KaryawanIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [jabatan, setJabatan] = useState(filters.jabatan || '');
    const [status, setStatus] = useState(filters.status || '');

    const sortBy  = filters.sort_by  || 'created_at';
    const sortDir = filters.sort_dir || 'desc';
    const perPage = filters.per_page || 15;

    const navigate = (overrides: Record<string, unknown> = {}) => {
        router.get(
            karyawan.index.url(),
            {
                search:   search   || undefined,
                jabatan:  jabatan  || undefined,
                status:   status   || undefined,
                sort_by:  sortBy,
                sort_dir: sortDir,
                per_page: perPage,
                ...overrides,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ search: search || undefined });
    };

    const handleJabatanFilter = (value: string) => {
        const newVal = value === 'semua' ? '' : value;
        setJabatan(newVal);
        navigate({ jabatan: newVal || undefined });
    };

    const handleStatusFilter = (value: string) => {
        const newVal = value === 'semua' ? '' : value;
        setStatus(newVal);
        navigate({ status: newVal || undefined });
    };

    const handleSort = (column: SortableColumn) => {
        const newDir =
            sortBy === column && sortDir === 'asc' ? 'desc' : 'asc';
        navigate({ sort_by: column, sort_dir: newDir });
    };

    const handlePerPage = (value: string) => {
        navigate({ per_page: Number(value) });
    };

    const activeFilterCount = [jabatan, status].filter(Boolean).length;

    const SortIcon = ({ column }: { column: SortableColumn }) => {
        if (sortBy !== column)
            return <ChevronsUpDown className="ml-1 inline size-3.5 text-muted-foreground/50" />;
        return sortDir === 'asc'
            ? <ChevronUp className="ml-1 inline size-3.5" />
            : <ChevronDown className="ml-1 inline size-3.5" />;
    };

    const sortableHead = (column: SortableColumn, label: string, className?: string) => (
        <TableHead
            className={`cursor-pointer select-none hover:bg-muted/50 ${className ?? ''}`}
            onClick={() => handleSort(column)}
        >
            {label}
            <SortIcon column={column} />
        </TableHead>
    );

    return (
        <>
            <Head title="Data Master - Karyawan" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Data Master - Karyawan
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola data karyawan Provillo
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ExportImportMenu
                            exportExcelUrl={karyawan.export.url() + '?format=excel'}
                            exportPdfUrl={karyawan.export.url() + '?format=pdf'}
                            templateUrl={karyawan.template.url()}
                            importUrl={karyawan.import.url()}
                            modelName="Karyawan"
                        />
                        <Link href={karyawan.create.url()}>
                            <Button>
                                <Plus className="mr-2 size-4" />
                                Tambah Karyawan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Toolbar: Search + Filter */}
                <div className="flex flex-wrap items-center gap-3">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-1 items-center gap-2"
                    >
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari nama, jabatan, atau nomor HP..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">
                            Cari
                        </Button>
                    </form>

                    {/* Filter Jabatan */}
                    <Select
                        value={jabatan || 'semua'}
                        onValueChange={handleJabatanFilter}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="Semua Jabatan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Jabatan</SelectItem>
                            {jabatanOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Filter Status */}
                    <Select
                        value={status || 'semua'}
                        onValueChange={handleStatusFilter}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Status</SelectItem>
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Reset filter */}
                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={() => {
                                setJabatan('');
                                setStatus('');
                                navigate({
                                    jabatan: undefined,
                                    status:  undefined,
                                });
                            }}
                        >
                            Reset filter ({activeFilterCount})
                        </Button>
                    )}
                </div>

                {/* Table */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">No</TableHead>
                                {sortableHead('nama_karyawan', 'Nama Karyawan')}
                                {sortableHead('jabatan', 'Jabatan')}
                                {sortableHead('no_hp', 'Nomor HP')}
                                {sortableHead('status', 'Status')}
                                <TableHead className="w-32 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {karyawans.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {filters.search || filters.jabatan || filters.status
                                            ? 'Tidak ada data yang ditemukan.'
                                            : 'Belum ada data karyawan.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                karyawans.data.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-muted-foreground">
                                            {karyawans.from + index}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {item.nama_karyawan}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.jabatan ?? (
                                                <span className="italic text-muted-foreground/60">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.no_hp ?? (
                                                <span className="italic text-muted-foreground/60">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <KaryawanBadge status={item.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-1">
                                                <Link href={karyawan.show.url(item.id)}>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <Eye className="size-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={karyawan.edit.url(item.id)}>
                                                    <Button variant="ghost" size="icon" className="size-8">
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                </Link>
                                                <KaryawanDeleteDialog karyawan={item} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination + Per-page */}
                <div className="flex items-center justify-between">
                    {/* Show entries selector */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Tampilkan</span>
                        <Select
                            value={String(perPage)}
                            onValueChange={handlePerPage}
                        >
                            <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>entri</span>
                        {karyawans.total > 0 && (
                            <span className="ml-2">
                                — menampilkan {karyawans.from}–{karyawans.to} dari{' '}
                                {karyawans.total} data
                            </span>
                        )}
                    </div>

                    {/* Page buttons */}
                    {karyawans.last_page > 1 && (
                        <div className="flex gap-1">
                            {karyawans.links.map((link, index) => (
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
                    )}
                </div>
            </div>
        </>
    );
}

KaryawanIndex.layout = {
    breadcrumbs: [
        { title: 'Data Master', href: '#' },
        { title: 'Karyawan', href: karyawan.index.url() },
    ],
};
