<?php

namespace App\Http\Controllers;

use App\Http\Requests\InputProgressRequest;
use App\Http\Requests\ProduksiRequest;
use App\Models\Karyawan;
use App\Models\Pesanan;
use App\Models\Produk;
use App\Models\Produksi;
use App\Services\ProduksiService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProduksiController extends Controller
{
    public function __construct(
        private readonly ProduksiService $service
    ) {}

    /**
     * Daftar semua produksi.
     */
    public function index(Request $request)
    {
        $search  = $request->input('search');
        $status  = $request->input('status');
        $sortBy  = $request->input('sort_by', 'created_at');
        $sortDir = $request->input('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'deadline', 'qty_target', 'qty_selesai', 'status'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $produksis = Produksi::with('pesanan.customer')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('pesanan', function ($q2) use ($search) {
                        $q2->where('nomor_pesanan', 'like', "%{$search}%")
                          ->orWhereHas('customer', function ($q3) use ($search) {
                              $q3->where('nama_customer', 'like', "%{$search}%");
                          });
                    });
                });
            })
            ->when($status && in_array($status, ['draft', 'proses', 'selesai', 'dibatalkan']), function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('produksi/index', [
            'produksis' => $produksis,
            'summary'   => $this->service->hitungSummary(),
            'filters'   => [
                'search'   => $search,
                'status'   => $status,
                'sort_by'  => $sortBy,
                'sort_dir' => $sortDir,
            ],
        ]);
    }

    /**
     * Form create produksi — kirim data sesuai jenis yang dipilih.
     */
    public function create(Request $request)
    {
        // Pesanan valid: status pending/proses, belum punya produksi aktif
        $pesananValid = Pesanan::with('customer')
            ->whereIn('status', ['pending', 'proses'])
            ->whereDoesntHave('produksi', function ($q) {
                $q->whereIn('status', ['draft', 'proses']);
            })
            ->orderByDesc('created_at')
            ->get(['id', 'nomor_pesanan', 'status', 'customer_id', 'tanggal', 'total']);

        // Semua produk yang punya BOM (untuk Produksi Restok)
        $produkList = Produk::whereNotNull('bom_category_id')
            ->orderBy('nama_produk')
            ->get(['id', 'kode_produk', 'nama_produk', 'stok']);

        // Karyawan aktif untuk dipilih sebagai tim
        $karyawanList = Karyawan::where('status', 'aktif')
            ->orderBy('nama_karyawan')
            ->get(['id', 'nama_karyawan', 'jabatan']);

        // Jika ada pre-select pesanan_id, hitung kebutuhan bahan
        $selectedPesananId = $request->integer('pesanan_id') ?: null;
        $kebutuhanBahan    = [];
        $selectedPesanan   = null;

        if ($selectedPesananId) {
            // Buat Produksi dummy sementara untuk hitungKebutuhanBahan
            $tempProduksi = new Produksi(['pesanan_id' => $selectedPesananId]);
            $selectedPesanan = Pesanan::with([
                'customer',
                'detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
            ])->find($selectedPesananId);

            if ($selectedPesanan) {
                // Load produksiItems dari detail_pesanan sementara
                $tempItems = $selectedPesanan->detailPesanan->map(fn ($d) => (object)[
                    'produk_id'  => $d->produk_id,
                    'qty_target' => $d->qty,
                    'produk'     => $d->produk,
                ]);

                // Hitung kebutuhan manual (tanpa save ke DB)
                $kebutuhanBahan = $this->hitungKebutuhanBahanDariItems($tempItems);
            }
        }

        return Inertia::render('produksi/create', [
            'pesananValid'    => $pesananValid,
            'produkList'      => $produkList,
            'karyawanList'    => $karyawanList,
            'selectedPesanan' => $selectedPesanan,
            'kebutuhanBahan'  => $kebutuhanBahan,
        ]);
    }

    /**
     * Simpan produksi baru.
     */
    public function store(ProduksiRequest $request)
    {
        try {
            $produksi = $this->service->create(
                $request->validated(),
                auth()->id()
            );
        } catch (\RuntimeException $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        $label = $produksi->jenis_produksi === 'pesanan'
            ? "pesanan {$produksi->pesanan?->nomor_pesanan}"
            : "restok";

        return redirect()
            ->route('produksi.show', $produksi)
            ->with('success', "Produksi {$label} berhasil dibuat.");
    }

    /**
     * Detail produksi — kebutuhan bahan, progress per produk, karyawan terlibat.
     */
    public function show(Produksi $produksi)
    {
        $produksi->load([
            'pesanan.customer',
            'produksiItems.produk',
            'produksiKaryawans.karyawan',
            'createdBy',
            'detailProduksi.produk',
        ]);

        $kebutuhanBahan    = $this->service->hitungKebutuhanBahan($produksi);
        $stokCukup         = $this->service->cekKecukupanStok($produksi);
        $progressPerProduk = $this->service->hitungProgressPerProduk($produksi);

        // Daftar produk yang masih perlu progress (qty lolos < target)
        $produkBelumSelesai = $produksi->produksiItems
            ->filter(fn ($item) => ($progressPerProduk[$item->produk_id]['lolos'] ?? 0) < $item->qty_target)
            ->map(fn ($item) => [
                'id'          => $item->produk->id,
                'kode_produk' => $item->produk->kode_produk,
                'nama_produk' => $item->produk->nama_produk,
                'qty_target'  => $item->qty_target,
                'qty_lolos'   => $progressPerProduk[$item->produk_id]['lolos'] ?? 0,
                'sisa'        => $item->qty_target - ($progressPerProduk[$item->produk_id]['lolos'] ?? 0),
            ])
            ->values();

        return Inertia::render('produksi/show', [
            'produksi'          => $produksi,
            'kebutuhanBahan'    => $kebutuhanBahan,
            'stokCukup'         => $stokCukup,
            'progressPerProduk' => $progressPerProduk,
            'produkBelumSelesai' => $produkBelumSelesai,
        ]);
    }

    /**
     * Mulai produksi — potong stok bahan baku, ubah status draft → proses.
     */
    public function mulai(Produksi $produksi)
    {
        try {
            $this->service->mulaiProduksi($produksi, auth()->id());
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Produksi berhasil dimulai. Stok bahan baku telah dikurangi.');
    }

    /**
     * Batalkan produksi.
     */
    public function batalkan(Produksi $produksi)
    {
        try {
            $this->service->batalkanProduksi($produksi, auth()->id());
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Produksi berhasil dibatalkan.');
    }

    /**
     * Input progress produksi — pilih produk, qty, qc_status.
     */
    public function progress(InputProgressRequest $request, Produksi $produksi)
    {
        try {
            $this->service->inputProgress(
                produksi:  $produksi,
                produkId:  $request->validated('produk_id'),
                qty:       $request->validated('qty'),
                qcStatus:  $request->validated('qc_status'),
                userId:    auth()->id(),
            );
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        $msg = $request->validated('qc_status') === 'lolos'
            ? 'Progress berhasil dicatat. Stok produk jadi bertambah.'
            : 'Progress dicatat sebagai tidak lolos QC. Stok tidak berubah.';

        return back()->with('success', $msg);
    }

    /**
     * Selesaikan produksi.
     */
    public function selesai(Produksi $produksi)
    {
        try {
            $this->service->selesaikanProduksi($produksi);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Produksi berhasil diselesaikan.');
    }

    // ─── Helper privat ───────────────────────────────────────────────────────

    /**
     * Hitung kebutuhan bahan dari collection items sementara (sebelum disimpan ke DB).
     * Digunakan untuk preview di form create.
     */
    private function hitungKebutuhanBahanDariItems($items): array
    {
        $kebutuhan = [];

        foreach ($items as $item) {
            $produk = $item->produk;

            if (!$produk || !$produk->bomCategorie) {
                continue;
            }

            foreach ($produk->bomCategorie->bomDetails as $bomDetail) {
                $bahanBaku = $bomDetail->bahanBaku;
                if (!$bahanBaku) {
                    continue;
                }

                $id           = $bahanBaku->id;
                $kebutuhanQty = (float) $bomDetail->qty_per_pair * $item->qty_target;

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
}
