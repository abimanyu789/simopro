import type { StatusProduksi } from '@/types';

interface ProduksiStatusBadgeProps {
    status: StatusProduksi;
}

const badgeConfig: Record<StatusProduksi, { label: string; className: string }> = {
    draft: {
        label: 'Draft',
        className:
            'inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    },
    proses: {
        label: 'Proses',
        className:
            'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    },
    selesai: {
        label: 'Selesai',
        className:
            'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400',
    },
    dibatalkan: {
        label: 'Dibatalkan',
        className:
            'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400',
    },
};

export function ProduksiStatusBadge({ status }: ProduksiStatusBadgeProps) {
    const config = badgeConfig[status];
    return <span className={config.className}>{config.label}</span>;
}
