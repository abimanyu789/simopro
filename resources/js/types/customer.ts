export type JenisCustomer = 'b2b' | 'b2c';

export interface Customer {
    id: number;
    nama_customer: string;
    jenis_customer: JenisCustomer;
    no_hp: string | null;
    alamat: string | null;
    created_at: string;
    updated_at: string;
}

export interface CustomerFormData {
    nama_customer: string;
    jenis_customer: JenisCustomer | '';
    no_hp: string;
    alamat: string;
}

export interface CustomerIndexProps {
    customers: {
        data: Customer[];
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
        jenis?: string;
    };
}

export interface CustomerShowProps {
    customer: Customer;
}

export interface CustomerCreateEditProps {
    customer?: Customer;
}
