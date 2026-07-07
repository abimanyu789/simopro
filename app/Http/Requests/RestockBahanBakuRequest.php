<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RestockBahanBakuRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bahan_baku_id' => ['required', 'integer', 'exists:bahan_baku,id'],
            'qty'           => ['required', 'numeric', 'min:0.01'],
            'keterangan'    => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'bahan_baku_id' => 'bahan baku',
            'qty'           => 'jumlah restock',
            'keterangan'    => 'keterangan',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'bahan_baku_id.required' => 'Bahan baku harus dipilih.',
            'bahan_baku_id.exists'   => 'Bahan baku tidak ditemukan.',
            'qty.required'           => 'Jumlah restock harus diisi.',
            'qty.min'                => 'Jumlah restock harus lebih dari 0.',
        ];
    }
}
