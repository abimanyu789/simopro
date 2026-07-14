import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { ReportFilters, ReportType } from '@/types/report';

interface ReportFilterProps {
    filters: ReportFilters;
    reportTypes: ReportType[];
    loading: boolean;
    onFiltersChange: (filters: ReportFilters) => void;
    onPreview: () => void;
}

export function ReportFilter({ filters, reportTypes, loading, onFiltersChange, onPreview }: ReportFilterProps) {
    const update = (key: keyof ReportFilters, value: string) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Jenis laporan */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Jenis Laporan</label>
                <Select value={filters.type} onValueChange={(v) => update('type', v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis laporan..." />
                    </SelectTrigger>
                    <SelectContent>
                        {reportTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                                {t.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Filter periode */}
            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Dari Tanggal</label>
                    <input
                        type="date"
                        value={filters.dari}
                        onChange={(e) => update('dari', e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Sampai Tanggal</label>
                    <input
                        type="date"
                        value={filters.sampai}
                        onChange={(e) => update('sampai', e.target.value)}
                        min={filters.dari || undefined}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <Button
                onClick={onPreview}
                disabled={!filters.type || loading}
                className="w-full"
            >
                {loading ? 'Memuat...' : 'Tampilkan Preview'}
            </Button>
        </div>
    );
}
