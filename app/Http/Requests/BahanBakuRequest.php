<?php

namespace App\Http\Requests;

use App\Models\BahanBaku;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BahanBakuRequest extends FormRequest
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
        $bahanBakuId = $this->route('bahan_baku');

        return [
            'kode_bahan' => [
                'required',
                'string',
                'max:50',
                Rule::unique('bahan_baku', 'kode_bahan')->ignore($bahanBakuId),
            ],
            'nama_bahan' => ['required', 'string', 'max:255'],
            'satuan'     => ['required', 'string', Rule::in(BahanBaku::SATUAN_OPTIONS)],
            'stok'       => ['required', 'numeric', 'min:0'],
            'minimum_stok' => ['nullable', 'numeric', 'min:0'],
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
            'kode_bahan'   => 'kode bahan baku',
            'nama_bahan'   => 'nama bahan baku',
            'satuan'       => 'satuan',
            'stok'         => 'stok',
            'minimum_stok' => 'minimum stok',
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
            'kode_bahan.unique' => 'Kode bahan baku sudah digunakan.',
            'satuan.in'         => 'Satuan harus salah satu dari: ' . implode(', ', BahanBaku::SATUAN_OPTIONS) . '.',
            'stok.min'          => 'Stok tidak boleh kurang dari 0.',
            'minimum_stok.min'  => 'Minimum stok tidak boleh kurang dari 0.',
        ];
    }
}
