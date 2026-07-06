<?php

namespace Database\Seeders;

use App\Models\BahanBaku;
use Illuminate\Database\Seeder;

class BahanBakuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bahanBakus = [
            [
                'kode_bahan' => 'BB-001',
                'nama_bahan' => 'Kulit Sapi Premium',
                'satuan' => 'meter',
                'stok' => 50.00,
                'minimum_stok' => 10.00,
            ],
            [
                'kode_bahan' => 'BB-002',
                'nama_bahan' => 'Sol Karet',
                'satuan' => 'pasang',
                'stok' => 100.00,
                'minimum_stok' => 20.00,
            ],
            [
                'kode_bahan' => 'BB-003',
                'nama_bahan' => 'Tali Sepatu Polyester',
                'satuan' => 'pasang',
                'stok' => 200.00,
                'minimum_stok' => 50.00,
            ],
            [
                'kode_bahan' => 'BB-004',
                'nama_bahan' => 'Lem Sepatu',
                'satuan' => 'kilogram',
                'stok' => 15.50,
                'minimum_stok' => 5.00,
            ],
            [
                'kode_bahan' => 'BB-005',
                'nama_bahan' => 'Benang Jahit',
                'satuan' => 'buah',
                'stok' => 30.00,
                'minimum_stok' => 10.00,
            ],
            [
                'kode_bahan' => 'BB-006',
                'nama_bahan' => 'Insole Foam',
                'satuan' => 'lembar',
                'stok' => 80.00,
                'minimum_stok' => 15.00,
            ],
            [
                'kode_bahan' => 'BB-007',
                'nama_bahan' => 'Eyelet Logam',
                'satuan' => 'buah',
                'stok' => 500.00,
                'minimum_stok' => 100.00,
            ],
            [
                'kode_bahan' => 'BB-008',
                'nama_bahan' => 'Kain Lining',
                'satuan' => 'meter',
                'stok' => 25.00,
                'minimum_stok' => 5.00,
            ],
        ];

        foreach ($bahanBakus as $bahanBaku) {
            BahanBaku::create($bahanBaku);
        }
    }
}
