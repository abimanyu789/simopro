import type { StatusKaryawan } from '@/types';

interface KaryawanBadgeProps {
    status: StatusKaryawan;
    size?: 'sm' | 'md';
}

const badgeConfig: Record<StatusKaryawan, { label: string; className: string }> = {
    aktif: {
        label: 'Aktif',
        className:
            'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400',
    },
    nonaktif: {
        label: 'Nonaktif',
        className:
            'inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
};

export function KaryawanBadge({ status }: KaryawanBadgeProps) {
    const config = badgeConfig[status];
    return <span className={config.className}>{config.label}</span>;
}
