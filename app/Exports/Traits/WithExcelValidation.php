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
     * @param bool $useHiddenSheet Whether to use a hidden sheet for validation (recommended for large lists).
     * @param string $hiddenSheetName Name of the hidden sheet (e.g., 'ValidationData_Customer').
     */
    protected function addDropdownValidation(
        Worksheet $sheet,
        string $columnLetter,
        $options,
        int $maxRow = 1000,
        string $errorTitle = 'Input Tidak Valid',
        string $errorMsg = 'Silakan pilih nilai dari daftar dropdown yang tersedia.',
        bool $useHiddenSheet = false,
        string $hiddenSheetName = 'ValidationOptions'
    ): void {
        if ($options instanceof \Illuminate\Support\Collection) {
            $options = $options->toArray();
        }

        $validation = $sheet->getCell($columnLetter . '2')->getDataValidation();
        $validation->setType(DataValidation::TYPE_LIST);
        $validation->setErrorStyle(DataValidation::STYLE_STOP);
        $validation->setAllowBlank(false);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setShowDropDown(true);
        $validation->setErrorTitle($errorTitle);
        $validation->setError($errorMsg);

        if ($useHiddenSheet) {
            $spreadsheet = $sheet->getParent();
            $hiddenSheet = $spreadsheet->getSheetByName($hiddenSheetName);
            
            if (!$hiddenSheet) {
                $hiddenSheet = new Worksheet($spreadsheet, $hiddenSheetName);
                $spreadsheet->addSheet($hiddenSheet);
                $hiddenSheet->setSheetState(Worksheet::SHEETSTATE_HIDDEN);
            }

            // Find an empty column in the hidden sheet
            $colIndex = 1;
            while ($hiddenSheet->getCellByColumnAndRow($colIndex, 1)->getValue() !== null) {
                $colIndex++;
            }

            foreach ($options as $index => $option) {
                $hiddenSheet->setCellValueByColumnAndRow($colIndex, $index + 1, $option);
            }

            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $formula = "'" . $hiddenSheetName . "'!\$" . $colLetter . "\$1:\$" . $colLetter . "\$" . count($options);
            $validation->setFormula1($formula);
        } else {
            $optionsList = implode(',', $options);
            $validation->setFormula1('"' . $optionsList . '"');
        }

        $sheet->setDataValidation("{$columnLetter}2:{$columnLetter}{$maxRow}", clone $validation);
    }
}
