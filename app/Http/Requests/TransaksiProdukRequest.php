<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransaksiProdukRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'produk_id'       => ['required', 'integer', 'exists:produk,id'],
            'jenis_transaksi' => ['required', 'string', 'in:pengiriman,penyesuaian'],
            'qty'             => ['required', 'integer', 'not_in:0'],
            'keterangan'      => ['nullable', 'string', 'max:500',
                function ($attribute, $value, $fail) {
                    if ($this->input('jenis_transaksi') === 'penyesuaian' && empty(trim($value ?? ''))) {
                        $fail('Keterangan wajib diisi untuk transaksi penyesuaian.');
                    }
                },
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'produk_id'       => 'produk',
            'jenis_transaksi' => 'jenis transaksi',
            'qty'             => 'jumlah',
            'keterangan'      => 'keterangan',
        ];
    }

    public function messages(): array
    {
        return [
            'produk_id.required'       => 'Produk harus dipilih.',
            'produk_id.exists'         => 'Produk tidak ditemukan.',
            'jenis_transaksi.required' => 'Jenis transaksi harus dipilih.',
            'jenis_transaksi.in'       => 'Jenis transaksi tidak valid.',
            'qty.required'             => 'Jumlah harus diisi.',
            'qty.not_in'               => 'Jumlah tidak boleh nol.',
        ];
    }
}
