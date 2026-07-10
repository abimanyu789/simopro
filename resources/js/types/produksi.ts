import type { Customer } from './customer';
import type { Pesanan } from './pesanan';
import type { Produk } from './produk';

export type StatusProduksi = 'draft' | 'proses' | 'selesai' | 'dibatalkan';
export type StatusQc = 'belum_dicek' | 'lolos' | 'tidak_lolos';
export type JenisProduksi = 'pesanan' | 'restok';
export type QcStatus = 'lolos' | 'tidak_lolos';

// ─── Entitas DB ───────────────────────────────────────────────────────────────

export interface ProduksiItem {
    id: number;
    produksi_id: number;
    produk_id: number;
    qty_target: number;
    produk?: {
        id: number;
        kode_produk: string;
        nama_produk: string;
    };
}

export interface ProduksiKaryawan {
    id: number;
    produksi_id: number;
    karyawan_id: number;
    karyawan?: {
        id: number;
        nama_karyawan: string;
        jabatan: string | null;
    };
}

export interface DetailProduksi {
    id: number;
    produksi_id: number;
    produk_id: number;
    qty_selesai: number;
    qc_status: QcStatus;
    created_at: string;
    updated_at: string;
    produk?: {
        id: number;
        kode_produk: string;
        nama_produk: string;
    };
}

export interface Produksi {
    id: number;
    pesanan_id: number | null;
    created_by: number;
    jenis_produksi: JenisProduksi;
    deadline: string | null;
    qty_target: number;
    qty_selesai: number;
    status: StatusProduksi;
    status_qc: StatusQc;
    catatan: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    pesanan?: Pesanan & { customer?: Customer };
    produksi_items?: ProduksiItem[];
    produksi_karyawans?: ProduksiKaryawan[];
    detail_produksi?: DetailProduksi[];
}

// ─── Progress per produk ──────────────────────────────────────────────────────

export interface ProgressPerProduk {
    [produkId: number]: {
        lolos: number;
        tidak_lolos: number;
        target: number;
        selesai: boolean;
    };
}

export interface ProdukBelumSelesai {
    id: number;
    kode_produk: string;
    nama_produk: string;
    qty_target: number;
    qty_lolos: number;
    sisa: number;
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

export interface ProduksiItemRestokFormData {
    produk_id: number | '';
    qty_target: number | '';
}

export interface ProduksiFormData {
    jenis_produksi: JenisProduksi;
    pesanan_id: number | '';
    items: ProduksiItemRestokFormData[];
    karyawan_ids: number[];
    deadline: string;
    catatan: string;
}

export interface InputProgressFormData {
    produk_id: number | '';
    qty: number | '';
    qc_status: QcStatus;
}

// ─── Options untuk dropdown ───────────────────────────────────────────────────

export interface PesananOption {
    id: number;
    nomor_pesanan: string;
    status: string;
    tanggal: string;
    total: string;
    customer?: Customer;
}

export interface ProdukOption {
    id: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
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
    links: { url: string | null; label: string; active: boolean }[];
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
    produkList: ProdukOption[];
    karyawanList: KaryawanOption[];
    selectedPesanan:
        | (Pesanan & {
              customer?: Customer;
              detail_pesanan?: import('./pesanan').DetailPesanan[];
          })
        | null;
    kebutuhanBahan: KebutuhanBahan[];
}

export interface ProduksiShowProps {
    produksi: Produksi;
    kebutuhanBahan: KebutuhanBahan[];
    stokCukup: boolean;
    progressPerProduk: ProgressPerProduk;
    produkBelumSelesai: ProdukBelumSelesai[];
}
