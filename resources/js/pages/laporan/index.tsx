import { Head, useHttp } from '@inertiajs/react';
import { FileBarChart2, FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { useState } from 'react';
import { ReportFilter } from '@/components/report-center/ReportFilter';
import { ReportPreview } from '@/components/report-center/ReportPreview';
import { ReportSummary } from '@/components/report-center/ReportSummary';
import { Button } from '@/components/ui/button';
import { exportMethod, index, preview as previewAction } from '@/actions/App/Http/Controllers/ReportController';
import type { ReportFilters, ReportPreviewResponse, ReportType } from '@/types/report';

interface Props {
    reportTypes: ReportType[];
}

const DEFAULT_FILTERS: ReportFilters = { type: '', dari: '', sampai: '' };

export default function LaporanIndex({ reportTypes }: Props) {
    const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
    const [data, setData]       = useState<ReportPreviewResponse | null>(null);
    const [error, setError]     = useState<string | null>(null);

    const previewHttp = useHttp({
        type:   '',
        dari:   null as string | null,
        sampai: null as string | null,
    });

    const handlePreview = () => {
        if (!filters.type) return;
        setError(null);
        setData(null);

        previewHttp.setData({
            type:   filters.type,
            dari:   filters.dari   || null,
            sampai: filters.sampai || null,
        });

        previewHttp.post(previewAction.url(), {
            onSuccess: (response) => {
                setData(response as ReportPreviewResponse);
            },
            onError: (errors) => {
                const first = Object.values(errors)[0];
                setError(typeof first === 'string' ? first : 'Gagal memuat preview laporan.');
            },
        });
    };

    const buildExportUrl = (format: 'pdf' | 'excel') => {
        const params = new URLSearchParams();
        params.set('type', filters.type);
        params.set('format', format);
        if (filters.dari)   params.set('dari', filters.dari);
        if (filters.sampai) params.set('sampai', filters.sampai);
        return exportMethod.url({ query: Object.fromEntries(params) });
    };

    const loading = previewHttp.processing;
    const hasData = !!data && data.rows.length > 0;

    return (
        <>
            <Head title="Pusat Laporan" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <FileBarChart2 className="h-6 w-6" />
                            Pusat Laporan
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Generate, preview, dan export laporan operasional SIMOPRO.
                        </p>
                    </div>

                    {/* Export actions — muncul setelah ada data */}
                    {hasData && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={buildExportUrl('pdf')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Export PDF
                                </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <a href={buildExportUrl('excel')} className="flex items-center gap-2">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    Export Excel
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.print()}
                                className="flex items-center gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Cetak
                            </Button>
                        </div>
                    )}
                </div>

                {/* Body — dua kolom */}
                <div className="flex flex-1 gap-6 overflow-hidden">
                    {/* Panel kiri — filter */}
                    <aside className="w-72 shrink-0 rounded-xl border bg-card p-5 shadow-sm overflow-y-auto">
                        <p className="text-sm font-semibold mb-4">Filter Laporan</p>
                        <ReportFilter
                            filters={filters}
                            reportTypes={reportTypes}
                            loading={loading}
                            onFiltersChange={setFilters}
                            onPreview={handlePreview}
                        />
                    </aside>

                    {/* Panel kanan — hasil */}
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                        {/* Error */}
                        {error && (
                            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Title laporan */}
                        {data && (
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{data.title}</h2>
                                <span className="text-xs text-muted-foreground">
                                    {data.total} total baris
                                </span>
                            </div>
                        )}

                        {/* Summary cards */}
                        {data && <ReportSummary summary={data.summary} />}

                        {/* Preview tabel */}
                        <ReportPreview loading={loading} data={data} />
                    </div>
                </div>
            </div>
        </>
    );
}

LaporanIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pusat Laporan', href: index.url() },
    ],
};
