import type { Customer } from './customer';
import type { Produk } from './produk';

export type StatusPesanan = 'pending' | 'proses' | 'selesai' | 'dibatalkan';
export type TipeDiskon = 'persen' | 'nominal';

export interface DetailPesanan {
    id: number;
    pesanan_id: number;
    produk_id: number;
    qty: number;
    harga: string;
    subtotal: string;
    created_at: string;
    updated_at: string;
    // Relasi
    produk?: Produk;
}

export interface Pesanan {
    id: number;
    customer_id: number;
    created_by: number;
    nomor_pesanan: string;
    tanggal: string;
    status: StatusPesanan;
    subtotal: string;
    diskon: string;
    ongkir: string;
    total: string;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    customer?: Customer;
    detail_pesanan?: DetailPesanan[];
}

// ─── Form data ───────────────────────────────────────────────────────────────

export interface PesananItemFormData {
    produk_id: number | '';
    qty: number | '';
    harga: number | '';
}

export interface PesananFormData {
    customer_id: number | '';
    tanggal: string;
    items: PesananItemFormData[];
    tipe_diskon: TipeDiskon;
    diskon: number | '';
    catatan_diskon: string;
    ongkir: number | '';
    keterangan: string;
}

// ─── Props interfaces ─────────────────────────────────────────────────────────

export interface PesananPagination {
    data: Pesanan[];
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

export interface PesananIndexProps {
    pesanans: PesananPagination;
    filters: {
        search?: string;
        status?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface CustomerOption {
    id: number;
    nama_customer: string;
    jenis_customer: string;
}

export interface ProdukOption {
    id: number;
    kode_produk: string;
    nama_produk: string;
    harga_jual: string | null;
    stok: number;
}

export interface PesananCreateProps {
    customers: CustomerOption[];
    produks: ProdukOption[];
}

export interface PesananEditProps {
    pesanan: Pesanan;
    customers: CustomerOption[];
    produks: ProdukOption[];
}

export interface PesananShowProps {
    pesanan: Pesanan;
    statusTransisi: StatusPesanan[];
}
