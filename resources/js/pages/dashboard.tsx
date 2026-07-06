import { Head } from '@inertiajs/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    DollarSign,
    Package,
    ShoppingCart,
    Target,
} from 'lucide-react';
import { BestSellersChart } from '@/components/dashboard/best-sellers-chart';
import { FinancialChart } from '@/components/dashboard/financial-chart';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dashboard } from '@/routes';
import type { DashboardProps } from '@/types';

export default function Dashboard({
    stats,
    financialChart,
    bestSellers,
    activeOrders,
    topEmployees,
}: DashboardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan operasional Provillo
                        </p>
                    </div>
                    <button className="rounded-lg border border-sidebar-border/70 bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                        Download Report
                    </button>
                </div>

                {/* Filter Row - Non-functional UI */}
                <div className="flex flex-wrap gap-2">
                    <select className="rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm">
                        <option>Bulan Ini</option>
                    </select>
                    <select className="rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm">
                        <option>Semua Kategori</option>
                    </select>
                    <select className="rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm">
                        <option>Semua Status</option>
                    </select>
                    <select className="rounded-lg border border-sidebar-border/70 bg-background px-3 py-1.5 text-sm">
                        <option>Semua Model</option>
                    </select>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pemasukan"
                        value={formatCurrency(stats.totalPemasukan)}
                        icon={DollarSign}
                        iconClassName="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-500"
                        trend="up"
                        trendValue="Bulan ini"
                    />
                    <StatCard
                        title="Total Pengeluaran"
                        value={formatCurrency(stats.totalPengeluaran)}
                        icon={ArrowDownRight}
                        iconClassName="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-500"
                        trend="down"
                        trendValue="Bulan ini"
                    />
                    <StatCard
                        title="Pesanan Aktif"
                        value={stats.pesananAktif}
                        icon={ShoppingCart}
                        iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-500"
                        trendValue="Pending & Proses"
                    />
                    <StatCard
                        title="Selesai Produksi"
                        value={`${stats.selesaiProduksi} unit`}
                        icon={Target}
                        iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-500"
                        trendValue="Bulan ini"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <FinancialChart data={financialChart} />
                    <BestSellersChart data={bestSellers} />
                </div>

                {/* Bottom Panels */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Active Orders Progress */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h3 className="mb-4 text-lg font-semibold">Active Orders Progress</h3>
                        {activeOrders.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                                Tidak ada pesanan aktif
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="space-y-2 rounded-lg border border-sidebar-border/50 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {order.nomor_pesanan}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.nama_customer}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge
                                                    variant={
                                                        order.status === 'proses'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {order.status_produksi}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Progress Produksi</span>
                                                <span>{order.progress}%</span>
                                            </div>
                                            <Progress value={order.progress} className="h-2" />
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{formatDate(order.tanggal)}</span>
                                            <span>{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Employee Performance */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                        <h3 className="mb-4 text-lg font-semibold">Top Employee Performance</h3>
                        {topEmployees.length === 0 ? (
                            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
                                Belum ada data produksi
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topEmployees.map((employee, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border border-sidebar-border/50 p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {employee.nama_karyawan}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {employee.jabatan}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {employee.total_output}
                                            </p>
                                            <p className="text-xs text-muted-foreground">unit</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
