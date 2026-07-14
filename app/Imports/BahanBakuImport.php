<?php

namespace App\Imports;

use App\Models\BahanBaku;
use App\Services\BahanBakuService;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Validation\Rule;
use App\Imports\Traits\WithStringNormalization;

class BahanBakuImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsEmptyRows
{
    use WithStringNormalization;

    protected array $stringFields = [
        'kode_bahan',
        'nama_bahan',
    ];

    // Dinormalisasi ke lowercase sebelum validasi agar "Meter", "METER" → "meter"
    protected array $lowercaseFields = [
        'satuan',
    ];

    protected $bahanBakuService;

    public function __construct(BahanBakuService $bahanBakuService)
    {
        $this->bahanBakuService = $bahanBakuService;
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = [
                'kode_bahan'   => $row['kode_bahan'],
                'nama_bahan'   => $row['nama_bahan'],
                'satuan'       => $row['satuan'],
                'minimum_stok' => $row['minimum_stok'],
            ];

            $this->bahanBakuService->store($data);
        }
    }

    public function rules(): array
    {
        return [
            'kode_bahan'   => ['required', 'string', 'max:50', Rule::unique('bahan_baku', 'kode_bahan')],
            'nama_bahan'   => ['required', 'string', 'max:255'],
            'satuan'       => ['required', 'string', Rule::in(BahanBaku::SATUAN_OPTIONS)],
            'minimum_stok' => ['required', 'integer', 'min:0'],
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
