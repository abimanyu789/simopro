import type { Customer } from './customer';
import type { Pesanan } from './pesanan';

export type StatusProduksi = 'draft' | 'proses' | 'selesai' | 'dibatalkan';
export type StatusQc = 'belum_dicek' | 'lolos' | 'tidak_lolos';

export interface DetailProduksi {
    id: number;
    produksi_id: number;
    produk_id: number;
    karyawan_id: number;
    qty_selesai: number;
    created_at: string;
    updated_at: string;
    // Relasi
    karyawan?: {
        id: number;
        nama_karyawan: string;
        jabatan: string | null;
    };
    produk?: {
        id: number;
        kode_produk: string;
        nama_produk: string;
    };
}

export interface Produksi {
    id: number;
    pesanan_id: number;
    created_by: number;
    deadline: string | null;
    qty_target: number;
    qty_selesai: number;
    status: StatusProduksi;
    status_qc: StatusQc;
    catatan: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    pesanan?: Pesanan & {
        customer?: Customer;
    };
    detail_produksi?: DetailProduksi[];
}

// ─── Kebutuhan bahan dari BOM ─────────────────────────────────────────────────

export interface KebutuhanBahan {
    id: number;
    kode_bahan: string;
    nama_bahan: string;
    satuan: string;
    kebutuhan: number;
    stok_tersedia: number;
    cukup: boolean;
}

// ─── Form data ────────────────────────────────────────────────────────────────

export interface ProduksiFormData {
    pesanan_id: number | '';
    deadline: string;
    catatan: string;
}

export interface InputProgressFormData {
    produk_id: number | '';
    karyawan_id: number | '';
    qty: number | '';
    qc_lolos: boolean;
}

// ─── Pesanan option untuk dropdown ───────────────────────────────────────────

export interface PesananOption {
    id: number;
    nomor_pesanan: string;
    status: string;
    tanggal: string;
    total: string;
    customer?: Customer;
}

// ─── Produk & Karyawan list untuk form progress ───────────────────────────────

export interface ProdukProgressOption {
    id: number;
    kode_produk: string;
    nama_produk: string;
    qty_pesanan: number;
}

export interface KaryawanOption {
    id: number;
    nama_karyawan: string;
    jabatan: string | null;
}

// ─── Summary cards ────────────────────────────────────────────────────────────

export interface ProduksiSummary {
    batch_hari_ini: number;
    qty_selesai_hari_ini: number;
    karyawan_produktif: {
        nama: string;
        total_qty: number;
        kontribusi: number;
    } | null;
    efisiensi: {
        qty_selesai: number;
        qty_target: number;
        persentase: number;
    };
}

// ─── Props interfaces ─────────────────────────────────────────────────────────

export interface ProduksiPagination {
    data: Produksi[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface ProduksiIndexProps {
    produksis: ProduksiPagination;
    summary: ProduksiSummary;
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface ProduksiCreateProps {
    pesananValid: PesananOption[];
    selectedPesanan: (Pesanan & { customer?: Customer }) | null;
    kebutuhanBahan: KebutuhanBahan[];
}

export interface ProduksiShowProps {
    produksi: Produksi;
    kebutuhanBahan: KebutuhanBahan[];
    stokCukup: boolean;
    produkList: ProdukProgressOption[];
    karyawanList: KaryawanOption[];
}
