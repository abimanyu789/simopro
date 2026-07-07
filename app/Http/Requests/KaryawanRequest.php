<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KaryawanRequest extends FormRequest
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
        return [
            'nama_karyawan' => ['required', 'string', 'max:255'],
            'jabatan'       => ['nullable', 'string', 'max:100'],
            'no_hp'         => ['nullable', 'string', 'max:25'],
            'status'        => ['required', 'in:aktif,nonaktif'],
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
            'nama_karyawan' => 'nama karyawan',
            'jabatan'       => 'jabatan',
            'no_hp'         => 'nomor HP',
            'status'        => 'status',
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
            'nama_karyawan.required' => 'Nama karyawan wajib diisi.',
            'nama_karyawan.max'      => 'Nama karyawan tidak boleh lebih dari 255 karakter.',
            'jabatan.max'            => 'Jabatan tidak boleh lebih dari 100 karakter.',
            'no_hp.max'              => 'Nomor HP tidak boleh lebih dari 25 karakter.',
            'status.required'        => 'Status karyawan wajib dipilih.',
            'status.in'              => 'Status karyawan harus Aktif atau Nonaktif.',
        ];
    }
}
