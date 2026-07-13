<?php

namespace App\Exports\Traits;

use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

trait WithExcelValidation
{
    /**
     * Apply dropdown validation to a specific column range in an Excel sheet.
     *
     * @param Worksheet $sheet The active worksheet.
     * @param string $columnLetter The column letter (e.g., 'C').
     * @param array|\Illuminate\Support\Collection $options Array or Collection of valid string options.
     * @param int $maxRow The maximum row to apply the validation to. Default 1000.
     * @param string $errorTitle The title of the error alert.
     * @param string $errorMsg The message of the error alert.
     */
    protected function addDropdownValidation(
        Worksheet $sheet,
        string $columnLetter,
        $options,
        int $maxRow = 1000,
        string $errorTitle = 'Input Tidak Valid',
        string $errorMsg = 'Silakan pilih nilai dari daftar dropdown yang tersedia.'
    ): void {
        if ($options instanceof \Illuminate\Support\Collection) {
            $options = $options->toArray();
        }
        // Validation length limit in Excel is ~255 characters for comma-separated list.
        // For larger lists, we usually map to a hidden sheet, but for enum/master data,
        // if it exceeds 255 chars, it should be done via named ranges. 
        // For this trait, we handle the simple comma-separated list first.
        $optionsList = implode(',', $options);

        // Optional: If options list is too long, it might fail in raw format,
        // but for standard enums like 'meter,kilogram,lembar,buah,pasang' it works perfectly.
        
        $validation = $sheet->getCell($columnLetter . '2')->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setShowDropDown(true);
        $validation->setErrorTitle($errorTitle);
        $validation->setError($errorMsg);
        $validation->setFormula1('"' . $optionsList . '"');

        $sheet->setDataValidation("{$columnLetter}2:{$columnLetter}{$maxRow}", clone $validation);
    }
}
