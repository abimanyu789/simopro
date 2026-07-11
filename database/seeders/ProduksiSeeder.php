<?php

namespace Database\Seeders;

use App\Models\Pesanan;
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

        $pesananList = Pesanan::whereIn('status', ['pending', 'proses'])
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
                // Signature baru: create(array $data, int $createdBy)
                $produksi = $service->create(
                    [
                        'jenis_produksi' => 'pesanan',
                        'pesanan_id'     => $pesanan->id,
                        'deadline'       => now()->addDays(rand(7, 30))->format('Y-m-d'),
                        'catatan'        => $i === 0 ? 'Produksi prioritas untuk pesanan urgent.' : null,
                        'karyawan_ids'   => [],
                    ],
                    $admin->id
                );

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
