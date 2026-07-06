<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data - Bahan Baku
    Route::resource('bahan-baku', BahanBakuController::class);

    // Master Data - Produk
    Route::resource('produk', ProdukController::class);
});

require __DIR__.'/settings.php';
