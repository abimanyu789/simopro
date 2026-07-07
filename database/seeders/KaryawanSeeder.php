<?php

namespace Database\Seeders;

use App\Models\Karyawan;
use Illuminate\Database\Seeder;

class KaryawanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $karyawans = [
            // ── Penjahit ─────────────────────────────────────────────────────
            [
                'nama_karyawan' => 'Budi Santoso',
                'jabatan'       => 'Penjahit',
                'no_hp'         => '0812-1111-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Slamet Raharjo',
                'jabatan'       => 'Penjahit',
                'no_hp'         => '0812-1111-0002',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Agus Widodo',
                'jabatan'       => 'Penjahit',
                'no_hp'         => '0812-1111-0003',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Hendra Kusuma',
                'jabatan'       => 'Penjahit',
                'no_hp'         => '0812-1111-0004',
                'status'        => 'nonaktif',
            ],

            // ── Tukang Sol ───────────────────────────────────────────────────
            [
                'nama_karyawan' => 'Suparman',
                'jabatan'       => 'Tukang Sol',
                'no_hp'         => '0813-2222-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Poniman Hadi',
                'jabatan'       => 'Tukang Sol',
                'no_hp'         => '0813-2222-0002',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Rohmat Efendi',
                'jabatan'       => 'Tukang Sol',
                'no_hp'         => '0813-2222-0003',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Didik Prasetyo',
                'jabatan'       => 'Tukang Sol',
                'no_hp'         => '0813-2222-0004',
                'status'        => 'nonaktif',
            ],

            // ── Finishing ────────────────────────────────────────────────────
            [
                'nama_karyawan' => 'Wati Lestari',
                'jabatan'       => 'Finishing',
                'no_hp'         => '0822-3333-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Sari Indah',
                'jabatan'       => 'Finishing',
                'no_hp'         => '0822-3333-0002',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Dewi Rahayu',
                'jabatan'       => 'Finishing',
                'no_hp'         => '0822-3333-0003',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Rina Kurniawati',
                'jabatan'       => 'Finishing',
                'no_hp'         => '0822-3333-0004',
                'status'        => 'nonaktif',
            ],

            // ── QC (Quality Control) ─────────────────────────────────────────
            [
                'nama_karyawan' => 'Joko Purnomo',
                'jabatan'       => 'QC',
                'no_hp'         => '0877-4444-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Teguh Santosa',
                'jabatan'       => 'QC',
                'no_hp'         => '0877-4444-0002',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Bambang Irawan',
                'jabatan'       => 'QC',
                'no_hp'         => '0877-4444-0003',
                'status'        => 'nonaktif',
            ],

            // ── Supervisor ───────────────────────────────────────────────────
            [
                'nama_karyawan' => 'Ahmad Fauzi',
                'jabatan'       => 'Supervisor',
                'no_hp'         => '0815-5555-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Mulyadi Santoso',
                'jabatan'       => 'Supervisor',
                'no_hp'         => '0815-5555-0002',
                'status'        => 'aktif',
            ],

            // ── Pola & Potong ────────────────────────────────────────────────
            [
                'nama_karyawan' => 'Sarwono',
                'jabatan'       => 'Pola & Potong',
                'no_hp'         => '0819-6666-0001',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Guntur Wibowo',
                'jabatan'       => 'Pola & Potong',
                'no_hp'         => '0819-6666-0002',
                'status'        => 'aktif',
            ],
            [
                'nama_karyawan' => 'Eko Setiawan',
                'jabatan'       => 'Pola & Potong',
                'no_hp'         => '0819-6666-0003',
                'status'        => 'nonaktif',
            ],
        ];

        foreach ($karyawans as $karyawan) {
            Karyawan::create($karyawan);
        }
    }
}
