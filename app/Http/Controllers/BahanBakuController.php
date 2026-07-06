<?php

namespace App\Http\Controllers;

use App\Http\Requests\BahanBakuRequest;
use App\Models\BahanBaku;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BahanBakuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $bahanBakus = BahanBaku::query()
            ->when($search, function ($query, $search) {
                $query->where('kode_bahan', 'like', "%{$search}%")
                    ->orWhere('nama_bahan', 'like', "%{$search}%")
                    ->orWhere('satuan', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('bahan-baku/index', [
            'bahanBakus' => $bahanBakus,
            'filters' => [
                'search' => $search,
            ],
            'satuanOptions' => $this->getSatuanOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('bahan-baku/create', [
            'satuanOptions' => $this->getSatuanOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(BahanBakuRequest $request)
    {
        BahanBaku::create($request->validated());

        return redirect()
            ->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BahanBaku $bahanBaku)
    {
        return Inertia::render('bahan-baku/show', [
            'bahanBaku' => $bahanBaku,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BahanBaku $bahanBaku)
    {
        return Inertia::render('bahan-baku/edit', [
            'bahanBaku' => $bahanBaku,
            'satuanOptions' => $this->getSatuanOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BahanBakuRequest $request, BahanBaku $bahanBaku)
    {
        $bahanBaku->update($request->validated());

        return redirect()
            ->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BahanBaku $bahanBaku)
    {
        // TODO: Check if bahan baku is used in BOM (will be implemented in Module 5)
        // For now, allow deletion

        $bahanBaku->delete();

        return redirect()
            ->route('bahan-baku.index')
            ->with('success', 'Bahan baku berhasil dihapus.');
    }

    /**
     * Get satuan options for dropdown.
     */
    private function getSatuanOptions(): array
    {
        return [
            ['value' => 'meter', 'label' => 'Meter (m)'],
            ['value' => 'pasang', 'label' => 'Pasang'],
            ['value' => 'buah', 'label' => 'Buah (pcs)'],
            ['value' => 'kilogram', 'label' => 'Kilogram (kg)'],
            ['value' => 'lembar', 'label' => 'Lembar'],
        ];
    }
}
