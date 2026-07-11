import type { JenisArusKas } from '@/types';

interface ArusKasBadgeProps {
    jenis: JenisArusKas;
}

const badgeConfig: Record<JenisArusKas, { label: string; className: string }> = {
    pemasukan: {
        label: 'Pemasukan',
        className:
            'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400',
    },
    pengeluaran: {
        label: 'Pengeluaran',
        className:
            'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400',
    },
};

export function ArusKasBadge({ jenis }: ArusKasBadgeProps) {
    const config = badgeConfig[jenis];
    return <span className={config.className}>{config.label}</span>;
}
