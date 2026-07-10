<?php

namespace Database\Seeders;

use App\Models\Pesanan;
use App\Models\Produksi;
use App\Models\User;
use App\Services\ProduksiService;
use Illuminate\Database\Seeder;

class ProduksiSeeder extends Seeder
{
    public function run(): void
    {
        $admin   = User::first();
        $service = app(ProduksiService::class);

        if (!$admin) {
            $this->command->warn('ProduksiSeeder: skip — admin belum ada.');
            return;
        }

        // Ambil pesanan yang valid (pending/proses, belum punya produksi aktif)
        $pesananList = Pesanan::with([
            'detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
        ])
            ->whereIn('status', ['pending', 'proses'])
            ->whereDoesntHave('produksi', function ($q) {
                $q->whereIn('status', ['draft', 'proses']);
            })
            ->take(4)
            ->get();

        if ($pesananList->isEmpty()) {
            $this->command->warn('ProduksiSeeder: skip — tidak ada pesanan valid.');
            return;
        }

        $statusList = ['draft', 'draft', 'proses', 'draft'];

        foreach ($pesananList as $i => $pesanan) {
            try {
                $produksi = $service->create(
                    $pesanan,
                    [
                        'deadline' => now()->addDays(rand(7, 30))->format('Y-m-d'),
                        'catatan'  => $i === 0 ? 'Produksi prioritas untuk pesanan urgent.' : null,
                    ],
                    $admin->id
                );

                // Update status untuk variasi data dummy
                $status = $statusList[$i] ?? 'draft';
                if ($status !== 'draft') {
                    $produksi->update(['status' => $status]);
                }

                $this->command->info("Produksi dibuat: {$pesanan->nomor_pesanan} → status {$status}");
            } catch (\RuntimeException $e) {
                $this->command->warn("Skip {$pesanan->nomor_pesanan}: {$e->getMessage()}");
            }
        }
    }
}
