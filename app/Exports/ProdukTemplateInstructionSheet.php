<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProdukTemplateInstructionSheet implements FromArray, WithTitle, WithColumnWidths, WithStyles
{
    public function array(): array
    {
        return [
            ['PETUNJUK PENGISIAN IMPORT PRODUK'],
            [''],
            ['KOLOM', 'WAJIB', 'KETERANGAN'],
            ['Kode Produk', 'Ya', 'Kode unik produk. Maksimal 50 karakter.'],
            ['Nama Produk', 'Ya', 'Nama lengkap produk. Maksimal 255 karakter.'],
            ['Ukuran', 'Tidak', 'Ukuran produk (opsional). Maksimal 30 karakter.'],
            ['Warna', 'Tidak', 'Warna produk (opsional). Maksimal 50 karakter.'],
            ['Harga Jual', 'Tidak', 'Harga jual produk. Harus berupa angka desimal atau bulat.'],
            ['Minimum Stok', 'Tidak', 'Angka batas minimal stok produk.'],
            [''],
            ['CATATAN PENTING:'],
            ['1. Jangan mengubah nama kolom di baris pertama pada sheet Data.'],
            ['2. Kosongkan baris contoh jika Anda ingin mengimpor data asli.'],
            ['3. Data Stok dan BOM tidak disertakan dalam import ini. Pengaturan BOM dilakukan secara manual dari aplikasi.'],
            ['4. Apabila terdapat 1 baris yang gagal, seluruh proses import akan dibatalkan (Rollback).']
        ];
    }

    public function title(): string
    {
        return 'Instructions';
    }

    public function columnWidths(): array
    {
        return [
            'A' => 25,
            'B' => 10,
            'C' => 100,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]],
            3 => ['font' => ['bold' => true]],
            11 => ['font' => ['bold' => true]],
        ];
    }
}
