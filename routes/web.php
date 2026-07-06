<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\BomCategorieController;
use App\Http\Controllers\BomDetailController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProdukController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data - Bahan Baku
    Route::resource('bahan-baku', BahanBakuController::class);

    // Master Data - Produk
    Route::resource('produk', ProdukController::class);

    // BOM Category
    Route::resource('bom-categorie', BomCategorieController::class);

    // BOM Detail (inline operations — no separate pages)
    Route::post(
        'bom-categorie/{bom_categorie}/bom-detail',
        [BomDetailController::class, 'store']
    )->name('bom-detail.store');

    Route::put(
        'bom-detail/{bom_detail}',
        [BomDetailController::class, 'update']
    )->name('bom-detail.update');

    Route::delete(
        'bom-detail/{bom_detail}',
        [BomDetailController::class, 'destroy']
    )->name('bom-detail.destroy');
});

require __DIR__.'/settings.php';
