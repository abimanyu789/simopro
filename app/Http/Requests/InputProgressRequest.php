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
            'produk_id' => ['required', 'integer', 'exists:produk,id'],
            'qty'       => ['required', 'integer', 'min:1'],
            'qc_status' => ['required', 'string', 'in:lolos,tidak_lolos'],
        ];
    }

    public function attributes(): array
    {
        return [
            'produk_id' => 'produk',
            'qty'       => 'jumlah progress',
            'qc_status' => 'status QC',
        ];
    }

    public function messages(): array
    {
        return [
            'produk_id.required' => 'Produk harus dipilih.',
            'produk_id.exists'   => 'Produk tidak ditemukan.',
            'qty.required'       => 'Jumlah progress harus diisi.',
            'qty.min'            => 'Jumlah progress harus lebih dari 0.',
            'qc_status.required' => 'Status QC harus dipilih.',
            'qc_status.in'       => 'Status QC tidak valid.',
        ];
    }
}
