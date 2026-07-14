import { Head, Link, router } from '@inertiajs/react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ArusKasBadge } from '@/components/arus-kas/arus-kas-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import arusKas from '@/routes/arus-kas';
import type { ArusKasIndexProps } from '@/types';

export default function ArusKasIndex({ transaksis, ringkasan, saldoTotal, filters }: ArusKasIndexProps) {
    const [search, setSearch]   = useState(filters.search || '');
    const [jenis, setJenis]     = useState(filters.jenis || '');
    const [dari, setDari]       = useState(filters.dari || '');
    const [sampai, setSampai]   = useState(filters.sampai || '');

    const sortBy  = filters.sort_by  || 'tanggal';
    const sortDir = filters.sort_dir || 'desc';

    type SortableColumn = 'tanggal' | 'nominal' | 'jenis' | 'kategori';

    const navigate = (overrides: Record<string, unknown> = {}) => {
        router.get(arusKas.index.url(), {
            search:  search || undefined,
            jenis:   jenis || undefined,
            dari:    dari || undefined,
            sampai:  sampai || undefined,
            sort_by: sortBy,
            sort_dir: sortDir,
            ...overrides,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleSort = (col: SortableColumn) => {
        const newDir = sortBy === col && sortDir === 'asc' ? 'desc' : 'asc';
        navigate({ sort_by: col, sort_dir: newDir });
    };

    const SortIcon = ({ col }: { col: SortableColumn }) => {
        if (sortBy !== col) return <ChevronsUpDown className="ml-1 inline size-3.5 opacity-50" />;
        return sortDir === 'asc'
            ? <ChevronUp className="ml-1 inline size-3.5" />
            : <ChevronDown className="ml-1 inline size-3.5" />;
    };

    const handleReset = () => {
        setSearch(''); setJenis(''); setDari(''); setSampai('');
        router.get(arusKas.index.url(), {}, { preserveState: false });
    };

    const formatRupiah = (v: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

    const formatDate = (s: string | null) =>
        s ? new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

    const activeFilterCount = [jenis, dari, sampai].filter(Boolean).length;

    return (
        <>
            <Head title="Arus Kas" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Arus Kas</h1>
                        <p className="text-sm text-muted-foreground">Kelola pemasukan dan pengeluaran kas</p>
                    </div>
                    <Link href={arusKas.create.url()}>
                        <Button>
                            <Plus className="mr-2 size-4" />
                            Tambah Data
                        </Button>
                    </Link>
                </div>

                {/* Stat Cards — data aktual dari DB */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemasukan</CardTitle>
                            <div className="size-2 rounded-full bg-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatRupiah(saldoTotal.pemasukan)}
                            </p>
                            {(dari || sampai) && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Periode: {formatRupiah(ringkasan.pemasukan)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
                            <div className="size-2 rounded-full bg-red-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatRupiah(saldoTotal.pengeluaran)}
                            </p>
                            {(dari || sampai) && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Periode: {formatRupiah(ringkasan.pengeluaran)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Kas</CardTitle>
                            <div className={`size-2 rounded-full ${saldoTotal.saldo >= 0 ? 'bg-primary' : 'bg-destructive'}`} />
                        </CardHeader>
                        <CardContent>
                            <p className={`text-2xl font-bold ${saldoTotal.saldo >= 0 ? '' : 'text-destructive'}`}>
                                {formatRupiah(saldoTotal.saldo)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">Saldo keseluruhan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
                    <div className="flex flex-col gap-3">
                        <form onSubmit={(e) => { e.preventDefault(); navigate({ search: search || undefined }); }} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kategori atau keterangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button type="submit" variant="secondary">Cari</Button>
                            {(search || activeFilterCount > 0) && (
                                <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
                            )}
                        </form>
                        <div className="flex flex-wrap gap-2">
                            <Select value={jenis || 'semua'} onValueChange={(v) => { const val = v === 'semua' ? '' : v; setJenis(val); navigate({ jenis: val || undefined }); }}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua Jenis</SelectItem>
                                    <SelectItem value="pemasukan">Pemasukan</SelectItem>
                                    <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">Dari</span>
                                <Input type="date" value={dari} onChange={(e) => { setDari(e.target.value); navigate({ dari: e.target.value || undefined }); }} className="w-40" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-muted-foreground">Sampai</span>
                                <Input type="date" value={sampai} onChange={(e) => { setSampai(e.target.value); navigate({ sampai: e.target.value || undefined }); }} className="w-40" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('tanggal')}>
                                    Tanggal<SortIcon col="tanggal" />
                                </TableHead>
                                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('jenis')}>
                                    Jenis<SortIcon col="jenis" />
                                </TableHead>
                                <TableHead className="cursor-pointer select-none" onClick={() => handleSort('kategori')}>
                                    Kategori<SortIcon col="kategori" />
                                </TableHead>
                                <TableHead>Keterangan</TableHead>
                                <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('nominal')}>
                                    Nominal<SortIcon col="nominal" />
                                </TableHead>
                                <TableHead className="w-16 text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaksis.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                        {search || jenis || dari || sampai ? 'Tidak ada data yang ditemukan.' : 'Belum ada transaksi kas.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transaksis.data.map((item, idx) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-muted-foreground">
                                            {(transaksis.current_page - 1) * transaksis.per_page + idx + 1}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-sm">{formatDate(item.tanggal)}</TableCell>
                                        <TableCell><ArusKasBadge jenis={item.jenis} /></TableCell>
                                        <TableCell className="text-sm">{item.kategori ?? '-'}</TableCell>
                                        <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                                            {item.keterangan ?? '-'}
                                        </TableCell>
                                        <TableCell className={`text-right font-mono font-medium ${item.jenis === 'pemasukan' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {item.jenis === 'pengeluaran' ? '−' : '+'} {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(Number(item.nominal))}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Link href={arusKas.show.url(item.id)}>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs">Detail</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {transaksis.last_page > 1 && (
                        <div className="flex items-center justify-between border-t px-4 py-3">
                            <p className="text-sm text-muted-foreground">
                                Menampilkan {transaksis.from ?? 0}–{transaksis.to ?? 0} dari {transaksis.total} data
                            </p>
                            <div className="flex gap-1">
                                {transaksis.links.map((link, i) => (
                                    <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ArusKasIndex.layout = {
    breadcrumbs: [
        { title: 'Arus Kas', href: arusKas.index.url() },
    ],
};
