import type { Produk } from './produk';

export type JenisTransaksiProduk =
    'produksi' | 'pengiriman' | 'rollback' | 'penyesuaian';

export interface StokProdukJadi {
    id: number;
    produk_id: number;
    jenis_transaksi: JenisTransaksiProduk;
    qty: number;
    stok_sebelum: number;
    stok_sesudah: number;
    keterangan: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
    // Relasi
    produk?: Produk;
}

export interface StokProdukOption {
    id: number;
    kode_produk: string;
    nama_produk: string;
    stok: number;
}

export interface StokProdukJadiIndexProps {
    riwayat: {
        data: StokProdukJadi[];
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
    };
    produkOptions: StokProdukOption[];
    filters: {
        search?: string;
        produk_id?: string;
        jenis_transaksi?: string;
        tanggal_dari?: string;
        tanggal_sampai?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface StokProdukJadiCreateProps {
    produkList: StokProdukOption[];
    selectedId: number | null;
}

export interface StokProdukJadiShowProps {
    transaksi: StokProdukJadi;
}

export interface PengirimanFormData {
    produk_id: number | '';
    jenis_transaksi: 'pengiriman' | 'penyesuaian';
    qty: number | '';
    keterangan: string;
}
