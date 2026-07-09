<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\BomCategorieController;
use App\Http\Controllers\BomDetailController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KaryawanController;
use App\Http\Controllers\PesananController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProduksiController;
use App\Http\Controllers\StokBahanBakuController;
use App\Http\Controllers\StokProdukJadiController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data - Bahan Baku
    Route::resource('bahan-baku', BahanBakuController::class);

    // Master Data - Produk
    Route::resource('produk', ProdukController::class);

    // Master Data - Karyawan
    Route::resource('karyawan', KaryawanController::class);

    // Master Data - Customer
    Route::resource('customer', CustomerController::class);

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

    // Inventory - Stok Bahan Baku
    Route::resource('stok-bahan-baku', StokBahanBakuController::class)
        ->only(['index', 'create', 'store', 'show']);

    // Inventory - Stok Produk Jadi
    Route::resource('stok-produk-jadi', StokProdukJadiController::class)
        ->only(['index', 'create', 'store', 'show']);

    // Pesanan
    Route::resource('pesanan', PesananController::class);
    Route::patch('pesanan/{pesanan}/status', [PesananController::class, 'updateStatus'])
        ->name('pesanan.update-status');
    Route::get('pesanan/{pesanan}/invoice', [PesananController::class, 'invoice'])
        ->name('pesanan.invoice');

    // Produksi
    Route::resource('produksi', ProduksiController::class)
        ->only(['index', 'create', 'store', 'show']);
    Route::patch('produksi/{produksi}/mulai', [ProduksiController::class, 'mulai'])
        ->name('produksi.mulai');
    Route::patch('produksi/{produksi}/batalkan', [ProduksiController::class, 'batalkan'])
        ->name('produksi.batalkan');
    Route::patch('produksi/{produksi}/progress', [ProduksiController::class, 'progress'])
        ->name('produksi.progress');
    Route::patch('produksi/{produksi}/selesai', [ProduksiController::class, 'selesai'])
        ->name('produksi.selesai');
});

require __DIR__.'/settings.php';
