<?php

namespace App\Reports;

use App\Models\BahanBaku;
use Illuminate\Support\Collection;

class BahanBakuReport extends BaseReport
{
    public function title(): string
    {
        return 'Laporan Data Bahan Baku';
    }

    public function filename(): string
    {
        return 'laporan-bahan-baku';
    }

    public function bladeView(): string
    {
        return 'reports.bahan-baku';
    }

    public function headings(): array
    {
        return [
            'Kode Bahan',
            'Nama Bahan Baku',
            'Satuan',
            'Minimum Stok',
            'Stok Saat Ini',
            'Status Stok',
        ];
    }

    public function export(array $filters): Collection
    {
        return BahanBaku::orderBy('kode_bahan')
            ->get()
            ->map(fn (BahanBaku $b) => [
                'kode_bahan'    => $b->kode_bahan,
                'nama_bahan'    => $b->nama_bahan,
                'satuan'        => $b->satuan,
                'minimum_stok'  => (float) $b->minimum_stok,
                'stok'          => (float) $b->stok,
                'status_stok'   => $b->stok <= $b->minimum_stok ? 'Kritis' : 'Normal',
            ]);
    }

    public function summary(array $filters): array
    {
        $total   = BahanBaku::count();
        $kritis  = BahanBaku::whereColumn('stok', '<=', 'minimum_stok')->count();
        $normal  = $total - $kritis;

        return [
            ['label' => 'Total Bahan Baku', 'value' => $total,  'color' => 'blue'],
            ['label' => 'Stok Normal',       'value' => $normal, 'color' => 'emerald'],
            ['label' => 'Stok Kritis',       'value' => $kritis, 'color' => 'red'],
        ];
    }
}
