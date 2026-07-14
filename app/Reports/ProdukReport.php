<?php

namespace App\Reports;

use App\Models\Produk;
use Illuminate\Support\Collection;

class ProdukReport extends BaseReport
{
    public function title(): string
    {
        return 'Laporan Data Produk';
    }

    public function filename(): string
    {
        return 'laporan-produk';
    }

    public function bladeView(): string
    {
        return 'reports.produk';
    }

    public function headings(): array
    {
        return [
            'Kode Produk',
            'Nama Produk',
            'Kategori BOM',
            'Harga Jual',
            'Stok Saat Ini',
        ];
    }

    public function export(array $filters): Collection
    {
        return Produk::with('bomCategorie')
            ->orderBy('kode_produk')
            ->get()
            ->map(fn (Produk $p) => [
                'kode_produk'  => $p->kode_produk,
                'nama_produk'  => $p->nama_produk,
                'kategori_bom' => $p->bomCategorie?->nama_bom ?? '-',
                'harga_jual'   => (float) $p->harga_jual,
                'stok'         => (int) $p->stok,
            ]);
    }

    public function summary(array $filters): array
    {
        $total      = Produk::count();
        $totalStok  = Produk::sum('stok');
        $kosong     = Produk::where('stok', 0)->count();

        return [
            ['label' => 'Total Produk', 'value' => $total,     'color' => 'blue'],
            ['label' => 'Total Stok',   'value' => $totalStok.' unit', 'color' => 'emerald'],
            ['label' => 'Stok Kosong',  'value' => $kosong,    'color' => 'red'],
        ];
    }
}
