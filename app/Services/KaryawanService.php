<?php

namespace App\Services;

use App\Models\Karyawan;
use Illuminate\Support\Facades\DB;

class KaryawanService
{
    /**
     * Store a new Karyawan.
     *
     * @param array $data
     * @return Karyawan
     */
    public function store(array $data): Karyawan
    {
        return DB::transaction(function () use ($data) {
            return Karyawan::create([
                'nama_karyawan' => $data['nama_karyawan'],
                'jabatan' => $data['jabatan'] ?? null,
                'no_hp' => $data['no_hp'] ?? null,
                'status' => $data['status'],
            ]);
        });
    }
}
