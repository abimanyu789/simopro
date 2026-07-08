<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransaksiBahanBakuRequest;
use App\Models\BahanBaku;
use App\Models\StokBahanBaku;
use App\Services\Inventory\StockBahanBakuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokBahanBakuController extends Controller
{
    public function __construct(
        private readonly StockBahanBakuService $service
    ) {}

    /**
     * Daftar riwayat seluruh transaksi stok bahan baku.
     */
    public function index(Request $request)
    {
        $search        = $request->input('search');
        $bahanBakuId   = $request->input('bahan_baku_id');
        $jenisTranaksi = $request->input('jenis_transaksi');
        $tanggalDari   = $request->input('tanggal_dari');
        $tanggalSampai = $request->input('tanggal_sampai');
        $sortBy       = $request->input('sort_by', 'created_at');
        $sortDir      = $request->input('sort_dir', 'desc');

        $allowedSorts = ['created_at', 'qty', 'stok_sebelum', 'stok_sesudah', 'jenis_transaksi'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        $sortDir = $sortDir === 'asc' ? 'asc' : 'desc';

        $riwayat = StokBahanBaku::with('bahanBaku')
            ->when($search, function ($query, $search) {
                $query->whereHas('bahanBaku', function ($q) use ($search) {
                    $q->where('kode_bahan', 'like', "%{$search}%")
                      ->orWhere('nama_bahan', 'like', "%{$search}%");
                })->orWhere('keterangan', 'like', "%{$search}%");
            })
            ->when($bahanBakuId, function ($query, $id) {
                $query->where('bahan_baku_id', $id);
            })
            ->when($jenisTranaksi, function ($query, $jenis) {
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

        // Daftar bahan baku untuk filter dropdown
        $bahanBakuOptions = BahanBaku::orderBy('nama_bahan')
            ->get(['id', 'kode_bahan', 'nama_bahan']);

        return Inertia::render('stok-bahan-baku/index', [
            'riwayat'         => $riwayat,
            'bahanBakuOptions' => $bahanBakuOptions,
            'filters'         => [
                'search'         => $search,
                'bahan_baku_id'  => $bahanBakuId,
                'jenis_transaksi' => $jenisTranaksi,
                'tanggal_dari'   => $tanggalDari,
                'tanggal_sampai' => $tanggalSampai,
                'sort_by'        => $sortBy,
                'sort_dir'       => $sortDir,
            ],
        ]);
    }

    /**
     * Form tambah restock bahan baku.
     */
    public function create(Request $request)
    {
        $bahanBakuList = BahanBaku::orderBy('nama_bahan')
            ->get(['id', 'kode_bahan', 'nama_bahan', 'satuan', 'stok']);

        // Jika ada query param bahan_baku_id, pre-select bahan baku
        $selectedId = $request->input('bahan_baku_id');

        return Inertia::render('stok-bahan-baku/create', [
            'bahanBakuList' => $bahanBakuList,
            'selectedId'    => $selectedId ? (int) $selectedId : null,
        ]);
    }

    /**
     * Proses transaksi stok bahan baku — routing ke addStock/reduceStock berdasarkan jenis & sign qty.
     */
    public function store(TransaksiBahanBakuRequest $request)
    {
        $bahanBaku = BahanBaku::findOrFail($request->validated('bahan_baku_id'));
        $jenis     = $request->validated('jenis_transaksi');
        $qty       = (float) $request->validated('qty');
        $keterangan = $request->validated('keterangan');

        try {
            // Restock selalu tambah. Penyesuaian bisa + atau − tergantung sign qty.
            if ($jenis === 'restock' || $qty > 0) {
                $this->service->addStock(
                    bahanBaku:  $bahanBaku,
                    qty:        abs($qty),
                    jenis:      $jenis,
                    keterangan: $keterangan,
                );
            } else {
                $this->service->reduceStock(
                    bahanBaku:  $bahanBaku,
                    qty:        abs($qty),
                    jenis:      $jenis,
                    keterangan: $keterangan,
                );
            }
        } catch (\RuntimeException $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        $label = $jenis === 'restock' ? 'Restock' : 'Penyesuaian stok';

        return redirect()
            ->route('stok-bahan-baku.index')
            ->with('success', "{$label} {$bahanBaku->nama_bahan} berhasil dicatat.");
    }

    /**
     * Detail satu transaksi stok.
     */
    public function show(StokBahanBaku $stokBahanBaku)
    {
        $stokBahanBaku->load('bahanBaku');

        return Inertia::render('stok-bahan-baku/show', [
            'transaksi' => $stokBahanBaku,
        ]);
    }
}
