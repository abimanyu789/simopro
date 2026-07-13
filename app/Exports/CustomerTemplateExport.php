<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CustomerTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new CustomerTemplateDataSheet(),
            new CustomerTemplateInstructionSheet(),
        ];
    }
}
