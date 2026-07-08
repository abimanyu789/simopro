<?php

namespace App\Services;

use App\Models\DetailPesanan;
use App\Models\Pesanan;
use Illuminate\Support\Facades\DB;

class PesananService
{
    /**
     * Buat pesanan baru beserta seluruh detail item dalam satu transaksi.
     *
     * @param  array $data  Validated data dari PesananRequest
     * @param  int   $createdBy  ID user yang membuat pesanan
     */
    public function createWithDetails(array $data, int $createdBy): Pesanan
    {
        return DB::transaction(function () use ($data, $createdBy) {
            $kalkulasi = $this->hitungTotal($data['items'], $data);

            $pesanan = Pesanan::create([
                'customer_id'   => $data['customer_id'],
                'created_by'    => $createdBy,
                'tanggal'       => $data['tanggal'],
                'status'        => 'pending',
                'subtotal'      => $kalkulasi['subtotal'],
                'diskon'        => $kalkulasi['diskon'],
                'ongkir'        => $data['ongkir'] ?? 0,
                'total'         => $kalkulasi['total'],
                'keterangan'    => $data['keterangan'] ?? null,
            ]);

            $this->syncDetails($pesanan, $data['items']);

            return $pesanan->load('detailPesanan.produk');
        });
    }

    /**
     * Update pesanan (full edit — hanya boleh saat status pending).
     *
     * @param  array $data  Validated data dari PesananRequest
     */
    public function updateWithDetails(Pesanan $pesanan, array $data): Pesanan
    {
        return DB::transaction(function () use ($pesanan, $data) {
            $kalkulasi = $this->hitungTotal($data['items'], $data);

            $pesanan->update([
                'customer_id'   => $data['customer_id'],
                'tanggal'       => $data['tanggal'],
                'subtotal'      => $kalkulasi['subtotal'],
                'diskon'        => $kalkulasi['diskon'],
                'ongkir'        => $data['ongkir'] ?? 0,
                'total'         => $kalkulasi['total'],
                'keterangan'    => $data['keterangan'] ?? null,
            ]);

            // Hapus semua detail lama, ganti dengan yang baru
            $pesanan->detailPesanan()->delete();
            $this->syncDetails($pesanan, $data['items']);

            return $pesanan->load('detailPesanan.produk');
        });
    }

    /**
     * Update status pesanan dengan validasi flow BR-06 & BR-07.
     *
     * Flow yang valid:
     *   pending → proses
     *   pending → dibatalkan
     *   proses  → selesai
     *   proses  → dibatalkan
     *
     * @throws \RuntimeException  Jika transisi status tidak valid
     */
    public function updateStatus(Pesanan $pesanan, string $statusBaru): Pesanan
    {
        if ($pesanan->isLocked()) {
            throw new \RuntimeException(
                "Pesanan dengan status '{$pesanan->status}' tidak dapat diubah."
            );
        }

        $transisiValid = [
            'pending' => ['proses', 'dibatalkan'],
            'proses'  => ['selesai', 'dibatalkan'],
        ];

        $statusSaatIni   = $pesanan->status;
        $statusDiizinkan = $transisiValid[$statusSaatIni] ?? [];

        if (!in_array($statusBaru, $statusDiizinkan)) {
            throw new \RuntimeException(
                "Tidak dapat mengubah status dari '{$statusSaatIni}' ke '{$statusBaru}'."
            );
        }

        $pesanan->update(['status' => $statusBaru]);

        return $pesanan->fresh();
    }

    /**
     * Hitung subtotal, diskon (nominal akhir), dan total.
     *
     * @param  array $items  Array of ['produk_id', 'qty', 'harga']
     * @param  array $data   Termasuk 'tipe_diskon', 'diskon', 'ongkir'
     */
    public function hitungTotal(array $items, array $data): array
    {
        $subtotal = collect($items)->sum(fn ($item) => $item['qty'] * $item['harga']);

        $nilaiDiskon = 0;
        $inputDiskon = (float) ($data['diskon'] ?? 0);

        if ($inputDiskon > 0) {
            $tipe = $data['tipe_diskon'] ?? 'nominal';
            $nilaiDiskon = $tipe === 'persen'
                ? round($subtotal * ($inputDiskon / 100), 2)
                : $inputDiskon;
        }

        $ongkir = (float) ($data['ongkir'] ?? 0);
        $total  = $subtotal - $nilaiDiskon + $ongkir;

        return [
            'subtotal' => $subtotal,
            'diskon'   => $nilaiDiskon,    // selalu disimpan sebagai nominal rupiah
            'total'    => max(0, $total),  // total tidak boleh negatif
        ];
    }

    /**
     * Insert detail pesanan dari array items.
     */
    private function syncDetails(Pesanan $pesanan, array $items): void
    {
        foreach ($items as $item) {
            DetailPesanan::create([
                'pesanan_id' => $pesanan->id,
                'produk_id'  => $item['produk_id'],
                'qty'        => $item['qty'],
                'harga'      => $item['harga'],
                'subtotal'   => $item['qty'] * $item['harga'],
            ]);
        }
    }
}
