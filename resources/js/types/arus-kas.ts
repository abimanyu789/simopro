import type { Pembayaran } from './pembayaran';

export type JenisArusKas = 'pemasukan' | 'pengeluaran';

export interface ArusKas {
    id: number;
    pembayaran_id: number | null;
    created_by: number;
    tanggal: string | null;
    jenis: JenisArusKas;
    kategori: string | null;
    nominal: string | null;
    metode_pembayaran: string | null;
    keterangan: string | null;
    bukti_transaksi: string | null;
    created_at: string;
    updated_at: string;
    // Relasi
    pembayaran?: Pembayaran;
    created_by_user?: { id: number; nama: string };
}

export interface ArusKasFormData {
    tanggal: string;
    jenis: JenisArusKas | '';
    kategori: string;
    nominal: number | '';
    metode_pembayaran: string;
    keterangan: string;
}

// ─── Ringkasan saldo ──────────────────────────────────────────────────────────

export interface SaldoKas {
    pemasukan: number;
    pengeluaran: number;
    saldo: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface ArusKasPagination {
    data: ArusKas[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
}

// ─── Props interfaces ─────────────────────────────────────────────────────────

export interface ArusKasIndexProps {
    transaksis: ArusKasPagination;
    ringkasan: SaldoKas;
    saldoTotal: SaldoKas;
    filters: {
        search?: string;
        jenis?: string;
        dari?: string;
        sampai?: string;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface ArusKasCreateEditProps {
    transaksi?: ArusKas;
}

export interface ArusKasShowProps {
    transaksi: ArusKas;
}
