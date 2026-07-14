<?php

namespace App\Reports;

use App\Models\Karyawan;
use Illuminate\Support\Collection;

class KaryawanReport extends BaseReport
{
    public function title(): string
    {
        return 'Laporan Data Karyawan';
    }

    public function filename(): string
    {
        return 'laporan-karyawan';
    }

    public function bladeView(): string
    {
        return 'reports.karyawan';
    }

    public function headings(): array
    {
        return [
            'Nama Karyawan',
            'Jabatan',
            'No. HP',
            'Status',
            'Total Produksi',
        ];
    }

    public function export(array $filters): Collection
    {
        return Karyawan::withCount('produksis')
            ->orderBy('nama_karyawan')
            ->get()
            ->map(fn (Karyawan $k) => [
                'nama_karyawan'  => $k->nama_karyawan,
                'jabatan'        => $k->jabatan ?? '-',
                'no_hp'          => $k->no_hp ?? '-',
                'status'         => $k->status,
                'total_produksi' => $k->produksis_count,
            ]);
    }

    public function summary(array $filters): array
    {
        $total  = Karyawan::count();
        $aktif  = Karyawan::where('status', 'aktif')->count();
        $nonAktif = $total - $aktif;

        return [
            ['label' => 'Total Karyawan', 'value' => $total,    'color' => 'blue'],
            ['label' => 'Aktif',          'value' => $aktif,    'color' => 'emerald'],
            ['label' => 'Non-Aktif',      'value' => $nonAktif, 'color' => 'gray'],
        ];
    }
}
