export interface BomDetail {
    id: number;
    bom_category_id: number;
    bahan_baku_id: number;
    qty_per_pair: number;
    bahan_baku?: {
        id: number;
        kode_bahan: string;
        nama_bahan: string;
        satuan: string | null;
    };
    created_at: string;
    updated_at: string;
}

export interface BomCategorie {
    id: number;
    nama_bom: string;
    keterangan: string | null;
    bom_details?: BomDetail[];
    bom_details_count?: number;
    produk_count?: number;
    created_at: string;
    updated_at: string;
}

export interface BomCategorieFormData {
    nama_bom: string;
    keterangan: string;
    details: {
        bahan_baku_id: number | null;
        qty_per_pair: number | string;
    }[];
}

export interface BomDetailFormData {
    bahan_baku_id: number | null;
    qty_per_pair: number | string;
}

export interface BomCategoryOption {
    id: number;
    nama_bom: string;
}

export interface BahanBakuOption {
    id: number;
    kode_bahan: string;
    nama_bahan: string;
    satuan: string | null;
}

export interface BomCategorieIndexProps {
    bomCategories: {
        data: BomCategorie[];
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

export interface BomCategorieCreateProps {
    bahanBakus: BahanBakuOption[];
}

export interface BomCategorieEditProps {
    bomCategorie: BomCategorie;
}

export interface BomCategorieShowProps {
    bomCategorie: BomCategorie & {
        bom_details: BomDetail[];
    };
    bahanBakus: BahanBakuOption[];
}
