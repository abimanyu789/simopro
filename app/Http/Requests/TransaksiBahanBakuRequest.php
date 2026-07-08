<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransaksiBahanBakuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bahan_baku_id'   => ['required', 'integer', 'exists:bahan_baku,id'],
            'jenis_transaksi' => ['required', 'string', 'in:restock,penyesuaian'],
            'qty'             => ['required', 'numeric', 'not_in:0'],
            'keterangan'      => ['nullable', 'string', 'max:500',
                // Keterangan wajib untuk penyesuaian
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
            'bahan_baku_id'   => 'bahan baku',
            'jenis_transaksi' => 'jenis transaksi',
            'qty'             => 'jumlah',
            'keterangan'      => 'keterangan',
        ];
    }

    public function messages(): array
    {
        return [
            'bahan_baku_id.required' => 'Bahan baku harus dipilih.',
            'bahan_baku_id.exists'   => 'Bahan baku tidak ditemukan.',
            'jenis_transaksi.required' => 'Jenis transaksi harus dipilih.',
            'jenis_transaksi.in'     => 'Jenis transaksi tidak valid.',
            'qty.required'           => 'Jumlah harus diisi.',
            'qty.not_in'             => 'Jumlah tidak boleh nol.',
        ];
    }
}
