export interface BahanBaku {
    id: number;
    kode_bahan: string;
    nama_bahan: string;
    satuan: string;
    stok: number;
    minimum_stok: number | null;
    created_at: string;
    updated_at: string;
}

export interface BahanBakuFormData {
    kode_bahan: string;
    nama_bahan: string;
    satuan: string;
    stok: number;
    minimum_stok: number | null;
}

export interface SatuanOption {
    value: string;
    label: string;
}

export interface BahanBakuIndexProps {
    bahanBakus: {
        data: BahanBaku[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search?: string;
    };
}

export interface BahanBakuCreateEditProps {
    bahanBaku?: BahanBaku;
    satuanOptions: SatuanOption[];
}
