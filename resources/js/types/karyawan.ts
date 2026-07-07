export type StatusKaryawan = 'aktif' | 'nonaktif';

export interface Karyawan {
    id: number;
    nama_karyawan: string;
    jabatan: string | null;
    no_hp: string | null;
    status: StatusKaryawan;
    created_at: string;
    updated_at: string;
}

export interface KaryawanFormData {
    nama_karyawan: string;
    jabatan: string;
    no_hp: string;
    status: StatusKaryawan | '';
}

export interface KaryawanIndexProps {
    karyawans: {
        data: Karyawan[];
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
    jabatanOptions: string[];
    filters: {
        search?: string;
        jabatan?: string;
        status?: string;
        per_page?: number;
        sort_by?: string;
        sort_dir?: string;
    };
}

export interface KaryawanShowProps {
    karyawan: Karyawan;
}

export interface KaryawanCreateEditProps {
    karyawan?: Karyawan;
}

