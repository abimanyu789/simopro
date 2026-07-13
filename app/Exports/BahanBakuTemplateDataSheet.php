<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Exports\Traits\WithExcelValidation;

class BahanBakuTemplateDataSheet implements FromArray, WithHeadings, WithTitle, WithStyles, WithEvents
{
    use WithExcelValidation;
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

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $this->addDropdownValidation(
                    $event->sheet->getDelegate(),
                    'C', // Kolom Satuan
                    ['meter', 'pasang', 'buah', 'kilogram', 'lembar'],
                    1000
                );
            },
        ];
    }
}
