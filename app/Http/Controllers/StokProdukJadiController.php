<?php

namespace App\Http\Controllers;

use App\Http\Requests\PengirimanProdukRequest;
use App\Models\Produk;
use App\Models\StokProdukJadi;
use App\Services\Inventory\StockProdukService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokProdukJadiController extends Controller
{
    public function __construct(
        private readonly StockProdukService $service
    ) {}

    /**
     * Daftar riwayat seluruh transaksi stok produk jadi.
     */
    public function index(Request $request)
    {
        $search        = $request->input('search');
        $produkId      = $request->input('produk_id');
        $tanggalDari   = $request->input('tanggal_dari');
        $tanggalSampai = $request->input('tanggal_sampai');
        $sortBy        = $request->input('sort_by', 'created_at');
        $sortDir       = $request->input('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'qty', 'stok_sebelum', 'stok_sesudah', 'jenis_transaksi'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $riwayat = StokProdukJadi::with('produk')
            ->when($search, function ($query, $search) {
                $query->whereHas('produk', function ($q) use ($search) {
                    $q->where('kode_produk', 'like', "%{$search}%")
                      ->orWhere('nama_produk', 'like', "%{$search}%");
                })->orWhere('keterangan', 'like', "%{$search}%");
            })
            ->when($produkId, function ($query, $id) {
                $query->where('produk_id', $id);
            })
            ->when($tanggalDari, function ($query, $tanggal) {
                $query->whereDate('created_at', '>=', $tanggal);
            })
            ->when($tanggalSampai, function ($query, $tanggal) {
                $query->whereDate('created_at', '<=', $tanggal);
            })
            ->orderBy($sortBy, $sortDir)
            ->paginate(15)
            ->withQueryString();

        $produkOptions = Produk::orderBy('nama_produk')
            ->get(['id', 'kode_produk', 'nama_produk']);

        return Inertia::render('stok-produk-jadi/index', [
            'riwayat'      => $riwayat,
            'produkOptions' => $produkOptions,
            'filters'      => [
                'search'         => $search,
                'produk_id'      => $produkId,
                'tanggal_dari'   => $tanggalDari,
                'tanggal_sampai' => $tanggalSampai,
                'sort_by'        => $sortBy,
                'sort_dir'       => $sortDir,
            ],
        ]);
    }

    /**
     * Form pengiriman produk jadi.
     */
    public function create(Request $request)
    {
        $produkList = Produk::orderBy('nama_produk')
            ->get(['id', 'kode_produk', 'nama_produk', 'stok']);

        $selectedId = $request->input('produk_id');

        return Inertia::render('stok-produk-jadi/create', [
            'produkList' => $produkList,
            'selectedId' => $selectedId ? (int) $selectedId : null,
        ]);
    }

    /**
     * Proses pengiriman — panggil service, redirect ke index.
     */
    public function store(PengirimanProdukRequest $request)
    {
        $produk = Produk::findOrFail($request->validated('produk_id'));

        try {
            $this->service->reduceStock(
                produk:      $produk,
                qty:         (int) $request->validated('qty'),
                jenis:       'pengiriman',
                keterangan:  $request->validated('keterangan'),
                createdBy:   auth()->id(),
            );
        } catch (\RuntimeException $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('stok-produk-jadi.index')
            ->with('success', "Pengiriman {$produk->nama_produk} berhasil dicatat.");
    }

    /**
     * Detail satu transaksi stok produk jadi.
     */
    public function show(StokProdukJadi $stokProdukJadi)
    {
        $stokProdukJadi->load('produk');

        return Inertia::render('stok-produk-jadi/show', [
            'transaksi' => $stokProdukJadi,
        ]);
    }
}
