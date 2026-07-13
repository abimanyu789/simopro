<?php

namespace App\Exports;

use App\Models\BahanBaku;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BahanBakuExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    /**
    * @return \Illuminate\Database\Eloquent\Builder
    */
    public function query()
    {
        return BahanBaku::query()->orderBy('kode_bahan');
    }

    /**
    * @return array
    */
    public function headings(): array
    {
        return [
            'Kode Bahan',
            'Nama Bahan',
            'Satuan',
            'Minimum Stok',
            'Stok Saat Ini',
        ];
    }

    /**
    * @param BahanBaku $row
    * @return array
    */
    public function map($row): array
    {
        return [
            $row->kode_bahan,
            $row->nama_bahan,
            $row->satuan,
            $row->minimum_stok,
            $row->stok,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
