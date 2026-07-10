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
        $jenis = $this->input('jenis_produksi', 'pesanan');

        $rules = [
            'jenis_produksi' => ['required', 'string', 'in:pesanan,restok'],
            'deadline'       => ['nullable', 'date', 'after_or_equal:today'],
            'catatan'        => ['nullable', 'string', 'max:1000'],
            'karyawan_ids'   => ['nullable', 'array'],
            'karyawan_ids.*' => ['integer', 'exists:karyawan,id'],
        ];

        if ($jenis === 'pesanan') {
            $rules['pesanan_id'] = ['required', 'integer', 'exists:pesanan,id'];
        } else {
            // restok: admin input produk + qty manual
            $rules['items']              = ['required', 'array', 'min:1'];
            $rules['items.*.produk_id']  = ['required', 'integer', 'exists:produk,id'];
            $rules['items.*.qty_target'] = ['required', 'integer', 'min:1'];
        }

        return $rules;
    }

    public function attributes(): array
    {
        return [
            'jenis_produksi'      => 'jenis produksi',
            'pesanan_id'          => 'pesanan',
            'deadline'            => 'deadline',
            'catatan'             => 'catatan',
            'karyawan_ids'        => 'karyawan',
            'items'               => 'item produk',
            'items.*.produk_id'   => 'produk',
            'items.*.qty_target'  => 'target qty',
        ];
    }

    public function messages(): array
    {
        return [
            'jenis_produksi.required' => 'Jenis produksi harus dipilih.',
            'jenis_produksi.in'       => 'Jenis produksi tidak valid.',
            'pesanan_id.required'     => 'Pesanan harus dipilih.',
            'pesanan_id.exists'       => 'Pesanan tidak ditemukan.',
            'items.required'          => 'Produk harus dipilih minimal 1.',
            'items.min'               => 'Produk harus dipilih minimal 1.',
            'items.*.produk_id.required' => 'Produk harus dipilih.',
            'items.*.qty_target.min'     => 'Target qty harus lebih dari 0.',
            'deadline.after_or_equal'    => 'Deadline tidak boleh sebelum hari ini.',
        ];
    }
}
