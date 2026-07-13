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

class KaryawanTemplateDataSheet implements FromArray, WithHeadings, WithTitle, WithStyles, WithEvents
{
    use WithExcelValidation;

    public function array(): array
    {
        return [
            [
                'Budi Santoso',
                'Staff Produksi',
                '08123456789',
                'aktif',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Karyawan',
            'Jabatan',
            'No HP',
            'Status',
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
                    'D', // Kolom Status
                    ['aktif', 'nonaktif'],
                    1000
                );
            },
        ];
    }
}
