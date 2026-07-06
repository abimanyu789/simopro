<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProdukRequest extends FormRequest
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
        $produkId = $this->route('produk');

        return [
            'kode_produk' => [
                'required',
                'string',
                'max:50',
                Rule::unique('produk', 'kode_produk')->ignore($produkId),
            ],
            'nama_produk' => ['required', 'string', 'max:255'],
            'ukuran' => ['nullable', 'string', 'max:30'],
            'warna' => ['nullable', 'string', 'max:50'],
            'harga_jual' => ['nullable', 'numeric', 'min:0'],
            'stok' => ['required', 'integer', 'min:0'],
            'minimum_stok' => ['nullable', 'integer', 'min:0'],
            'bom_category_id' => ['nullable', 'integer', 'exists:bom_categorie,id'],
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
            'kode_produk' => 'kode produk',
            'nama_produk' => 'nama produk',
            'ukuran' => 'ukuran',
            'warna' => 'warna',
            'harga_jual' => 'harga jual',
            'stok' => 'stok',
            'minimum_stok' => 'minimum stok',
            'bom_category_id' => 'BOM',
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
            'kode_produk.unique' => 'Kode produk sudah digunakan.',
            'harga_jual.min' => 'Harga jual tidak boleh kurang dari 0.',
            'stok.min' => 'Stok tidak boleh kurang dari 0.',
            'minimum_stok.min' => 'Minimum stok tidak boleh kurang dari 0.',
        ];
    }
}
