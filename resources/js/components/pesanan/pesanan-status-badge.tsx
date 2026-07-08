import type { StatusPesanan } from '@/types';

interface PesananStatusBadgeProps {
    status: StatusPesanan;
}

const badgeConfig: Record<StatusPesanan, { label: string; className: string }> = {
    pending: {
        label: 'Pending',
        className:
            'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
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

export function PesananStatusBadge({ status }: PesananStatusBadgeProps) {
    const config = badgeConfig[status];
    return <span className={config.className}>{config.label}</span>;
}
