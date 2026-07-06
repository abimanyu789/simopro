export interface DashboardStats {
    totalPemasukan: number;
    totalPengeluaran: number;
    pesananAktif: number;
    selesaiProduksi: number;
}

export interface FinancialChartData {
    bulan: string;
    pemasukan: number;
    pengeluaran: number;
}

export interface BestSeller {
    nama_produk: string;
    total_qty: number;
}

export interface ActiveOrder {
    id: number;
    nomor_pesanan: string;
    nama_customer: string;
    status: string;
    status_produksi: string;
    tanggal: string;
    total: number;
    progress: number;
}

export interface TopEmployee {
    nama_karyawan: string;
    jabatan: string;
    total_output: number;
}

export interface DashboardProps {
    stats: DashboardStats;
    financialChart: FinancialChartData[];
    bestSellers: BestSeller[];
    activeOrders: ActiveOrder[];
    topEmployees: TopEmployee[];
}
