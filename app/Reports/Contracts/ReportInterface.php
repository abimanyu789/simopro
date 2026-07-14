<?php

namespace App\Reports\Contracts;

use Illuminate\Support\Collection;

interface ReportInterface
{
    /** Maksimal 20 baris untuk preview tabel di modal */
    public function preview(array $filters): array;

    /** Semua baris untuk export PDF/Excel */
    public function export(array $filters): Collection;

    /** Hitung total baris (untuk info pagination preview) */
    public function count(array $filters): int;

    /** Summary cards — key/value bebas sesuai jenis laporan */
    public function summary(array $filters): array;

    /** Kolom heading untuk tabel Excel & preview */
    public function headings(): array;

    /** Judul laporan (dipakai di PDF header & modal title) */
    public function title(): string;

    /** Nama blade view untuk PDF, relatif ke resources/views */
    public function bladeView(): string;

    /** Nama file saat download (tanpa ekstensi) */
    public function filename(): string;
}
