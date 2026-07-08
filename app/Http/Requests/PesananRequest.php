<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PesananRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id'      => ['required', 'integer', 'exists:customer,id'],
            'tanggal'          => ['required', 'date'],
            'diskon'           => ['nullable', 'numeric', 'min:0'],
            'tipe_diskon'      => ['nullable', 'string', 'in:persen,nominal'],
            'ongkir'           => ['nullable', 'numeric', 'min:0'],
            'keterangan'       => ['nullable', 'string', 'max:1000'],

            // Detail pesanan — minimal 1 item
            'items'            => ['required', 'array', 'min:1'],
            'items.*.produk_id' => ['required', 'integer', 'exists:produk,id'],
            'items.*.qty'      => ['required', 'integer', 'min:1'],
            'items.*.harga'    => ['required', 'numeric', 'min:0'],
        ];
    }

    public function attributes(): array
    {
        return [
            'customer_id'       => 'customer',
            'tanggal'           => 'tanggal pesanan',
            'diskon'            => 'diskon',
            'tipe_diskon'       => 'tipe diskon',
            'ongkir'            => 'ongkos kirim',
            'keterangan'        => 'keterangan',
            'items'             => 'item pesanan',
            'items.*.produk_id' => 'produk',
            'items.*.qty'       => 'jumlah',
            'items.*.harga'     => 'harga',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_id.required'       => 'Customer harus dipilih.',
            'customer_id.exists'         => 'Customer tidak ditemukan.',
            'tanggal.required'           => 'Tanggal pesanan harus diisi.',
            'items.required'             => 'Pesanan harus memiliki minimal 1 item produk.',
            'items.min'                  => 'Pesanan harus memiliki minimal 1 item produk.',
            'items.*.produk_id.required' => 'Produk harus dipilih.',
            'items.*.produk_id.exists'   => 'Produk tidak ditemukan.',
            'items.*.qty.required'       => 'Jumlah harus diisi.',
            'items.*.qty.min'            => 'Jumlah harus lebih dari 0.',
            'items.*.harga.required'     => 'Harga harus diisi.',
            'items.*.harga.min'          => 'Harga tidak boleh negatif.',
            'tipe_diskon.in'             => 'Tipe diskon harus persen atau nominal.',
            'diskon.min'                 => 'Diskon tidak boleh negatif.',
            'ongkir.min'                 => 'Ongkos kirim tidak boleh negatif.',
        ];
    }
}
