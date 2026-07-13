<?php

namespace App\Services;

use App\Models\BahanBaku;
use Illuminate\Support\Facades\DB;

class BahanBakuService
{
    /**
     * Store a new Bahan Baku.
     *
     * @param array $data
     * @return BahanBaku
     */
    public function store(array $data): BahanBaku
    {
        // Untuk master data sederhana, kita bisa langsung create.
        // Pemisahan ke Service memastikan konsistensi jika nantinya ada logic tambahan
        // (misal auto-generate kode atau trigger event).
        return DB::transaction(function () use ($data) {
            return BahanBaku::create([
                'kode_bahan' => $data['kode_bahan'],
                'nama_bahan' => $data['nama_bahan'],
                'satuan' => $data['satuan'],
                'minimum_stok' => $data['minimum_stok'],
                'stok' => 0, // Default stok awal
            ]);
        });
    }
}
