<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusPesananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:pending,proses,selesai,dibatalkan'],
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => 'status pesanan',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status pesanan harus dipilih.',
            'status.in'       => 'Status pesanan tidak valid.',
        ];
    }
}
