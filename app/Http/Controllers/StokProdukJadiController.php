<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransaksiProdukRequest;
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
        $jenisTransaksi = $request->input('jenis_transaksi');
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
            ->when($jenisTransaksi, function ($query, $jenis) {
                $query->where('jenis_transaksi', $jenis);
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
                'search'          => $search,
                'produk_id'       => $produkId,
                'jenis_transaksi' => $jenisTransaksi,
                'tanggal_dari'    => $tanggalDari,
                'tanggal_sampai'  => $tanggalSampai,
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
     * Proses transaksi stok produk jadi — routing ke addStock/reduceStock berdasarkan jenis & sign qty.
     */
    public function store(TransaksiProdukRequest $request)
    {
        $produk     = Produk::findOrFail($request->validated('produk_id'));
        $jenis      = $request->validated('jenis_transaksi');
        $qty        = (int) $request->validated('qty');
        $keterangan = $request->validated('keterangan');

        try {
            // Pengiriman selalu kurangi. Penyesuaian bisa + atau − tergantung sign qty.
            if ($jenis === 'pengiriman' || $qty < 0) {
                $this->service->reduceStock(
                    produk:     $produk,
                    qty:        abs($qty),
                    jenis:      $jenis,
                    keterangan: $keterangan,
                    createdBy:  auth()->id(),
                );
            } else {
                $this->service->addStock(
                    produk:     $produk,
                    qty:        abs($qty),
                    jenis:      $jenis,
                    keterangan: $keterangan,
                    createdBy:  auth()->id(),
                );
            }
        } catch (\RuntimeException $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        $label = $jenis === 'pengiriman' ? 'Pengiriman' : 'Penyesuaian stok';

        return redirect()
            ->route('stok-produk-jadi.index')
            ->with('success', "{$label} {$produk->nama_produk} berhasil dicatat.");
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
