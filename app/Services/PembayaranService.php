<?php

namespace App\Services;

use App\Models\ArusKas;
use App\Models\Pembayaran;
use App\Models\Pesanan;
use Illuminate\Support\Facades\DB;

class PembayaranService
{
    /**
     * Catat pembayaran pesanan dan otomatis buat entry arus kas (pemasukan).
     *
     * Business rules:
     * - BR-03: Transaksi pembayaran pesanan wajib terhubung ke data pesanan terkait
     * - BR-05: Saldo kas dihitung ulang otomatis setiap transaksi berhasil disimpan
     *
     * @throws \RuntimeException
     */
    public function create(Pesanan $pesanan, array $data, int $createdBy): Pembayaran
    {
        return DB::transaction(function () use ($pesanan, $data, $createdBy) {
            $pembayaran = Pembayaran::create([
                'pesanan_id'       => $pesanan->id,
                'tanggal'          => $data['tanggal'],
                'jenis_pembayaran' => $data['jenis_pembayaran'],
                'nominal'          => $data['nominal'],
                'metode'           => $data['metode'] ?? null,
                'keterangan'       => $data['keterangan'] ?? null,
            ]);

            // Auto-create entry arus kas sebagai pemasukan
            ArusKas::create([
                'pembayaran_id'     => $pembayaran->id,
                'created_by'        => $createdBy,
                'tanggal'           => $data['tanggal'],
                'jenis'             => 'pemasukan',
                'kategori'          => 'Pendapatan Penjualan',
                'nominal'           => $data['nominal'],
                'metode_pembayaran' => $data['metode'] ?? null,
                'keterangan'        => "Pembayaran pesanan {$pesanan->nomor_pesanan}" .
                                       ($data['keterangan'] ? " — {$data['keterangan']}" : ''),
                'bukti_transaksi'   => null,
            ]);

            return $pembayaran->load('arusKas');
        });
    }

    /**
     * Hapus pembayaran beserta entry arus kas yang terkait.
     *
     * BR-07: Penghapusan transaksi menyebabkan saldo dihitung ulang.
     *
     * @throws \RuntimeException
     */
    public function destroy(Pembayaran $pembayaran): void
    {
        DB::transaction(function () use ($pembayaran) {
            // Hapus arus kas terkait dulu (FK nullable RESTRICT)
            $pembayaran->arusKas()->delete();
            $pembayaran->delete();
        });
    }
}
