<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BomCategorieRequest extends FormRequest
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
        $rules = [
            'nama_bom'   => ['required', 'string', 'max:255'],
            'keterangan' => ['nullable', 'string'],
        ];

        // Validasi komposisi hanya saat membuat BOM baru (store)
        if ($this->isMethod('POST')) {
            $rules['details']                       = ['required', 'array', 'min:1'];
            $rules['details.*.bahan_baku_id']       = [
                'required',
                'integer',
                'exists:bahan_baku,id',
                'distinct',
            ];
            $rules['details.*.qty_per_pair']        = ['required', 'numeric', 'min:0.01'];
        }

        return $rules;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'nama_bom'                    => 'nama BOM',
            'keterangan'                  => 'keterangan',
            'details'                     => 'komposisi bahan baku',
            'details.*.bahan_baku_id'     => 'bahan baku',
            'details.*.qty_per_pair'      => 'qty per pasang',
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
            'details.required'                    => 'BOM harus memiliki minimal 1 bahan baku.',
            'details.min'                         => 'BOM harus memiliki minimal 1 bahan baku.',
            'details.*.bahan_baku_id.required'    => 'Pilih bahan baku.',
            'details.*.bahan_baku_id.distinct'    => 'Bahan baku tidak boleh duplikat dalam satu BOM.',
            'details.*.qty_per_pair.required'     => 'Qty per pasang wajib diisi.',
            'details.*.qty_per_pair.min'          => 'Qty per pasang harus lebih dari 0.',
        ];
    }
}
