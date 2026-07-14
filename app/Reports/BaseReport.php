<?php

namespace App\Reports;

use App\Reports\Contracts\ReportInterface;
use Illuminate\Support\Collection;

abstract class BaseReport implements ReportInterface
{
    /**
     * Ambil 20 baris pertama dari data export sebagai preview.
     */
    public function preview(array $filters): array
    {
        return $this->export($filters)->take(20)->values()->all();
    }

    /**
     * Hitung total baris (default: hitung dari export full).
     * Override di subclass jika ada query COUNT yang lebih efisien.
     */
    public function count(array $filters): int
    {
        return $this->export($filters)->count();
    }

    /**
     * Default summary kosong — override di subclass yang relevan.
     */
    public function summary(array $filters): array
    {
        return [];
    }

    /**
     * Helper: parse tanggal dari filters dengan fallback aman.
     */
    protected function parseDateFilters(array $filters): array
    {
        $dari   = $filters['dari']   ?? null;
        $sampai = $filters['sampai'] ?? null;

        // Validasi format YYYY-MM-DD sederhana
        if ($dari && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dari)) {
            $dari = null;
        }
        if ($sampai && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $sampai)) {
            $sampai = null;
        }

        return [$dari, $sampai];
    }

    /**
     * Helper: format angka ke rupiah untuk array summary.
     */
    protected function formatRupiah(float|int $value): string
    {
        return 'Rp ' . number_format($value, 0, ',', '.');
    }
}
