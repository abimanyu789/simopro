export interface ReportType {
    value: string;
    label: string;
}

export interface ReportSummaryCard {
    label: string;
    value: string | number;
    color: 'blue' | 'emerald' | 'red' | 'amber' | 'purple' | 'indigo' | 'gray' | 'green';
}

export interface ReportFilters {
    type: string;
    dari: string;
    sampai: string;
}

export interface ReportPreviewResponse {
    rows: Record<string, unknown>[];
    summary: ReportSummaryCard[];
    total: number;
    title: string;
    headings: string[];
}
