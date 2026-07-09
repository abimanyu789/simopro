<?php

namespace App\Services;

use App\Models\BahanBaku;
use App\Models\DetailProduksi;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Produksi;
use App\Services\Inventory\StockBahanBakuService;
use App\Services\Inventory\StockProdukService;
use Illuminate\Support\Facades\DB;

class ProduksiService
{
    public function __construct(
        private readonly StockBahanBakuService $stockBahanBakuService,
        private readonly StockProdukService $stockProdukService
    ) {}
    /**
     * Mulai produksi: potong stok bahan baku sesuai BOM, ubah status draft → proses.
     *
     * Business rules:
     * - BR-03: Hanya bisa mulai jika semua stok bahan baku mencukupi
     * - BR-04: Stok bahan baku otomatis berkurang saat status jadi proses
     * - BR-05: Jika stok tidak cukup, tolak dan status tetap draft
     *
     * @throws \RuntimeException  Jika status bukan draft atau stok tidak mencukupi.
     */
    public function mulaiProduksi(Produksi $produksi, int $userId): Produksi
    {
        if (!$produksi->isDraft()) {
            throw new \RuntimeException(
                "Produksi hanya bisa dimulai dari status draft. Status saat ini: {$produksi->status}."
            );
        }

        // BR-03 & BR-05: Cek kecukupan stok sebelum memulai
        $produksi->loadMissing([
            'pesanan.detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
        ]);

        if (!$this->cekKecukupanStok($produksi->pesanan)) {
            throw new \RuntimeException(
                'Produksi tidak dapat dimulai karena stok bahan baku tidak mencukupi.'
            );
        }

        return DB::transaction(function () use ($produksi, $userId) {
            $kebutuhan = $this->hitungKebutuhanBahan($produksi->pesanan);
            $nomorPesanan = $produksi->pesanan->nomor_pesanan;

            // BR-04: Kurangi stok bahan baku sesuai BOM melalui StockBahanBakuService
            foreach ($kebutuhan as $item) {
                $bahanBaku = BahanBaku::lockForUpdate()->findOrFail($item['id']);
                $this->stockBahanBakuService->reduceStock(
                    bahanBaku:  $bahanBaku,
                    qty:        $item['kebutuhan'],
                    jenis:      'produksi',
                    keterangan: "Produksi {$nomorPesanan}",
                );
            }

            $produksi->update(['status' => 'proses']);

            return $produksi->fresh();
        });
    }

    /**
     * Batalkan produksi.
     *
     * Jika status draft  → batalkan langsung, tidak ada rollback stok.
     * Jika status proses → rollback seluruh stok bahan baku via addStock() (jenis rollback).
     *
     * Business rule BR-08: Cancel → stok bahan baku yang sudah terpakai dikembalikan.
     *
     * @throws \RuntimeException  Jika status sudah selesai atau dibatalkan.
     */
    public function batalkanProduksi(Produksi $produksi, int $userId): Produksi
    {
        if ($produksi->isSelesai() || $produksi->isDibatalkan()) {
            throw new \RuntimeException(
                "Produksi dengan status '{$produksi->status}' tidak dapat dibatalkan."
            );
        }

        return DB::transaction(function () use ($produksi, $userId) {
            // Hanya rollback stok jika produksi sudah pernah memotong stok (status proses)
            if ($produksi->isProses()) {
                $produksi->loadMissing([
                    'pesanan.detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
                ]);

                $kebutuhan    = $this->hitungKebutuhanBahan($produksi->pesanan);
                $nomorPesanan = $produksi->pesanan->nomor_pesanan;

                foreach ($kebutuhan as $item) {
                    $bahanBaku = BahanBaku::lockForUpdate()->findOrFail($item['id']);
                    $this->stockBahanBakuService->addStock(
                        bahanBaku:  $bahanBaku,
                        qty:        $item['kebutuhan'],
                        jenis:      'rollback',
                        keterangan: "Rollback Produksi {$nomorPesanan}",
                    );
                }
            }

            $produksi->update(['status' => 'dibatalkan']);

            return $produksi->fresh();
        });
    }

    /**
     * Status awal: draft. Tidak ada perubahan stok pada tahap ini.
     *
     * Business rules:
     * - BR-01: Status awal = draft
     * - BR-11: Satu pesanan tidak boleh punya produksi aktif lebih dari satu
     *
     * @throws \RuntimeException  Jika pesanan sudah memiliki produksi aktif.
     */
    public function create(Pesanan $pesanan, array $data, int $createdBy): Produksi
    {
        // BR-11: Cek produksi aktif untuk pesanan ini
        if ($pesanan->produksi()->whereIn('status', ['draft', 'proses'])->exists()) {
            throw new \RuntimeException(
                "Pesanan {$pesanan->nomor_pesanan} sudah memiliki produksi aktif."
            );
        }

        return DB::transaction(function () use ($pesanan, $data, $createdBy) {
            $qtyTarget = $this->hitungTargetProduksi($pesanan);

            return Produksi::create([
                'pesanan_id'  => $pesanan->id,
                'created_by'  => $createdBy,
                'deadline'    => $data['deadline'] ?? null,
                'qty_target'  => $qtyTarget,
                'qty_selesai' => 0,
                'status'      => 'draft',
                'status_qc'   => 'belum_dicek',
                'catatan'     => $data['catatan'] ?? null,
            ]);
        });
    }

    /**
     * Hitung total qty produksi dari semua item di pesanan.
     *
     * qty_target = sum(detail_pesanan.qty) untuk pesanan ini.
     */
    public function hitungTargetProduksi(Pesanan $pesanan): int
    {
        $pesanan->loadMissing('detailPesanan');

        return $pesanan->detailPesanan->sum('qty');
    }

    /**
     * Hitung kebutuhan bahan baku dari BOM semua produk di pesanan.
     *
     * Business rule BR-02: Kebutuhan bahan dihitung dari BOM seluruh produk pada pesanan.
     *
     * Return format:
     * [
     *   bahan_baku_id => [
     *     'id'             => int,
     *     'kode_bahan'     => string,
     *     'nama_bahan'     => string,
     *     'satuan'         => string,
     *     'kebutuhan'      => float,   -- total qty yang dibutuhkan
     *     'stok_tersedia'  => float,   -- stok saat ini di bahan_baku.stok
     *     'cukup'          => bool,    -- stok >= kebutuhan
     *   ],
     *   ...
     * ]
     */
    public function hitungKebutuhanBahan(Pesanan $pesanan): array
    {
        $pesanan->loadMissing([
            'detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
        ]);

        $kebutuhan = [];

        foreach ($pesanan->detailPesanan as $detail) {
            $produk = $detail->produk;

            if (!$produk || !$produk->bomCategorie) {
                continue;
            }

            $qtyProduk = $detail->qty;

            foreach ($produk->bomCategorie->bomDetails as $bomDetail) {
                $bahanBaku = $bomDetail->bahanBaku;
                if (!$bahanBaku) {
                    continue;
                }

                $id          = $bahanBaku->id;
                $kebutuhanQty = (float) $bomDetail->qty_per_pair * $qtyProduk;

                if (isset($kebutuhan[$id])) {
                    $kebutuhan[$id]['kebutuhan'] += $kebutuhanQty;
                } else {
                    $kebutuhan[$id] = [
                        'id'            => $id,
                        'kode_bahan'    => $bahanBaku->kode_bahan,
                        'nama_bahan'    => $bahanBaku->nama_bahan,
                        'satuan'        => $bahanBaku->satuan ?? '',
                        'kebutuhan'     => $kebutuhanQty,
                        'stok_tersedia' => (float) $bahanBaku->stok,
                        'cukup'         => true, // akan dihitung ulang di bawah
                    ];
                }
            }
        }

        // Hitung flag 'cukup' setelah semua kebutuhan teragregasi
        foreach ($kebutuhan as $id => $item) {
            $kebutuhan[$id]['cukup'] = $item['stok_tersedia'] >= $item['kebutuhan'];
        }

        return array_values($kebutuhan);
    }

    /**
     * Cek apakah semua stok bahan baku mencukupi untuk memulai produksi.
     *
     * Business rule BR-03: Produksi hanya bisa mulai jika stok bahan cukup.
     * Digunakan oleh: Tahap 2 (mulaiProduksi).
     */
    public function cekKecukupanStok(Pesanan $pesanan): bool
    {
        $kebutuhan = $this->hitungKebutuhanBahan($pesanan);

        foreach ($kebutuhan as $item) {
            if (!$item['cukup']) {
                return false;
            }
        }

        return true;
    }

    /**
     * Input progress produksi per produk per karyawan.
     * Hanya menyimpan progress yang lolos QC.
     * Progress tidak lolos QC ditolak dengan RuntimeException.
     */
    public function inputProgress(
        Produksi $produksi,
        int $produkId,
        int $karyawanId,
        int $qty,
        bool $qcLolos,
        int $userId
    ): DetailProduksi {
        if (!$produksi->isProses()) {
            throw new \RuntimeException('Progress hanya dapat diinput saat produksi berstatus Proses.');
        }

        // BR-12: Validasi produk ada di detail_pesanan pesanan ini
        $produksi->loadMissing('pesanan.detailPesanan');
        $produkIdValid = $produksi->pesanan->detailPesanan->pluck('produk_id')->contains($produkId);
        if (!$produkIdValid) {
            throw new \RuntimeException('Produk yang dipilih tidak termasuk dalam pesanan ini.');
        }

        // BR-09: Progress tidak lolos QC tidak disimpan
        if (!$qcLolos) {
            throw new \RuntimeException(
                'Hasil produksi tidak lolos QC. Produk harus diperbaiki (rework) sebelum dapat dicatat sebagai progress.'
            );
        }

        // Guard: qty_selesai + qty tidak boleh melebihi qty_target
        if ($produksi->qty_selesai + $qty > $produksi->qty_target) {
            throw new \RuntimeException(
                "Jumlah progress ({$qty}) akan melebihi target produksi. " .
                'Sisa target: ' . ($produksi->qty_target - $produksi->qty_selesai) . ' pcs.'
            );
        }

        return DB::transaction(function () use ($produksi, $produkId, $karyawanId, $qty, $userId) {
            $produk       = Produk::findOrFail($produkId);
            $nomorPesanan = $produksi->pesanan->nomor_pesanan;

            $detail = DetailProduksi::create([
                'produksi_id' => $produksi->id,
                'produk_id'   => $produkId,
                'karyawan_id' => $karyawanId,
                'qty_selesai' => $qty,
            ]);

            // Recalculate qty_selesai dari SUM agar konsisten dengan histori
            $qtySelesaiBaru = DetailProduksi::where('produksi_id', $produksi->id)
                ->sum('qty_selesai');
            $produksi->update(['qty_selesai' => $qtySelesaiBaru]);

            // BR-07: Tambah stok produk jadi melalui StockProdukService
            $this->stockProdukService->addStock(
                produk:     $produk,
                qty:        $qty,
                jenis:      'produksi',
                keterangan: "Progress Produksi {$nomorPesanan} \u2014 {$produk->nama_produk}",
                createdBy:  $userId,
            );

            return $detail;
        });
    }

    /**
     * Selesaikan produksi. Hanya ubah status → selesai.
     * Tidak ada operasi stok — stok sudah bertambah bertahap setiap progress lolos QC.
     */
    public function selesaikanProduksi(Produksi $produksi): Produksi
    {
        if (!$produksi->isProses()) {
            throw new \RuntimeException('Produksi hanya dapat diselesaikan dari status Proses.');
        }

        if ($produksi->qty_selesai !== $produksi->qty_target) {
            throw new \RuntimeException(
                "Produksi belum dapat diselesaikan. Progress saat ini: {$produksi->qty_selesai} / {$produksi->qty_target} pcs."
            );
        }

        $produksi->update(['status' => 'selesai']);

        return $produksi->fresh();
    }

    /**
     * Hitung summary cards untuk halaman index Produksi.
     * Data dihitung dari histori detail_produksi.
     */
    public function hitungSummary(): array
    {
        $today = now()->toDateString();

        $batchHariIni      = Produksi::whereDate('created_at', $today)->count();
        $qtySelesaiHariIni = DetailProduksi::whereDate('created_at', $today)->sum('qty_selesai');

        $karyawanProduktif = DetailProduksi::select(
                'karyawan_id',
                DB::raw('SUM(qty_selesai) as total_qty')
            )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('karyawan_id')
            ->orderByDesc('total_qty')
            ->with('karyawan:id,nama_karyawan')
            ->first();

        $totalQty30Hari = DetailProduksi::where('created_at', '>=', now()->subDays(30))
            ->sum('qty_selesai');

        $karyawanData = null;
        if ($karyawanProduktif) {
            $kontribusi = $totalQty30Hari > 0
                ? round(($karyawanProduktif->total_qty / $totalQty30Hari) * 100)
                : 0;
            $karyawanData = [
                'nama'       => $karyawanProduktif->karyawan?->nama_karyawan ?? '-',
                'total_qty'  => (int) $karyawanProduktif->total_qty,
                'kontribusi' => $kontribusi,
            ];
        }

        $qtyTargetAktif  = Produksi::where('status', 'proses')->sum('qty_target');
        $qtySelesaiAktif = Produksi::where('status', 'proses')->sum('qty_selesai');
        $efisiensi       = $qtyTargetAktif > 0
            ? round(($qtySelesaiAktif / $qtyTargetAktif) * 100)
            : 0;

        return [
            'batch_hari_ini'       => $batchHariIni,
            'qty_selesai_hari_ini' => (int) $qtySelesaiHariIni,
            'karyawan_produktif'   => $karyawanData,
            'efisiensi'            => [
                'qty_selesai' => (int) $qtySelesaiAktif,
                'qty_target'  => (int) $qtyTargetAktif,
                'persentase'  => $efisiensi,
            ],
        ];
    }
}
