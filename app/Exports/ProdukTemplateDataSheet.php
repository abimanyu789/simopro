<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProdukTemplateDataSheet implements FromArray, WithHeadings, WithTitle, WithStyles
{
    public function array(): array
    {
        return [
            [
                'PRD-001',
                'Sepatu Sneakers Hitam',
                '42',
                'Hitam',
                150000,
                10,
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Kode Produk',
            'Nama Produk',
            'Ukuran',
            'Warna',
            'Harga Jual',
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
