<?php

namespace App\Services;

use App\Models\ArusKas;
use Illuminate\Support\Facades\DB;

class ArusKasService
{
    /**
     * Buat transaksi arus kas manual (pembayaran_id = null).
     *
     * BR-01: Jenis wajib pemasukan atau pengeluaran.
     * BR-04: Nominal harus lebih dari nol.
     */
    public function create(array $data, int $createdBy): ArusKas
    {
        return DB::transaction(function () use ($data, $createdBy) {
            return ArusKas::create([
                'pembayaran_id'     => null, // transaksi manual
                'created_by'        => $createdBy,
                'tanggal'           => $data['tanggal'],
                'jenis'             => $data['jenis'],
                'kategori'          => $data['kategori'] ?? null,
                'nominal'           => $data['nominal'],
                'metode_pembayaran' => $data['metode_pembayaran'] ?? null,
                'keterangan'        => $data['keterangan'] ?? null,
                'bukti_transaksi'   => null,
            ]);
        });
    }

    /**
     * Update transaksi arus kas manual.
     * Transaksi dari pembayaran pesanan (pembayaran_id not null) tidak boleh diedit.
     *
     * BR-06: Perubahan transaksi menyebabkan saldo dihitung ulang.
     *
     * @throws \RuntimeException
     */
    public function update(ArusKas $arusKas, array $data): ArusKas
    {
        if ($arusKas->dariPembayaran()) {
            throw new \RuntimeException(
                'Transaksi yang berasal dari pembayaran pesanan tidak dapat diedit melalui modul Arus Kas. ' .
                'Ubah melalui menu Pembayaran di Detail Pesanan.'
            );
        }

        return DB::transaction(function () use ($arusKas, $data) {
            $arusKas->update([
                'tanggal'           => $data['tanggal'],
                'jenis'             => $data['jenis'],
                'kategori'          => $data['kategori'] ?? null,
                'nominal'           => $data['nominal'],
                'metode_pembayaran' => $data['metode_pembayaran'] ?? null,
                'keterangan'        => $data['keterangan'] ?? null,
            ]);

            return $arusKas->fresh();
        });
    }

    /**
     * Hapus transaksi arus kas manual.
     * Transaksi dari pembayaran pesanan tidak boleh dihapus di sini.
     *
     * BR-07: Penghapusan transaksi menyebabkan saldo dihitung ulang.
     * BR-09: Transaksi yang sudah dihapus tidak ditampilkan lagi di daftar.
     *
     * @throws \RuntimeException
     */
    public function destroy(ArusKas $arusKas): void
    {
        if ($arusKas->dariPembayaran()) {
            throw new \RuntimeException(
                'Transaksi yang berasal dari pembayaran pesanan tidak dapat dihapus melalui modul Arus Kas. ' .
                'Hapus melalui menu Pembayaran di Detail Pesanan.'
            );
        }

        DB::transaction(function () use ($arusKas) {
            $arusKas->delete();
        });
    }

    /**
     * Hitung saldo kas secara dinamis dari seluruh tabel arus_kas.
     * Saldo TIDAK disimpan di database — selalu dihitung ulang (BR-05).
     *
     * @return array{pemasukan: float, pengeluaran: float, saldo: float}
     */
    public function hitungSaldo(): array
    {
        $pemasukan  = (float) ArusKas::where('jenis', 'pemasukan')->sum('nominal');
        $pengeluaran = (float) ArusKas::where('jenis', 'pengeluaran')->sum('nominal');
        $saldo      = $pemasukan - $pengeluaran;

        return [
            'pemasukan'   => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'saldo'       => $saldo,
        ];
    }

    /**
     * Hitung ringkasan arus kas berdasarkan filter periode.
     * Digunakan oleh Dashboard dan halaman Index Arus Kas.
     */
    public function hitungRingkasan(?string $dari = null, ?string $sampai = null): array
    {
        $query = ArusKas::query();

        if ($dari) {
            $query->whereDate('tanggal', '>=', $dari);
        }
        if ($sampai) {
            $query->whereDate('tanggal', '<=', $sampai);
        }

        $pemasukan   = (float) (clone $query)->where('jenis', 'pemasukan')->sum('nominal');
        $pengeluaran = (float) (clone $query)->where('jenis', 'pengeluaran')->sum('nominal');

        return [
            'pemasukan'   => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'saldo'       => $pemasukan - $pengeluaran,
        ];
    }
}
