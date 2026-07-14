<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class TransaksiBahanBakuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jenis_transaksi'           => ['required', 'string', 'in:restock,penyesuaian'],
            'items'                     => ['required', 'array', 'min:1'],
            'items.*.bahan_baku_id'     => ['required', 'integer', 'exists:bahan_baku,id'],
            'items.*.qty'               => ['required', 'numeric', 'not_in:0'],
            'items.*.keterangan'        => ['nullable', 'string', 'max:500'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            if ($this->input('jenis_transaksi') !== 'penyesuaian') {
                return;
            }
            $items = $this->input('items', []);
            foreach ($items as $i => $item) {
                if (empty(trim($item['keterangan'] ?? ''))) {
                    $v->errors()->add(
                        "items.{$i}.keterangan",
                        'Keterangan wajib diisi untuk transaksi penyesuaian.'
                    );
                }
            }
        });
    }

    public function attributes(): array
    {
        $attrs = [
            'jenis_transaksi' => 'jenis transaksi',
            'items'           => 'daftar item',
        ];

        $items = $this->input('items', []);
        foreach (array_keys($items) as $i) {
            $attrs["items.{$i}.bahan_baku_id"] = 'bahan baku baris ' . ($i + 1);
            $attrs["items.{$i}.qty"]           = 'jumlah baris ' . ($i + 1);
            $attrs["items.{$i}.keterangan"]    = 'keterangan baris ' . ($i + 1);
        }

        return $attrs;
    }

    public function messages(): array
    {
        return [
            'jenis_transaksi.required'          => 'Jenis transaksi harus dipilih.',
            'jenis_transaksi.in'                => 'Jenis transaksi tidak valid.',
            'items.required'                    => 'Minimal satu item harus ditambahkan.',
            'items.min'                         => 'Minimal satu item harus ditambahkan.',
            'items.*.bahan_baku_id.required'    => 'Bahan baku harus dipilih.',
            'items.*.bahan_baku_id.exists'      => 'Bahan baku tidak ditemukan.',
            'items.*.qty.required'              => 'Jumlah harus diisi.',
            'items.*.qty.not_in'                => 'Jumlah tidak boleh nol.',
        ];
    }
}
