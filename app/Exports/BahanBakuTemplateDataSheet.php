<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BahanBakuTemplateDataSheet implements FromArray, WithHeadings, WithTitle, WithStyles
{
    public function array(): array
    {
        return [
            [
                'BB-CONTOH-01',
                'Kulit Sapi Asli',
                'meter',
                50,
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Kode Bahan',
            'Nama Bahan',
            'Satuan',
            'Minimum Stok',
        ];
    }

    public function title(): string
    {
        return 'Data';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
