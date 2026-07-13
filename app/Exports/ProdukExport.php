<?php

namespace App\Exports;

use App\Models\Produk;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProdukExport implements FromQuery, WithHeadings, WithMapping, WithStyles
{
    public function query()
    {
        return Produk::query()->orderBy('kode_produk');
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

    public function map($row): array
    {
        return [
            $row->kode_produk,
            $row->nama_produk,
            $row->ukuran,
            $row->warna,
            $row->harga_jual,
            $row->minimum_stok,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
