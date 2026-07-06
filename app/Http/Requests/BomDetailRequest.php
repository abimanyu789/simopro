<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BomDetailRequest extends FormRequest
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
            'qty_per_pair' => ['required', 'numeric', 'min:0.01'],
        ];

        // Validasi bahan_baku_id + uniqueness hanya saat menambah (store)
        if ($this->isMethod('POST')) {
            $bomCategorie = $this->route('bom_categorie');
            $bomCategorieId = $bomCategorie instanceof \App\Models\BomCategorie
                ? $bomCategorie->id
                : $bomCategorie;

            $rules['bahan_baku_id'] = [
                'required',
                'integer',
                'exists:bahan_baku,id',
                Rule::unique('bom_detail', 'bahan_baku_id')
                    ->where('bom_category_id', $bomCategorieId),
            ];
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
            'bahan_baku_id' => 'bahan baku',
            'qty_per_pair'  => 'qty per pasang',
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
            'bahan_baku_id.unique'    => 'Bahan baku ini sudah ada dalam BOM.',
            'qty_per_pair.min'        => 'Qty per pasang harus lebih dari 0.',
            'qty_per_pair.required'   => 'Qty per pasang wajib diisi.',
        ];
    }
}
