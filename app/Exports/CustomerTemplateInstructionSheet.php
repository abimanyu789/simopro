<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class CustomerTemplateInstructionSheet implements FromArray, WithTitle, WithColumnWidths, WithStyles
{
    public function array(): array
    {
        return [
            ['PETUNJUK PENGISIAN IMPORT CUSTOMER'],
            [''],
            ['KOLOM', 'WAJIB', 'KETERANGAN'],
            ['Nama Customer', 'Ya', 'Nama perusahaan atau pelanggan. Maksimal 255 karakter.'],
            ['Jenis Customer', 'Ya', 'Pilih b2b atau b2c dari dropdown.'],
            ['No HP', 'Tidak', 'Nomor telepon yang dapat dihubungi. Maksimal 25 karakter.'],
            ['Alamat', 'Tidak', 'Alamat lengkap pelanggan.'],
            [''],
            ['CATATAN PENTING:'],
            ['1. Jangan mengubah nama kolom di baris pertama pada sheet Data.'],
            ['2. Kosongkan baris contoh jika Anda ingin mengimpor data asli.'],
            ['3. Apabila terdapat 1 baris yang gagal, seluruh proses import akan dibatalkan (Rollback).']
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
            9 => ['font' => ['bold' => true]],
        ];
    }
}
