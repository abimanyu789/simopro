<?php

namespace Database\Seeders;

use App\Models\ArusKas;
use App\Models\User;
use Illuminate\Database\Seeder;

class ArusKasSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        if (!$admin) {
            $this->command->warn('ArusKasSeeder: skip — admin belum ada.');
            return;
        }

        // Transaksi manual pengeluaran operasional
        $transaksis = [
            ['jenis' => 'pengeluaran', 'kategori' => 'Biaya Bahan Baku',     'nominal' => 1500000, 'metode' => 'Transfer Bank', 'keterangan' => 'Pembelian kulit sapi premium'],
            ['jenis' => 'pengeluaran', 'kategori' => 'Biaya Operasional',     'nominal' => 350000,  'metode' => 'Tunai',         'keterangan' => 'Biaya listrik bulan ini'],
            ['jenis' => 'pengeluaran', 'kategori' => 'Biaya Transportasi',    'nominal' => 200000,  'metode' => 'Tunai',         'keterangan' => 'Ongkos kirim bahan baku'],
            ['jenis' => 'pengeluaran', 'kategori' => 'Biaya Peralatan',       'nominal' => 750000,  'metode' => 'Transfer Bank', 'keterangan' => 'Pembelian peralatan jahit'],
            ['jenis' => 'pemasukan',   'kategori' => 'Pemasukan Lain-lain',   'nominal' => 500000,  'metode' => 'Tunai',         'keterangan' => 'Penjualan sisa bahan'],
        ];

        foreach ($transaksis as $i => $data) {
            ArusKas::create([
                'pembayaran_id'     => null, // transaksi manual
                'created_by'        => $admin->id,
                'tanggal'           => now()->subDays(rand(1, 60))->format('Y-m-d'),
                'jenis'             => $data['jenis'],
                'kategori'          => $data['kategori'],
                'nominal'           => $data['nominal'],
                'metode_pembayaran' => $data['metode'],
                'keterangan'        => $data['keterangan'],
                'bukti_transaksi'   => null,
            ]);
        }

        $this->command->info('ArusKasSeeder: 5 transaksi manual dibuat.');
    }
}
