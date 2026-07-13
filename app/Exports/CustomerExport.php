<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Exports\Traits\WithExcelValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithEvents
{
    use WithExcelValidation;

    public function query()
    {
        return Customer::query()->orderBy('nama_customer');
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

    public function map($row): array
    {
        return [
            $row->nama_customer,
            $row->jenis_customer,
            $row->no_hp,
            $row->alamat,
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
                    'B', // Kolom Jenis Customer
                    ['b2b', 'b2c'],
                    $maxRow
                );
            },
        ];
    }
}
