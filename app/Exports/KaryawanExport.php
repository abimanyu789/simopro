<?php

namespace App\Exports;

use App\Models\Karyawan;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Exports\Traits\WithExcelValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KaryawanExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithEvents
{
    use WithExcelValidation;

    public function query()
    {
        return Karyawan::query()->orderBy('nama_karyawan');
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

    public function map($row): array
    {
        return [
            $row->nama_karyawan,
            $row->jabatan,
            $row->no_hp,
            $row->status,
        ];
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
                $highestRow = $event->sheet->getHighestRow();
                $maxRow = max($highestRow, 1000);

                $this->addDropdownValidation(
                    $event->sheet->getDelegate(),
                    'D', // Kolom Status
                    ['aktif', 'nonaktif'],
                    $maxRow
                );
            },
        ];
    }
}
