<?php

namespace Database\Seeders;

use App\Models\BahanBaku;
use App\Models\BomCategorie;
use App\Models\Produk;
use Illuminate\Database\Seeder;

class BomCategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lookup semua id bahan baku by kode_bahan agar tidak hardcode ID
        $bb = BahanBaku::pluck('id', 'kode_bahan');

        $bomsData = [
            [
                'nama_bom'   => 'BOM Sepatu Pantofel Formal',
                'keterangan' => 'Komposisi bahan untuk sepatu pantofel formal',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.50],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.20],
                    ['kode' => 'BB-005', 'qty' => 2.00],
                    ['kode' => 'BB-006', 'qty' => 1.00],
                    ['kode' => 'BB-008', 'qty' => 0.50],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Sneakers Casual',
                'keterangan' => 'Komposisi bahan untuk sepatu sneakers casual',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.20],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-003', 'qty' => 2.00],
                    ['kode' => 'BB-004', 'qty' => 0.15],
                    ['kode' => 'BB-007', 'qty' => 12.00],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sandal Kulit',
                'keterangan' => 'Komposisi bahan untuk sandal kulit',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 0.80],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.10],
                    ['kode' => 'BB-008', 'qty' => 0.30],
                    ['kode' => 'BB-006', 'qty' => 1.00],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Boots Safety',
                'keterangan' => 'Komposisi bahan untuk sepatu boots safety',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 2.00],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.30],
                    ['kode' => 'BB-005', 'qty' => 3.00],
                    ['kode' => 'BB-006', 'qty' => 1.00],
                    ['kode' => 'BB-008', 'qty' => 0.50],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Loafer Slip-On',
                'keterangan' => 'Komposisi bahan untuk sepatu loafer slip-on',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.30],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.15],
                    ['kode' => 'BB-005', 'qty' => 1.00],
                    ['kode' => 'BB-006', 'qty' => 1.00],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Derby Formal',
                'keterangan' => 'Komposisi bahan untuk sepatu derby formal',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.40],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.20],
                    ['kode' => 'BB-005', 'qty' => 2.00],
                    ['kode' => 'BB-008', 'qty' => 0.40],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Brogue Klasik',
                'keterangan' => 'Komposisi bahan untuk sepatu brogue klasik',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.50],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-003', 'qty' => 2.00],
                    ['kode' => 'BB-004', 'qty' => 0.20],
                    ['kode' => 'BB-005', 'qty' => 2.00],
                    ['kode' => 'BB-007', 'qty' => 8.00],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Moccasin Kulit',
                'keterangan' => 'Komposisi bahan untuk sepatu moccasin kulit',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.10],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.15],
                    ['kode' => 'BB-005', 'qty' => 1.50],
                    ['kode' => 'BB-008', 'qty' => 0.30],
                ],
            ],
            [
                'nama_bom'   => 'BOM Chelsea Boots Premium',
                'keterangan' => 'Komposisi bahan untuk chelsea boots premium',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.80],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.25],
                    ['kode' => 'BB-005', 'qty' => 2.00],
                    ['kode' => 'BB-006', 'qty' => 1.00],
                    ['kode' => 'BB-008', 'qty' => 0.60],
                ],
            ],
            [
                'nama_bom'   => 'BOM Sepatu Oxford Semi-Formal',
                'keterangan' => 'Komposisi bahan untuk sepatu oxford semi-formal',
                'details'    => [
                    ['kode' => 'BB-001', 'qty' => 1.30],
                    ['kode' => 'BB-002', 'qty' => 1.00],
                    ['kode' => 'BB-004', 'qty' => 0.20],
                    ['kode' => 'BB-005', 'qty' => 1.50],
                    ['kode' => 'BB-007', 'qty' => 6.00],
                ],
            ],
        ];

        $insertedBoms = [];

        foreach ($bomsData as $bomData) {
            $bom = BomCategorie::create([
                'nama_bom'   => $bomData['nama_bom'],
                'keterangan' => $bomData['keterangan'],
            ]);

            foreach ($bomData['details'] as $detail) {
                // Skip jika kode bahan baku tidak ditemukan
                if (! isset($bb[$detail['kode']])) {
                    continue;
                }

                $bom->bomDetails()->create([
                    'bahan_baku_id' => $bb[$detail['kode']],
                    'qty_per_pair'  => $detail['qty'],
                ]);
            }

            $insertedBoms[] = $bom;
        }

        // Assign BOM ke produk berdasarkan index (BOM ke-N -> produk id N)
        // $insertedBoms[0] = BOM 1 (index 0) -> produk id 1
        $assignments = [
            1  => 0,  // Produk id 1 -> BOM Sepatu Pantofel Formal (index 0)
            2  => 1,  // Produk id 2 -> BOM Sepatu Sneakers Casual (index 1)
            3  => 9,  // Produk id 3 -> BOM Sepatu Oxford Semi-Formal (index 9)
            4  => 2,  // Produk id 4 -> BOM Sandal Kulit (index 2)
            5  => 3,  // Produk id 5 -> BOM Sepatu Boots Safety (index 3)
            6  => 4,  // Produk id 6 -> BOM Sepatu Loafer Slip-On (index 4)
            7  => 5,  // Produk id 7 -> BOM Sepatu Derby Formal (index 5)
            8  => 6,  // Produk id 8 -> BOM Sepatu Brogue Klasik (index 6)
            9  => 7,  // Produk id 9 -> BOM Sepatu Moccasin Kulit (index 7)
            10 => 8,  // Produk id 10 -> BOM Chelsea Boots Premium (index 8)
        ];

        foreach ($assignments as $produkId => $bomIndex) {
            if (isset($insertedBoms[$bomIndex])) {
                Produk::where('id', $produkId)->update([
                    'bom_category_id' => $insertedBoms[$bomIndex]->id,
                ]);
            }
        }
    }
}
