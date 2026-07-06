import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { BestSeller } from '@/types';

interface BestSellersChartProps {
    data: BestSeller[];
}

export function BestSellersChart({ data }: BestSellersChartProps) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
            <h3 className="mb-4 text-lg font-semibold">Best Sellers</h3>
            {data.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    Belum ada data penjualan
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="nama_produk"
                            className="text-xs"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis
                            className="text-xs"
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '0.5rem',
                            }}
                            formatter={(value: number) => [`${value} unit`, 'Terjual']}
                        />
                        <Bar
                            dataKey="total_qty"
                            fill="hsl(221 83% 53%)"
                            radius={[8, 8, 0, 0]}
                            name="Jumlah Terjual"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
