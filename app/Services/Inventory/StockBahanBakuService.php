<?php

namespace App\Services\Inventory;

use App\Models\BahanBaku;
use App\Models\StokBahanBaku;
use Illuminate\Support\Facades\DB;

class StockBahanBakuService
{
    /**
     * Tambah stok bahan baku (restock manual).
     *
     * Digunakan oleh: modul Stok Bahan Baku (restock manual admin).
     * Dapat diperluas untuk: penyesuaian.
     *
     * @param  BahanBaku $bahanBaku  Model yang stoknya akan ditambah.
     * @param  float     $qty        Jumlah yang ditambahkan (harus > 0).
     * @param  string    $jenis      Jenis transaksi: 'restock' | 'penyesuaian'.
     * @param  string|null $keterangan  Catatan opsional.
     */
    public function addStock(
        BahanBaku $bahanBaku,
        float $qty,
        string $jenis = 'restock',
        ?string $keterangan = null
    ): StokBahanBaku {
        return DB::transaction(function () use ($bahanBaku, $qty, $jenis, $keterangan) {
            $stokSebelum = (float) $bahanBaku->stok;
            $stokSesudah = $stokSebelum + $qty;

            // Update stok utama di tabel bahan_baku
            $bahanBaku->increment('stok', $qty);

            // Catat riwayat di tabel stok_bahan_baku
            return StokBahanBaku::create([
                'bahan_baku_id'  => $bahanBaku->id,
                'jenis_transaksi' => $jenis,
                'qty'            => $qty,
                'stok_sebelum'   => $stokSebelum,
                'stok_sesudah'   => $stokSesudah,
                'keterangan'     => $keterangan,
            ]);
        });
    }

    /**
     * Kurangi stok bahan baku.
     *
     * Digunakan oleh: modul Produksi (potong stok saat produksi dimulai),
     * dan rollback saat produksi dibatalkan.
     *
     * @param  BahanBaku $bahanBaku  Model yang stoknya akan dikurangi.
     * @param  float     $qty        Jumlah yang dikurangi (harus > 0).
     * @param  string    $jenis      Jenis transaksi: 'produksi' | 'rollback' | 'penyesuaian'.
     * @param  string|null $keterangan  Catatan opsional.
     *
     * @throws \RuntimeException  Jika stok tidak mencukupi (BR-01: stok tidak boleh negatif).
     */
    public function reduceStock(
        BahanBaku $bahanBaku,
        float $qty,
        string $jenis = 'produksi',
        ?string $keterangan = null
    ): StokBahanBaku {
        return DB::transaction(function () use ($bahanBaku, $qty, $jenis, $keterangan) {
            // Reload dengan lock untuk menghindari race condition
            $bahanBaku->refresh();
            $stokSebelum = (float) $bahanBaku->stok;

            if ($stokSebelum < $qty) {
                throw new \RuntimeException(
                    "Stok {$bahanBaku->nama_bahan} tidak mencukupi. " .
                    "Tersedia: {$stokSebelum}, dibutuhkan: {$qty}."
                );
            }

            $stokSesudah = $stokSebelum - $qty;

            $bahanBaku->decrement('stok', $qty);

            return StokBahanBaku::create([
                'bahan_baku_id'  => $bahanBaku->id,
                'jenis_transaksi' => $jenis,
                'qty'            => $qty,
                'stok_sebelum'   => $stokSebelum,
                'stok_sesudah'   => $stokSesudah,
                'keterangan'     => $keterangan,
            ]);
        });
    }
}
