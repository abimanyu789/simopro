<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArusKasRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal'           => ['required', 'date'],
            'jenis'             => ['required', 'string', 'in:pemasukan,pengeluaran'],
            'kategori'          => ['nullable', 'string', 'max:100'],
            'nominal'           => ['required', 'numeric', 'min:0.01'],
            'metode_pembayaran' => ['nullable', 'string', 'max:100'],
            'keterangan'        => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'tanggal'           => 'tanggal',
            'jenis'             => 'jenis transaksi',
            'kategori'          => 'kategori',
            'nominal'           => 'nominal',
            'metode_pembayaran' => 'metode pembayaran',
            'keterangan'        => 'keterangan',
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal.required' => 'Tanggal harus diisi.',
            'jenis.required'   => 'Jenis transaksi harus dipilih.',
            'jenis.in'         => 'Jenis transaksi tidak valid.',
            'nominal.required' => 'Nominal harus diisi.',
            'nominal.min'      => 'Nominal harus lebih dari 0.',
        ];
    }
}
