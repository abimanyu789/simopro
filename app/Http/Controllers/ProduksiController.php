<?php

namespace App\Http\Controllers;

use App\Http\Requests\InputProgressRequest;
use App\Http\Requests\ProduksiRequest;
use App\Models\Karyawan;
use App\Models\Pesanan;
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
                $query->whereHas('pesanan', function ($q) use ($search) {
                    $q->where('nomor_pesanan', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q2) use ($search) {
                          $q2->where('nama_customer', 'like', "%{$search}%");
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
     * Form buat produksi baru — load pesanan valid + preview kebutuhan bahan.
     */
    public function create(Request $request)
    {
        // Pesanan valid: status pending atau proses, belum punya produksi aktif
        $pesananValid = Pesanan::with('customer')
            ->whereIn('status', ['pending', 'proses'])
            ->whereDoesntHave('produksi', function ($q) {
                $q->whereIn('status', ['draft', 'proses']);
            })
            ->orderByDesc('created_at')
            ->get(['id', 'nomor_pesanan', 'status', 'customer_id', 'tanggal', 'total']);

        // Jika ada pre-select pesanan_id dari query param, hitung kebutuhan bahan langsung
        $selectedPesananId   = $request->integer('pesanan_id') ?: null;
        $kebutuhanBahan      = [];
        $selectedPesanan     = null;

        if ($selectedPesananId) {
            $selectedPesanan = Pesanan::with([
                'customer',
                'detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
            ])->find($selectedPesananId);

            if ($selectedPesanan) {
                $kebutuhanBahan = $this->service->hitungKebutuhanBahan($selectedPesanan);
            }
        }

        return Inertia::render('produksi/create', [
            'pesananValid'     => $pesananValid,
            'selectedPesanan'  => $selectedPesanan,
            'kebutuhanBahan'   => $kebutuhanBahan,
        ]);
    }

    /**
     * Simpan produksi baru.
     */
    public function store(ProduksiRequest $request)
    {
        $pesanan = Pesanan::findOrFail($request->validated('pesanan_id'));

        try {
            $produksi = $this->service->create(
                $pesanan,
                $request->validated(),
                auth()->id()
            );
        } catch (\RuntimeException $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        return redirect()
            ->route('produksi.show', $produksi)
            ->with('success', "Produksi untuk {$pesanan->nomor_pesanan} berhasil dibuat.");
    }

    /**
     * Detail produksi — termasuk preview kebutuhan bahan dari BOM.
     */
    public function show(Produksi $produksi)
    {
        $produksi->load([
            'pesanan.customer',
            'pesanan.detailPesanan.produk',
            'pesanan.detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
            'createdBy',
            'detailProduksi.karyawan',
            'detailProduksi.produk',
        ]);

        $kebutuhanBahan  = $this->service->hitungKebutuhanBahan($produksi->pesanan);
        $stokCukup       = $this->service->cekKecukupanStok($produksi->pesanan);

        // Daftar produk dari pesanan untuk form input progress
        $produkList = $produksi->pesanan->detailPesanan->map(fn ($d) => [
            'id'          => $d->produk->id,
            'kode_produk' => $d->produk->kode_produk,
            'nama_produk' => $d->produk->nama_produk,
            'qty_pesanan' => $d->qty,
        ])->unique('id')->values();

        // Daftar karyawan aktif untuk form input progress
        $karyawanList = Karyawan::where('status', 'aktif')
            ->orderBy('nama_karyawan')
            ->get(['id', 'nama_karyawan', 'jabatan']);

        return Inertia::render('produksi/show', [
            'produksi'       => $produksi,
            'kebutuhanBahan' => $kebutuhanBahan,
            'stokCukup'      => $stokCukup,
            'produkList'     => $produkList,
            'karyawanList'   => $karyawanList,
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
     * Draft  → dibatalkan (tanpa rollback stok).
     * Proses → dibatalkan (rollback seluruh stok bahan baku).
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
     * Input progress produksi — lolos QC: simpan histori + tambah stok produk jadi.
     * Tidak lolos QC: tampilkan error, tidak ada yang disimpan.
     */
    public function progress(InputProgressRequest $request, Produksi $produksi)
    {
        try {
            $this->service->inputProgress(
                produksi:   $produksi,
                produkId:   $request->validated('produk_id'),
                karyawanId: $request->validated('karyawan_id'),
                qty:        $request->validated('qty'),
                qcLolos:    (bool) $request->validated('qc_lolos'),
                userId:     auth()->id(),
            );
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Progress produksi berhasil dicatat. Stok produk jadi telah bertambah.');
    }

    /**
     * Selesaikan produksi — hanya mengubah status, tidak ada operasi stok.
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
}
