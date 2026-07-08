<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PengirimanProdukRequest extends FormRequest
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
            'produk_id'  => ['required', 'integer', 'exists:produk,id'],
            'qty'        => ['required', 'integer', 'min:1'],
            'keterangan' => ['nullable', 'string', 'max:500'],
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
            'produk_id'  => 'produk',
            'qty'        => 'jumlah pengiriman',
            'keterangan' => 'keterangan',
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
            'produk_id.required' => 'Produk harus dipilih.',
            'produk_id.exists'   => 'Produk tidak ditemukan.',
            'qty.required'       => 'Jumlah pengiriman harus diisi.',
            'qty.integer'        => 'Jumlah pengiriman harus berupa bilangan bulat.',
            'qty.min'            => 'Jumlah pengiriman harus lebih dari 0.',
        ];
    }
}
