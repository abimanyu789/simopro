<?php

namespace App\Imports;

use App\Services\KaryawanService;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use App\Imports\Traits\WithStringNormalization;

class KaryawanImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsEmptyRows
{
    use WithStringNormalization;

    protected array $stringFields = [
        'nama_karyawan',
        'jabatan',
        'no_hp',
    ];

    // Dinormalisasi ke lowercase sebelum validasi agar "Aktif", "AKTIF" → "aktif"
    protected array $lowercaseFields = [
        'status',
    ];

    protected $service;
    protected $addedCount = 0;

    public function __construct(KaryawanService $service)
    {
        $this->service = $service;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = [
                'nama_karyawan' => $row['nama_karyawan'],
                'jabatan'       => $row['jabatan'],
                'no_hp'         => $row['no_hp'],
                'status'        => $row['status'], // sudah lowercase dari prepareForValidation
            ];

            $this->service->store($data);
            $this->addedCount++;
        }
    }

    public function rules(): array
    {
        return [
            'nama_karyawan' => ['required', 'string', 'max:255'],
            'jabatan'       => ['nullable', 'string', 'max:255'],
            'no_hp'         => ['nullable', 'string', 'max:25'],
            'status'        => ['required', 'in:aktif,nonaktif'],
        ];
    }

    public function getAddedCount(): int
    {
        return $this->addedCount;
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
