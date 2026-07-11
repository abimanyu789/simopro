<?php

namespace Database\Seeders;

use App\Models\ArusKas;
use App\Models\Pembayaran;
use App\Models\Pesanan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PembayaranSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        if (!$admin) {
            $this->command->warn('PembayaranSeeder: skip — admin belum ada.');
            return;
        }

        // Ambil beberapa pesanan yang sudah ada
        $pesanans = Pesanan::whereIn('status', ['proses', 'selesai'])->take(4)->get();

        if ($pesanans->isEmpty()) {
            $this->command->warn('PembayaranSeeder: skip — tidak ada pesanan proses/selesai.');
            return;
        }

        $jenisList = ['dp', 'pelunasan', 'termin'];

        foreach ($pesanans as $i => $pesanan) {
            DB::transaction(function () use ($pesanan, $admin, $i, $jenisList) {
                $nominal = round($pesanan->total * 0.5, 2);

                $pembayaran = Pembayaran::create([
                    'pesanan_id'       => $pesanan->id,
                    'tanggal'          => now()->subDays(rand(1, 30))->format('Y-m-d'),
                    'jenis_pembayaran' => $jenisList[$i % count($jenisList)],
                    'nominal'          => $nominal,
                    'metode'           => ['Transfer Bank', 'Tunai', 'QRIS'][$i % 3],
                    'keterangan'       => "Pembayaran {$jenisList[$i % count($jenisList)]} pesanan {$pesanan->nomor_pesanan}",
                ]);

                // Auto-create arus kas dari pembayaran
                ArusKas::create([
                    'pembayaran_id'     => $pembayaran->id,
                    'created_by'        => $admin->id,
                    'tanggal'           => $pembayaran->tanggal,
                    'jenis'             => 'pemasukan',
                    'kategori'          => 'Pendapatan Penjualan',
                    'nominal'           => $nominal,
                    'metode_pembayaran' => $pembayaran->metode,
                    'keterangan'        => "Pembayaran pesanan {$pesanan->nomor_pesanan}",
                    'bukti_transaksi'   => null,
                ]);
            });
        }

        $this->command->info("PembayaranSeeder: {$pesanans->count()} pembayaran + arus kas dibuat.");
    }
}
