<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$import = new \App\Imports\ProdukImport(app(\App\Services\ProdukService::class));

$data = [
    'kode_produk' => 123,
    'nama_produk' => 'Sepatu',
    'ukuran' => 40,
    'warna' => 'Hitam',
];

$result = $import->prepareForValidation($data, 1);
var_dump($result);
