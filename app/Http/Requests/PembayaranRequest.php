<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PembayaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal'          => ['required', 'date'],
            'jenis_pembayaran' => ['required', 'string', 'in:dp,pelunasan,termin'],
            'nominal'          => ['required', 'numeric', 'min:0.01'],
            'metode'           => ['nullable', 'string', 'max:100'],
            'keterangan'       => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function attributes(): array
    {
        return [
            'tanggal'          => 'tanggal pembayaran',
            'jenis_pembayaran' => 'jenis pembayaran',
            'nominal'          => 'nominal',
            'metode'           => 'metode pembayaran',
            'keterangan'       => 'keterangan',
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal.required'          => 'Tanggal pembayaran harus diisi.',
            'jenis_pembayaran.required' => 'Jenis pembayaran harus dipilih.',
            'jenis_pembayaran.in'       => 'Jenis pembayaran tidak valid.',
            'nominal.required'          => 'Nominal harus diisi.',
            'nominal.min'               => 'Nominal harus lebih dari 0.',
        ];
    }
}
