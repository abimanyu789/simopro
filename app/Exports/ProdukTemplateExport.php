<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProdukTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new ProdukTemplateDataSheet(),
            new ProdukTemplateInstructionSheet(),
        ];
    }
}
