import { FileDown, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportMethod } from '@/actions/App/Http/Controllers/ReportController';
import type { ReportFilters } from '@/types/report';

interface ReportActionsProps {
    filters: ReportFilters;
    disabled: boolean;
}

function buildExportUrl(filters: ReportFilters, format: 'pdf' | 'excel'): string {
    const params = new URLSearchParams();
    params.set('type', filters.type);
    params.set('format', format);
    if (filters.dari)   params.set('dari', filters.dari);
    if (filters.sampai) params.set('sampai', filters.sampai);
    return exportMethod.url({ query: Object.fromEntries(params) });
}

export function ReportActions({ filters, disabled }: ReportActionsProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                asChild={!disabled}
                onClick={disabled ? undefined : undefined}
            >
                {disabled ? (
                    <span className="flex items-center gap-2">
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </span>
                ) : (
                    <a
                        href={buildExportUrl(filters, 'pdf')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <FileDown className="h-4 w-4" />
                        Export PDF
                    </a>
                )}
            </Button>

            <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                asChild={!disabled}
            >
                {disabled ? (
                    <span className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Export Excel
                    </span>
                ) : (
                    <a
                        href={buildExportUrl(filters, 'excel')}
                        className="flex items-center gap-2"
                    >
                        <FileSpreadsheet className="h-4 w-4" />
                        Export Excel
                    </a>
                )}
            </Button>

            <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={handlePrint}
                className="flex items-center gap-2"
            >
                <Printer className="h-4 w-4" />
                Cetak
            </Button>
        </div>
    );
}
