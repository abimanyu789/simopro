<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProdukRequest;
use App\Models\BomCategorie;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search     = $request->input('search');
        $stokRendah = $request->boolean('stok_rendah');
        $bom        = $request->input('bom'); // 'ada' | 'tidak'

        $produks = Produk::query()
            ->when($search, function ($query, $search) {
                $query->where('kode_produk', 'like', "%{$search}%")
                    ->orWhere('nama_produk', 'like', "%{$search}%")
                    ->orWhere('warna', 'like', "%{$search}%");
            })
            ->when($stokRendah, function ($query) {
                $query->whereNotNull('minimum_stok')
                    ->whereColumn('stok', '<=', 'minimum_stok');
            })
            ->when($bom === 'ada', function ($query) {
                $query->whereNotNull('bom_category_id');
            })
            ->when($bom === 'tidak', function ($query) {
                $query->whereNull('bom_category_id');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('produk/index', [
            'produks' => $produks,
            'filters' => [
                'search'     => $search,
                'stok_rendah' => $stokRendah,
                'bom'        => $bom,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $bomCategories = BomCategorie::select('id', 'nama_bom')
            ->orderBy('nama_bom')
            ->get();

        return Inertia::render('produk/create', [
            'bomCategories' => $bomCategories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProdukRequest $request)
    {
        Produk::create($request->validated());

        return redirect()
            ->route('produk.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Produk $produk)
    {
        return Inertia::render('produk/show', [
            'produk' => $produk,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Produk $produk)
    {
        $bomCategories = BomCategorie::select('id', 'nama_bom')
            ->orderBy('nama_bom')
            ->get();

        return Inertia::render('produk/edit', [
            'produk'        => $produk,
            'bomCategories' => $bomCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProdukRequest $request, Produk $produk)
    {
        $produk->update($request->validated());

        return redirect()
            ->route('produk.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produk $produk)
    {
        // Validasi relasi dengan tabel detail_pesanan akan diterapkan setelah Modul 8
        // (Pesanan) selesai diimplementasi. Proteksi di level database sudah akan ada
        // melalui FK onDelete('restrict') yang ditambahkan bersama migration detail_pesanan
        // pada modul tersebut.

        $produk->delete();

        return redirect()
            ->route('produk.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
