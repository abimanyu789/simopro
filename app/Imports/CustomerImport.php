<?php

namespace App\Imports;

use App\Services\CustomerService;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use App\Imports\Traits\WithStringNormalization;

class CustomerImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsEmptyRows
{
    use WithStringNormalization;

    protected array $stringFields = [
        'nama_customer',
        'no_hp',
        'alamat',
    ];

    // Dinormalisasi ke lowercase sebelum validasi agar "B2B", "B2b" → "b2b"
    protected array $lowercaseFields = [
        'jenis_customer',
    ];

    protected $service;
    protected $addedCount = 0;

    public function __construct(CustomerService $service)
    {
        $this->service = $service;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = [
                'nama_customer'  => $row['nama_customer'],
                'jenis_customer' => $row['jenis_customer'], // sudah lowercase dari prepareForValidation
                'no_hp'          => $row['no_hp'],
                'alamat'         => $row['alamat'],
            ];

            $this->service->store($data);
            $this->addedCount++;
        }
    }

    public function rules(): array
    {
        return [
            'nama_customer'  => ['required', 'string', 'max:255'],
            'jenis_customer' => ['required', 'in:b2b,b2c'],
            'no_hp'          => ['nullable', 'string', 'max:25'],
            'alamat'         => ['nullable', 'string'],
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
