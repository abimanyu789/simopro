<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Collection;
use App\Imports\Traits\WithStringNormalization;

use Illuminate\Support\Facades\DB;

// Create a dummy Excel file using PhpSpreadsheet
$spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle('Data');
$sheet->setCellValue('A1', 'Kode Produk');
$sheet->setCellValue('B1', 'Nama Produk');
$sheet->setCellValue('C1', 'Ukuran');
$sheet->setCellValue('D1', 'Warna');
$sheet->setCellValue('E1', 'Harga Jual');
$sheet->setCellValue('F1', 'Minimum Stok');

for ($i = 2; $i <= 15; $i++) {
    $sheet->setCellValue('A' . $i, 'PRV-00' . $i);
    $sheet->setCellValue('B' . $i, 'Sepatu ' . $i);
    $sheet->setCellValue('C' . $i, 38);
    $sheet->setCellValue('D' . $i, 'Hitam');
    $sheet->setCellValue('E' . $i, 150000);
    $sheet->setCellValue('F' . $i, 10);
}

$writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
$writer->save('test_import_user.xlsx');

$service = app(\App\Services\ProdukService::class);
$import = new \App\Imports\ProdukImport($service);

try {
    Excel::import($import, 'test_import_user.xlsx');
    echo "Import success\n";
} catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
    echo "Validation failed:\n";
    foreach ($e->failures() as $failure) {
        var_dump("Row " . $failure->row());
        var_dump("Errors:", $failure->errors());
        var_dump("Values:", $failure->values());
        break;
    }
} catch (\Exception $e) {
    echo "Other Exception: " . $e->getMessage() . "\n";
}
