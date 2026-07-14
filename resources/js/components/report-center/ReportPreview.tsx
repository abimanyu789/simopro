import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ReportPreviewResponse } from '@/types/report';

interface ReportPreviewProps {
    loading: boolean;
    data: ReportPreviewResponse | null;
}

/** Kolom yang akan dirender sebagai Badge */
const BADGE_KEYS = new Set(['status', 'jenis', 'jenis_transaksi', 'status_qc', 'status_stok', 'satuan']);

function renderCell(key: string, value: unknown): React.ReactNode {
    if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">—</span>;

    const str = String(value);

    if (BADGE_KEYS.has(key)) {
        return <Badge variant="secondary" className="capitalize">{str}</Badge>;
    }

    return str;
}

export function ReportPreview({ loading, data }: ReportPreviewProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="text-sm">Pilih jenis laporan dan klik <strong>Tampilkan Preview</strong> untuk melihat data.</p>
            </div>
        );
    }

    if (!data.rows.length) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="text-sm">Tidak ada data untuk filter yang dipilih.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                Menampilkan {data.rows.length} dari {data.total} baris
            </p>
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            {data.headings.map((h) => (
                                <TableHead key={h}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className="text-center text-muted-foreground text-xs">{i + 1}</TableCell>
                                {Object.entries(row).map(([key, val]) => (
                                    <TableCell key={key} className="whitespace-nowrap text-sm">
                                        {renderCell(key, val)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
