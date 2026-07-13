<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Exports\Traits\WithExcelValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerTemplateDataSheet implements FromArray, WithHeadings, WithTitle, WithStyles, WithEvents
{
    use WithExcelValidation;

    public function array(): array
    {
        return [
            [
                'PT. Sepatu Maju',
                'b2b',
                '08123456789',
                'Jl. Mawar No. 1, Jakarta',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Customer',
            'Jenis Customer',
            'No HP',
            'Alamat',
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
                    'B', // Kolom Jenis Customer
                    ['b2b', 'b2c'],
                    1000
                );
            },
        ];
    }
}
