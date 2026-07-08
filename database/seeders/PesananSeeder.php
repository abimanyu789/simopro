<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PesananSeeder extends Seeder
{
    public function run(): void
    {
        $admin    = User::first();
        $customers = Customer::all();
        $produks   = Produk::all();

        if ($customers->isEmpty() || $produks->isEmpty() || !$admin) {
            $this->command->warn('PesananSeeder: skip — customers, produks, atau admin belum ada.');
            return;
        }

        $statusList = ['pending', 'proses', 'selesai', 'dibatalkan'];

        for ($i = 1; $i <= 12; $i++) {
            $customer = $customers->random();
            $status   = $statusList[($i - 1) % 4];

            // Hitung items dummy (1–3 produk per pesanan)
            $items    = $produks->random(min(rand(1, 3), $produks->count()));
            $subtotal = 0;

            DB::transaction(function () use ($admin, $customer, $status, $items, $i, &$subtotal) {
                $ongkir  = ($i % 3 === 0) ? rand(10000, 30000) : 0;
                $diskon  = ($i % 4 === 0) ? rand(5000, 50000) : 0;

                foreach ($items as $produk) {
                    $qty      = rand(1, 5);
                    $harga    = $produk->harga_jual ?? rand(50000, 200000);
                    $subtotal += $qty * $harga;
                }

                $total = max(0, $subtotal - $diskon + $ongkir);

                $pesanan = Pesanan::create([
                    'customer_id' => $customer->id,
                    'created_by'  => $admin->id,
                    'tanggal'     => now()->subDays(rand(0, 60))->format('Y-m-d'),
                    'status'      => $status,
                    'subtotal'    => $subtotal,
                    'diskon'      => $diskon,
                    'ongkir'      => $ongkir,
                    'total'       => $total,
                    'keterangan'  => $i % 3 === 0 ? 'Pesanan urgent, segera diproses.' : null,
                ]);

                foreach ($items as $produk) {
                    $qty   = rand(1, 5);
                    $harga = $produk->harga_jual ?? rand(50000, 200000);
                    $pesanan->detailPesanan()->create([
                        'produk_id' => $produk->id,
                        'qty'       => $qty,
                        'harga'     => $harga,
                        'subtotal'  => $qty * $harga,
                    ]);
                }
            });
        }

        $this->command->info('PesananSeeder: 12 pesanan dummy berhasil dibuat.');
    }
}
