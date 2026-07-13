<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class KaryawanTemplateInstructionSheet implements FromArray, WithTitle, WithColumnWidths, WithStyles
{
    public function array(): array
    {
        return [
            ['PETUNJUK PENGISIAN IMPORT KARYAWAN'],
            [''],
            ['KOLOM', 'WAJIB', 'KETERANGAN'],
            ['Nama Karyawan', 'Ya', 'Nama lengkap karyawan. Maksimal 255 karakter.'],
            ['Jabatan', 'Tidak', 'Posisi atau jabatan karyawan.'],
            ['No HP', 'Tidak', 'Nomor telepon karyawan. Maksimal 25 karakter.'],
            ['Status', 'Ya', 'Pilih aktif atau nonaktif dari dropdown.'],
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
