import { Card, CardContent } from '@/components/ui/card';
import type { ReportSummaryCard } from '@/types/report';

interface ReportSummaryProps {
    summary: ReportSummaryCard[];
}

const colorMap: Record<ReportSummaryCard['color'], string> = {
    blue:    'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    red:     'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    amber:   'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    purple:  'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    indigo:  'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    gray:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    green:   'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
};

export function ReportSummary({ summary }: ReportSummaryProps) {
    if (!summary.length) return null;

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {summary.map((card, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardContent className={`p-4 ${colorMap[card.color] ?? colorMap.gray}`}>
                        <p className="text-xs font-medium opacity-70">{card.label}</p>
                        <p className="mt-1 text-lg font-bold">{card.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
