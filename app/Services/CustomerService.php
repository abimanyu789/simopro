<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    /**
     * Store a new Customer.
     *
     * @param array $data
     * @return Customer
     */
    public function store(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            return Customer::create([
                'nama_customer' => $data['nama_customer'],
                'jenis_customer' => $data['jenis_customer'],
                'no_hp' => $data['no_hp'] ?? null,
                'alamat' => $data['alamat'] ?? null,
            ]);
        });
    }
}
