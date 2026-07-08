<?php

namespace App\Services\Inventory;

use App\Models\Produk;
use App\Models\StokProdukJadi;
use Illuminate\Support\Facades\DB;

class StockProdukService
{
    /**
     * Tambah stok produk jadi.
     *
     * Digunakan oleh: modul Produksi (tambah stok saat progres produksi selesai).
     * Dapat diperluas untuk: penyesuaian stok.
     *
     * @param  Produk      $produk      Model produk yang stoknya akan ditambah.
     * @param  int         $qty         Jumlah yang ditambahkan (harus > 0).
     * @param  string      $jenis       Jenis transaksi: 'produksi' | 'penyesuaian'.
     * @param  string|null $keterangan  Catatan opsional.
     * @param  int|null    $createdBy   ID user yang melakukan transaksi (dari auth()->id()).
     */
    public function addStock(
        Produk $produk,
        int $qty,
        string $jenis = 'produksi',
        ?string $keterangan = null,
        ?int $createdBy = null
    ): StokProdukJadi {
        return DB::transaction(function () use ($produk, $qty, $jenis, $keterangan, $createdBy) {
            $stokSebelum = (int) $produk->stok;
            $stokSesudah = $stokSebelum + $qty;

            // Update stok utama di tabel produk
            $produk->increment('stok', $qty);

            // Catat riwayat di tabel stok_produk_jadi
            return StokProdukJadi::create([
                'produk_id'       => $produk->id,
                'jenis_transaksi' => $jenis,
                'qty'             => $qty,
                'stok_sebelum'    => $stokSebelum,
                'stok_sesudah'    => $stokSesudah,
                'keterangan'      => $keterangan,
                'created_by'      => $createdBy,
            ]);
        });
    }

    /**
     * Kurangi stok produk jadi.
     *
     * Digunakan oleh: pengiriman manual (modul ini), dan rollback produksi.
     * Business rule: stok tidak boleh negatif (BR Stok Produk Jadi).
     *
     * @param  Produk      $produk      Model produk yang stoknya akan dikurangi.
     * @param  int         $qty         Jumlah yang dikurangi (harus > 0).
     * @param  string      $jenis       Jenis transaksi: 'pengiriman' | 'rollback' | 'penyesuaian'.
     * @param  string|null $keterangan  Catatan opsional.
     * @param  int|null    $createdBy   ID user yang melakukan transaksi (dari auth()->id()).
     *
     * @throws \RuntimeException  Jika stok tidak mencukupi.
     */
    public function reduceStock(
        Produk $produk,
        int $qty,
        string $jenis = 'pengiriman',
        ?string $keterangan = null,
        ?int $createdBy = null
    ): StokProdukJadi {
        return DB::transaction(function () use ($produk, $qty, $jenis, $keterangan, $createdBy) {
            // Reload dengan fresh data untuk menghindari race condition
            $produk->refresh();
            $stokSebelum = (int) $produk->stok;

            if ($stokSebelum < $qty) {
                throw new \RuntimeException(
                    "Stok {$produk->nama_produk} tidak mencukupi. " .
                    "Tersedia: {$stokSebelum}, dibutuhkan: {$qty}."
                );
            }

            $stokSesudah = $stokSebelum - $qty;

            $produk->decrement('stok', $qty);

            return StokProdukJadi::create([
                'produk_id'       => $produk->id,
                'jenis_transaksi' => $jenis,
                'qty'             => $qty,
                'stok_sebelum'    => $stokSebelum,
                'stok_sesudah'    => $stokSesudah,
                'keterangan'      => $keterangan,
                'created_by'      => $createdBy,
            ]);
        });
    }
}
