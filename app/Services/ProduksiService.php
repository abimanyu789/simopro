<?php

namespace App\Services;

use App\Models\BahanBaku;
use App\Models\DetailProduksi;
use App\Models\Produk;
use App\Models\Produksi;
use App\Models\ProduksiItem;
use App\Models\ProduksiKaryawan;
use App\Services\Inventory\StockBahanBakuService;
use App\Services\Inventory\StockProdukService;
use Illuminate\Support\Facades\DB;

class ProduksiService
{
    public function __construct(
        private readonly StockBahanBakuService $stockBahanBakuService,
        private readonly StockProdukService $stockProdukService
    ) {}

    // ─── Create ──────────────────────────────────────────────────────────────

    /**
     * Buat produksi baru.
     *
     * Mendukung dua jenis:
     *   - pesanan: target berasal dari detail_pesanan
     *   - restok:  target diinput manual oleh admin via $data['items']
     *
     * Business rules:
     * - BR-01: Status awal = draft
     * - BR-15: Produksi pesanan — satu pesanan hanya boleh satu produksi aktif
     *
     * @param  array $data  Validated data dari ProduksiRequest
     * @param  int   $createdBy
     * @throws \RuntimeException
     */
    public function create(array $data, int $createdBy): Produksi
    {
        $jenis = $data['jenis_produksi'];

        if ($jenis === 'pesanan') {
            return $this->createDariPesanan($data, $createdBy);
        }

        return $this->createRestok($data, $createdBy);
    }

    private function createDariPesanan(array $data, int $createdBy): Produksi
    {
        $pesanan = \App\Models\Pesanan::with('detailPesanan')->findOrFail($data['pesanan_id']);

        // BR-15: Cek produksi aktif untuk pesanan ini
        if ($pesanan->produksi()->whereIn('status', ['draft', 'proses'])->exists()) {
            throw new \RuntimeException(
                "Pesanan {$pesanan->nomor_pesanan} sudah memiliki produksi aktif."
            );
        }

        return DB::transaction(function () use ($pesanan, $data, $createdBy) {
            $qtyTarget = $pesanan->detailPesanan->sum('qty');

            $produksi = Produksi::create([
                'pesanan_id'     => $pesanan->id,
                'created_by'     => $createdBy,
                'jenis_produksi' => 'pesanan',
                'deadline'       => $data['deadline'] ?? null,
                'qty_target'     => $qtyTarget,
                'qty_selesai'    => 0,
                'status'         => 'draft',
                'status_qc'      => 'belum_dicek',
                'catatan'        => $data['catatan'] ?? null,
            ]);

            // Populate produksi_item dari detail_pesanan
            foreach ($pesanan->detailPesanan as $detail) {
                ProduksiItem::create([
                    'produksi_id' => $produksi->id,
                    'produk_id'   => $detail->produk_id,
                    'qty_target'  => $detail->qty,
                ]);
            }

            // Simpan daftar karyawan
            $this->syncKaryawan($produksi, $data['karyawan_ids'] ?? []);

            return $produksi;
        });
    }

    private function createRestok(array $data, int $createdBy): Produksi
    {
        $items     = $data['items'] ?? [];
        $qtyTarget = collect($items)->sum('qty_target');

        return DB::transaction(function () use ($data, $createdBy, $items, $qtyTarget) {
            $produksi = Produksi::create([
                'pesanan_id'     => null,
                'created_by'     => $createdBy,
                'jenis_produksi' => 'restok',
                'deadline'       => $data['deadline'] ?? null,
                'qty_target'     => $qtyTarget,
                'qty_selesai'    => 0,
                'status'         => 'draft',
                'status_qc'      => 'belum_dicek',
                'catatan'        => $data['catatan'] ?? null,
            ]);

            // Populate produksi_item dari input admin
            foreach ($items as $item) {
                ProduksiItem::create([
                    'produksi_id' => $produksi->id,
                    'produk_id'   => $item['produk_id'],
                    'qty_target'  => $item['qty_target'],
                ]);
            }

            // Simpan daftar karyawan
            $this->syncKaryawan($produksi, $data['karyawan_ids'] ?? []);

            return $produksi;
        });
    }

    private function syncKaryawan(Produksi $produksi, array $karyawanIds): void
    {
        foreach ($karyawanIds as $karyawanId) {
            ProduksiKaryawan::firstOrCreate([
                'produksi_id' => $produksi->id,
                'karyawan_id' => $karyawanId,
            ]);
        }
    }

    // ─── Mulai & Batalkan ────────────────────────────────────────────────────

    /**
     * Mulai produksi: potong stok bahan baku sesuai BOM, ubah status draft → proses.
     *
     * Business rules:
     * - BR-04: Produksi hanya bisa mulai jika stok bahan mencukupi
     * - BR-05: Saat proses, stok bahan baku otomatis berkurang
     * - BR-06: Jika tidak cukup, status tetap draft
     *
     * @throws \RuntimeException
     */
    public function mulaiProduksi(Produksi $produksi, int $userId): Produksi
    {
        if (!$produksi->isDraft()) {
            throw new \RuntimeException(
                "Produksi hanya bisa dimulai dari status draft. Status saat ini: {$produksi->status}."
            );
        }

        // Load produksi_item beserta BOM produk
        $produksi->loadMissing([
            'produksiItems.produk.bomCategorie.bomDetails.bahanBaku',
        ]);

        if (!$this->cekKecukupanStok($produksi)) {
            throw new \RuntimeException(
                'Produksi tidak dapat dimulai karena terdapat produk yang belum memiliki BOM atau stok bahan baku tidak mencukupi.'
            );
        }

        return DB::transaction(function () use ($produksi) {
            $kebutuhan   = $this->hitungKebutuhanBahan($produksi);
            $keterangan  = $this->labelProduksi($produksi);

            foreach ($kebutuhan as $item) {
                $bahanBaku = BahanBaku::lockForUpdate()->findOrFail($item['id']);
                $this->stockBahanBakuService->reduceStock(
                    bahanBaku:  $bahanBaku,
                    qty:        $item['kebutuhan'],
                    jenis:      'produksi',
                    keterangan: "Produksi {$keterangan}",
                );
            }

            $produksi->update(['status' => 'proses']);

            return $produksi->fresh();
        });
    }

    /**
     * Batalkan produksi.
     *
     * draft  → dibatalkan (tanpa rollback stok, belum pernah potong)
     * proses → dibatalkan (rollback stok bahan baku, BR-13)
     *
     * @throws \RuntimeException
     */
    public function batalkanProduksi(Produksi $produksi, int $userId): Produksi
    {
        if ($produksi->isSelesai() || $produksi->isDibatalkan()) {
            throw new \RuntimeException(
                "Produksi dengan status '{$produksi->status}' tidak dapat dibatalkan."
            );
        }

        return DB::transaction(function () use ($produksi) {
            if ($produksi->isProses()) {
                $produksi->loadMissing([
                    'produksiItems.produk.bomCategorie.bomDetails.bahanBaku',
                ]);

                $kebutuhan  = $this->hitungKebutuhanBahan($produksi);
                $keterangan = $this->labelProduksi($produksi);

                foreach ($kebutuhan as $item) {
                    $bahanBaku = BahanBaku::lockForUpdate()->findOrFail($item['id']);
                    $this->stockBahanBakuService->addStock(
                        bahanBaku:  $bahanBaku,
                        qty:        $item['kebutuhan'],
                        jenis:      'rollback',
                        keterangan: "Rollback Produksi {$keterangan}",
                    );
                }
            }

            $produksi->update(['status' => 'dibatalkan']);

            return $produksi->fresh();
        });
    }

    // ─── Progress & Selesai ──────────────────────────────────────────────────

    /**
     * Input progress produksi per produk.
     * Admin memilih produk, qty, dan qc_status.
     * Karyawan tidak dipilih saat progress — sudah ditentukan saat create.
     *
     * Business rules:
     * - BR-09: Progress + qc_status disimpan di detail_produksi
     * - BR-10: Lolos QC → tambah stok produk jadi via StockProdukService
     * - BR-11: Tidak lolos → detail tetap disimpan, stok tidak bertambah
     * - BR-12: Dropdown produk hanya tampil jika qty lolos < qty_target per produk
     *
     * @throws \RuntimeException
     */
    public function inputProgress(
        Produksi $produksi,
        int $produkId,
        int $qty,
        string $qcStatus,
        int $userId
    ): DetailProduksi {
        if (!$produksi->isProses()) {
            throw new \RuntimeException('Progress hanya dapat diinput saat produksi berstatus Proses.');
        }

        // Validasi produk ada di produksi_item
        $produksi->loadMissing('produksiItems');
        $produksiItem = $produksi->produksiItems->firstWhere('produk_id', $produkId);
        if (!$produksiItem) {
            throw new \RuntimeException('Produk yang dipilih tidak termasuk dalam produksi ini.');
        }

        // Validasi per produk: qty lolos saat ini + qty baru tidak boleh melebihi target produk
        if ($qcStatus === 'lolos') {
            $qtyLolosPerProduk = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('produk_id', $produkId)
                ->where('qc_status', 'lolos')
                ->sum('qty_selesai');

            if ($qtyLolosPerProduk + $qty > $produksiItem->qty_target) {
                throw new \RuntimeException(
                    "Jumlah progress ({$qty}) akan melebihi target produk ini. " .
                    "Sisa target: " . ($produksiItem->qty_target - $qtyLolosPerProduk) . " pcs."
                );
            }
        }

        return DB::transaction(function () use ($produksi, $produkId, $qty, $qcStatus, $userId) {
            $produk     = Produk::findOrFail($produkId);
            $keterangan = $this->labelProduksi($produksi);

            // Simpan histori progress — selalu disimpan terlepas dari QC
            $detail = DetailProduksi::create([
                'produksi_id' => $produksi->id,
                'produk_id'   => $produkId,
                'qty_selesai' => $qty,
                'qc_status'   => $qcStatus,
            ]);

            if ($qcStatus === 'lolos') {
                // BR-10: Tambah stok produk jadi
                $this->stockProdukService->addStock(
                    produk:     $produk,
                    qty:        $qty,
                    jenis:      'produksi',
                    keterangan: "Progress Produksi {$keterangan} — {$produk->nama_produk}",
                    createdBy:  $userId,
                );
            }

            // Recalculate qty_selesai dari SUM lolos agar konsisten
            $qtySelesaiBaru = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('qc_status', 'lolos')
                ->sum('qty_selesai');

            // Calculate overall QC status
            $adaTidakLolos = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('qc_status', 'tidak_lolos')
                ->exists();

            $produksi->update([
                'qty_selesai' => (int) $qtySelesaiBaru,
                'status_qc'   => $adaTidakLolos ? 'tidak_lolos' : 'lolos',
            ]);

            return $detail;
        });
    }

    /**
     * Selesaikan produksi. Hanya ubah status → selesai.
     * Stok sudah bertambah bertahap saat setiap progress lolos QC.
     *
     * BR-17: qty lolos == qty_target sebelum bisa selesai.
     *
     * @throws \RuntimeException
     */
    public function selesaikanProduksi(Produksi $produksi): Produksi
    {
        if (!$produksi->isProses()) {
            throw new \RuntimeException('Produksi hanya dapat diselesaikan dari status Proses.');
        }

        if ($produksi->qty_selesai < $produksi->qty_target) {
            throw new \RuntimeException(
                "Produksi belum dapat diselesaikan. Progress saat ini: {$produksi->qty_selesai} / {$produksi->qty_target} pcs."
            );
        }

        $produksi->update(['status' => 'selesai']);

        return $produksi->fresh();
    }

    // ─── Kalkulasi ───────────────────────────────────────────────────────────

    /**
     * Hitung kebutuhan bahan baku dari BOM semua produk di produksi_item.
     * Berlaku untuk Produksi Pesanan maupun Produksi Restok.
     *
     * BR-03: Kebutuhan dihitung dari BOM seluruh produk pada produksi_item.
     */
    public function hitungKebutuhanBahan(Produksi $produksi): array
    {
        $produksi->loadMissing([
            'produksiItems.produk.bomCategorie.bomDetails.bahanBaku',
        ]);

        $kebutuhan = [];

        foreach ($produksi->produksiItems as $item) {
            $produk = $item->produk;

            if (!$produk || !$produk->bomCategorie) {
                continue;
            }

            $qtyProduk = $item->qty_target;

            foreach ($produk->bomCategorie->bomDetails as $bomDetail) {
                $bahanBaku = $bomDetail->bahanBaku;
                if (!$bahanBaku) {
                    continue;
                }

                $id           = $bahanBaku->id;
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
                        'cukup'         => true,
                    ];
                }
            }
        }

        foreach ($kebutuhan as $id => $item) {
            $kebutuhan[$id]['cukup'] = $item['stok_tersedia'] >= $item['kebutuhan'];
        }

        return array_values($kebutuhan);
    }

    public function cekKecukupanStok(Produksi $produksi): bool
    {
        $produksi->loadMissing([
            'produksiItems.produk.bomCategorie.bomDetails.bahanBaku',
        ]);

        // BR-03: Semua produk harus punya BOM
        foreach ($produksi->produksiItems as $item) {
            if (!$item->produk || !$item->produk->bom_category_id || !$item->produk->bomCategorie) {
                return false;
            }
        }

        $kebutuhan = $this->hitungKebutuhanBahan($produksi);
        
        // Jika tidak ada kebutuhan bahan baku padahal ada produk yang diproduksi, 
        // berarti BOM-nya kosong (tidak valid).
        if (empty($kebutuhan) && $produksi->produksiItems->sum('qty_target') > 0) {
            return false;
        }

        // BR-04: Semua stok harus mencukupi
        foreach ($kebutuhan as $bahan) {
            if (!$bahan['cukup']) {
                return false;
            }
        }

        return true;
    }

    /**
     * Hitung progress per produk dari histori detail_produksi.
     * Return: array indexed by produk_id → ['lolos' => int, 'tidak_lolos' => int, 'target' => int]
     */
    public function hitungProgressPerProduk(Produksi $produksi): array
    {
        $produksi->loadMissing('produksiItems');

        $result = [];

        foreach ($produksi->produksiItems as $item) {
            $lolos = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('produk_id', $item->produk_id)
                ->where('qc_status', 'lolos')
                ->sum('qty_selesai');

            $tidakLolos = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('produk_id', $item->produk_id)
                ->where('qc_status', 'tidak_lolos')
                ->sum('qty_selesai');

            $result[$item->produk_id] = [
                'lolos'       => (int) $lolos,
                'tidak_lolos' => (int) $tidakLolos,
                'target'      => $item->qty_target,
                'selesai'     => $lolos >= $item->qty_target,
            ];
        }

        return $result;
    }

    // ─── Summary Cards ───────────────────────────────────────────────────────

    /**
     * Hitung summary cards untuk halaman index Produksi.
     * Data dihitung dari histori detail_produksi (lolos QC saja untuk qty).
     */
    public function hitungSummary(): array
    {
        $today = now()->toDateString();

        $batchHariIni      = Produksi::whereDate('created_at', $today)->count();
        $qtySelesaiHariIni = DetailProduksi::whereDate('created_at', $today)
            ->where('qc_status', 'lolos')
            ->sum('qty_selesai');

        // Karyawan paling produktif: dari produksi_karyawan + detail_produksi lolos (30 hari)
        // Karena detail_produksi tidak punya karyawan_id lagi, kita hitung dari produksi_karyawan
        // yang terlibat pada produksi yang punya progress lolos QC
        $karyawanData = $this->hitungKaryawanProduktif();

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

    private function hitungKaryawanProduktif(): ?array
    {
        // Hitung total qty lolos per produksi (30 hari), lalu ambil karyawan yang terlibat
        $produksiAktif = Produksi::where('created_at', '>=', now()->subDays(30))
            ->whereIn('status', ['proses', 'selesai'])
            ->with('produksiKaryawans.karyawan')
            ->get();

        if ($produksiAktif->isEmpty()) {
            return null;
        }

        // Hitung kontribusi qty per karyawan berdasarkan qty_selesai produksi yang mereka ikuti
        $qtyPerKaryawan = [];

        foreach ($produksiAktif as $produksi) {
            $qtyLolos = DetailProduksi::where('produksi_id', $produksi->id)
                ->where('qc_status', 'lolos')
                ->sum('qty_selesai');

            if ($qtyLolos <= 0) {
                continue;
            }

            $jumlahKaryawan = $produksi->produksiKaryawans->count();
            if ($jumlahKaryawan === 0) {
                continue;
            }

            $kontribusiPerKaryawan = $qtyLolos / $jumlahKaryawan;

            foreach ($produksi->produksiKaryawans as $pk) {
                $id   = $pk->karyawan_id;
                $nama = $pk->karyawan?->nama_karyawan ?? '-';

                if (!isset($qtyPerKaryawan[$id])) {
                    $qtyPerKaryawan[$id] = ['nama' => $nama, 'total' => 0];
                }
                $qtyPerKaryawan[$id]['total'] += $kontribusiPerKaryawan;
            }
        }

        if (empty($qtyPerKaryawan)) {
            return null;
        }

        arsort($qtyPerKaryawan);
        $top   = reset($qtyPerKaryawan);
        $total = array_sum(array_column($qtyPerKaryawan, 'total'));

        return [
            'nama'       => $top['nama'],
            'total_qty'  => (int) round($top['total']),
            'kontribusi' => $total > 0 ? round(($top['total'] / $total) * 100) : 0,
        ];
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private function labelProduksi(Produksi $produksi): string
    {
        if ($produksi->isPesanan() && $produksi->pesanan) {
            return $produksi->pesanan->nomor_pesanan;
        }

        return "RESTOK-{$produksi->id}";
    }
}
