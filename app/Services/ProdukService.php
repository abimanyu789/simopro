<?php

namespace App\Services;

use App\Models\Produk;
use Illuminate\Support\Facades\DB;

class ProdukService
{
    /**
     * Store a new Produk.
     *
     * @param array $data
     * @return Produk
     */
    public function store(array $data): Produk
    {
        return DB::transaction(function () use ($data) {
            return Produk::create([
                'kode_produk' => $data['kode_produk'],
                'nama_produk' => $data['nama_produk'],
                'ukuran' => $data['ukuran'] ?? null,
                'warna' => $data['warna'] ?? null,
                'harga_jual' => $data['harga_jual'] ?? null,
                'minimum_stok' => $data['minimum_stok'] ?? null,
                // Stok di-set default 0 dari database.
                // BOM Category ID akan di-set secara manual.
            ]);
        });
    }
}
