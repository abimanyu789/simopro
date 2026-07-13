<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BahanBakuTemplateInstructionSheet implements FromArray, WithTitle, WithColumnWidths, WithStyles
{
    public function array(): array
    {
        return [
            ['PETUNJUK PENGISIAN IMPORT BAHAN BAKU'],
            [''],
            ['KOLOM', 'WAJIB', 'KETERANGAN'],
            ['Kode Bahan', 'Ya', 'Kode unik untuk bahan baku. Maksimal 50 karakter. Pastikan belum terdaftar.'],
            ['Nama Bahan', 'Ya', 'Nama lengkap bahan baku. Maksimal 255 karakter.'],
            ['Satuan', 'Ya', 'Satuan ukur (misal: meter, pcs, kg, dll). Maksimal 50 karakter.'],
            ['Minimum Stok', 'Ya', 'Batas angka minimal stok untuk notifikasi. Harus berupa angka bulat (integer). Minimal 0.'],
            [''],
            ['CATATAN PENTING:'],
            ['1. Jangan mengubah nama kolom di baris pertama pada sheet Data.'],
            ['2. Pastikan Kode Bahan belum pernah digunakan (Insert Only).'],
            ['3. Kosongkan baris contoh jika Anda ingin mengimpor data asli.'],
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
            10 => ['font' => ['bold' => true]],
        ];
    }
}
