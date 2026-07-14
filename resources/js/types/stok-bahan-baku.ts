import type { BahanBaku } from './bahan-baku';

export type JenisTransaksiStok =
    'restock' | 'produksi' | 'rollback' | 'penyesuaian';

export interface StokBahanBaku {
    id: number;
    bahan_baku_id: number;
    jenis_transaksi: JenisTransaksiStok;
    qty: number;
    stok_sebelum: number;
    stok_sesudah: number;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    bahan_baku?: BahanBaku;
}

export interface BahanBakuOption {
    id: number;
    kode_bahan: string;
    nama_bahan: string;
    satuan: string;
    stok: number;
}

export interface StokBahanBakuIndexProps {
    riwayat: {
        data: StokBahanBaku[];
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
    bahanBakuOptions: BahanBakuOption[];
    filters: {
        search?: string;
        bahan_baku_id?: string;
        jenis_transaksi?: string;
        tanggal_dari?: string;
        tanggal_sampai?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface StokBahanBakuCreateProps {
    bahanBakuList: BahanBakuOption[];
    selectedId: number | null;
}

export interface StokBahanBakuShowProps {
    transaksi: StokBahanBaku;
}

export interface RestockItemRow {
    bahan_baku_id: number | '';
    qty: number | '';
    keterangan: string;
}

export interface RestockFormData {
    jenis_transaksi: 'restock' | 'penyesuaian';
    items: RestockItemRow[];
}
