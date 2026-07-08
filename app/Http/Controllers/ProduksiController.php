<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProduksiRequest;
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
            'pesanan.detailPesanan.produk.bomCategorie.bomDetails.bahanBaku',
            'createdBy',
            'detailProduksi.karyawan',
        ]);

        $kebutuhanBahan  = $this->service->hitungKebutuhanBahan($produksi->pesanan);
        $stokCukup       = $this->service->cekKecukupanStok($produksi->pesanan);

        return Inertia::render('produksi/show', [
            'produksi'      => $produksi,
            'kebutuhanBahan' => $kebutuhanBahan,
            'stokCukup'     => $stokCukup,
        ]);
    }
}
