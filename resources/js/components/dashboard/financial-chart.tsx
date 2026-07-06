import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { FinancialChartData } from '@/types';

interface FinancialChartProps {
    data: FinancialChartData[];
}

export function FinancialChart({ data }: FinancialChartProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
            <h3 className="mb-4 text-lg font-semibold">Financial Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="bulan"
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => {
                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}Jt`;
                            if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
                            return value.toString();
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="pemasukan"
                        stroke="hsl(142 76% 36%)"
                        strokeWidth={2}
                        name="Pemasukan"
                        dot={{ fill: 'hsl(142 76% 36%)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pengeluaran"
                        stroke="hsl(0 84% 60%)"
                        strokeWidth={2}
                        name="Pengeluaran"
                        dot={{ fill: 'hsl(0 84% 60%)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
