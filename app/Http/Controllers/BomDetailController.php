<?php

namespace App\Http\Controllers;

use App\Http\Requests\BomDetailRequest;
use App\Models\BomCategorie;
use App\Models\BomDetail;

class BomDetailController extends Controller
{
    /**
     * Store a newly created detail in storage.
     */
    public function store(BomDetailRequest $request, BomCategorie $bomCategorie)
    {
        $bomCategorie->bomDetails()->create($request->validated());

        return redirect()
            ->route('bom-categorie.show', $bomCategorie->id)
            ->with('success', 'Bahan baku berhasil ditambahkan ke BOM.');
    }

    /**
     * Update the specified detail in storage.
     */
    public function update(BomDetailRequest $request, BomDetail $bomDetail)
    {
        $bomDetail->update($request->validated());

        return redirect()
            ->route('bom-categorie.show', $bomDetail->bom_category_id)
            ->with('success', 'Qty berhasil diperbarui.');
    }

    /**
     * Remove the specified detail from storage.
     */
    public function destroy(BomDetail $bomDetail)
    {
        $bomCategoryId = $bomDetail->bom_category_id;
        $bomDetail->delete();

        return redirect()
            ->route('bom-categorie.show', $bomCategoryId)
            ->with('success', 'Bahan baku berhasil dihapus dari BOM.');
    }
}
