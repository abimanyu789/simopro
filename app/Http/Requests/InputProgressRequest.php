<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InputProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'produk_id'   => ['required', 'integer', 'exists:produk,id'],
            'karyawan_id' => ['required', 'integer', 'exists:karyawan,id'],
            'qty'         => ['required', 'integer', 'min:1'],
            'qc_lolos'    => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'produk_id'   => 'produk',
            'karyawan_id' => 'karyawan',
            'qty'         => 'jumlah progress',
            'qc_lolos'    => 'hasil QC',
        ];
    }

    public function messages(): array
    {
        return [
            'produk_id.required'   => 'Produk harus dipilih.',
            'produk_id.exists'     => 'Produk tidak ditemukan.',
            'karyawan_id.required' => 'Karyawan harus dipilih.',
            'karyawan_id.exists'   => 'Karyawan tidak ditemukan.',
            'qty.required'         => 'Jumlah progress harus diisi.',
            'qty.min'              => 'Jumlah progress harus lebih dari 0.',
            'qc_lolos.required'    => 'Hasil QC harus dipilih.',
        ];
    }
}
