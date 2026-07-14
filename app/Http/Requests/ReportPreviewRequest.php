<?php

namespace App\Http\Requests;

use App\Reports\ReportRegistry;
use Illuminate\Foundation\Http\FormRequest;

class ReportPreviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type'   => ['required', 'string', function ($attribute, $value, $fail) {
                if (!ReportRegistry::isValid($value)) {
                    $fail('Jenis laporan tidak dikenali.');
                }
            }],
            'dari'   => ['nullable', 'date_format:Y-m-d'],
            'sampai' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:dari'],
        ];
    }

    public function filters(): array
    {
        return [
            'dari'   => $this->input('dari'),
            'sampai' => $this->input('sampai'),
        ];
    }
}
