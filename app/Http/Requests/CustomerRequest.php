<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
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
        $customerId = $this->route('customer');

        return [
            'nama_customer' => ['required', 'string', 'max:255'],
            'jenis_customer' => ['required', 'in:b2b,b2c'],
            'no_hp' => [
                'nullable',
                'string',
                'max:25',
                Rule::unique('customer', 'no_hp')->ignore($customerId),
            ],
            'alamat' => ['nullable', 'string'],
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
            'nama_customer' => 'nama customer',
            'jenis_customer' => 'jenis customer',
            'no_hp' => 'nomor HP',
            'alamat' => 'alamat',
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
            'nama_customer.required' => 'Nama customer wajib diisi.',
            'jenis_customer.required' => 'Jenis customer wajib dipilih.',
            'jenis_customer.in' => 'Jenis customer harus B2B atau B2C.',
            'no_hp.unique' => 'Nomor HP sudah digunakan oleh customer lain.',
            'no_hp.max' => 'Nomor HP tidak boleh lebih dari 25 karakter.',
        ];
    }
}
