import type { Pesanan } from './pesanan';

export type JenisPembayaran = 'dp' | 'pelunasan' | 'termin';

export interface Pembayaran {
    id: number;
    pesanan_id: number;
    tanggal: string | null;
    jenis_pembayaran: JenisPembayaran;
    nominal: string;
    metode: string | null;
    keterangan: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    pesanan?: Pesanan;
    arus_kas?: import('./arus-kas').ArusKas;
}

export interface PembayaranFormData {
    tanggal: string;
    jenis_pembayaran: JenisPembayaran | '';
    nominal: number | '';
    metode: string;
    keterangan: string;
}
