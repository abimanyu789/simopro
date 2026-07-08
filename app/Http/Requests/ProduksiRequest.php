<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProduksiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pesanan_id' => ['required', 'integer', 'exists:pesanan,id'],
            'deadline'   => ['nullable', 'date', 'after_or_equal:today'],
            'catatan'    => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'pesanan_id' => 'pesanan',
            'deadline'   => 'deadline',
            'catatan'    => 'catatan',
        ];
    }

    public function messages(): array
    {
        return [
            'pesanan_id.required' => 'Pesanan harus dipilih.',
            'pesanan_id.exists'   => 'Pesanan tidak ditemukan.',
            'deadline.date'       => 'Format deadline tidak valid.',
            'deadline.after_or_equal' => 'Deadline tidak boleh sebelum hari ini.',
        ];
    }
}
