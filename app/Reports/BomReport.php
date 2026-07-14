<?php

namespace App\Reports;

use App\Models\BomCategorie;
use Illuminate\Support\Collection;

class BomReport extends BaseReport
{
    public function title(): string
    {
        return 'Laporan Bill of Materials (BOM)';
    }

    public function filename(): string
    {
        return 'laporan-bom';
    }

    public function bladeView(): string
    {
        return 'reports.bom';
    }

    public function headings(): array
    {
        return [
            'Nama BOM',
            'Keterangan',
            'Bahan Baku',
            'Kode Bahan',
            'Satuan',
            'Qty / Pasang',
        ];
    }

    public function export(array $filters): Collection
    {
        return BomCategorie::with(['bomDetails.bahanBaku'])
            ->orderBy('nama_bom')
            ->get()
            ->flatMap(function (BomCategorie $bom) {
                if ($bom->bomDetails->isEmpty()) {
                    return [[
                        'nama_bom'     => $bom->nama_bom,
                        'keterangan'   => $bom->keterangan ?? '-',
                        'nama_bahan'   => '-',
                        'kode_bahan'   => '-',
                        'satuan'       => '-',
                        'qty_per_pair' => '-',
                    ]];
                }

                return $bom->bomDetails->map(fn ($detail) => [
                    'nama_bom'     => $bom->nama_bom,
                    'keterangan'   => $bom->keterangan ?? '-',
                    'nama_bahan'   => $detail->bahanBaku?->nama_bahan ?? '-',
                    'kode_bahan'   => $detail->bahanBaku?->kode_bahan ?? '-',
                    'satuan'       => $detail->bahanBaku?->satuan ?? '-',
                    'qty_per_pair' => (float) $detail->qty_per_pair,
                ])->all();
            });
    }

    public function summary(array $filters): array
    {
        $totalBom    = BomCategorie::count();
        $totalDetail = \App\Models\BomDetail::count();

        return [
            ['label' => 'Total BOM',           'value' => $totalBom,    'color' => 'blue'],
            ['label' => 'Total Item Bahan',    'value' => $totalDetail, 'color' => 'purple'],
        ];
    }
}
