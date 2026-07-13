<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class BahanBakuTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new BahanBakuTemplateDataSheet(),
            new BahanBakuTemplateInstructionSheet(),
        ];
    }
}
