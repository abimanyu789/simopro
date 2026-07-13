<?php

namespace App\Exports;

use App\Models\BomCategorie;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BomExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    public function query()
    {
        return BomCategorie::query()->with('produk')->orderBy('nama_bom');
    }

    public function headings(): array
    {
        return [
            'Nama BOM',
            'Digunakan Oleh Produk',
            'Keterangan',
        ];
    }

    public function map($row): array
    {
        return [
            $row->nama_bom,
            $row->produk->pluck('nama_produk')->implode(', ') ?: 'Belum digunakan',
            $row->keterangan,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
