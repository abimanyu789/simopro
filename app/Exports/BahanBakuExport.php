<?php

namespace App\Exports;

use App\Models\BahanBaku;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use App\Exports\Traits\WithExcelValidation;

class BahanBakuExport implements FromQuery, WithHeadings, WithMapping, WithStyles, WithEvents
{
    use WithExcelValidation;
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

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // Get the count of rows (including header) to apply dynamic range.
                // Assuming max 1000 rows for general export editability, or dynamic row count.
                $highestRow = $event->sheet->getHighestRow();
                $maxRow = max($highestRow, 1000); // Allow editing/adding rows up to 1000 at least.

                $this->addDropdownValidation(
                    $event->sheet->getDelegate(),
                    'C', // Kolom Satuan
                    ['meter', 'pasang', 'buah', 'kilogram', 'lembar'],
                    $maxRow
                );
            },
        ];
    }
}
