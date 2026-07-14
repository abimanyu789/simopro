<?php

namespace App\Imports;

use App\Services\ProdukService;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Validation\Rule;
use App\Imports\Traits\WithStringNormalization;

class ProdukImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, SkipsEmptyRows
{
    use WithStringNormalization;

    protected array $stringFields = [
        'kode_produk',
        'nama_produk',
        'ukuran',
        'warna',
    ];

    protected $service;
    protected $addedCount = 0;

    public function __construct(ProdukService $service)
    {
        $this->service = $service;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = [
                'kode_produk'  => $row['kode_produk'],
                'nama_produk'  => $row['nama_produk'],
                'ukuran'       => $row['ukuran'],
                'warna'        => $row['warna'],
                'harga_jual'   => $row['harga_jual'],
                'minimum_stok' => $row['minimum_stok'],
            ];

            $this->service->store($data);
            $this->addedCount++;
        }
    }

    public function rules(): array
    {
        return [
            'kode_produk'  => ['required', 'string', 'max:50', Rule::unique('produk', 'kode_produk')],
            'nama_produk'  => ['required', 'string', 'max:255'],
            'ukuran'       => ['nullable', 'string', 'max:30'],
            'warna'        => ['nullable', 'string', 'max:50'],
            'harga_jual'   => ['nullable', 'numeric', 'min:0'],
            'minimum_stok' => ['nullable', 'integer', 'min:0'],
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
