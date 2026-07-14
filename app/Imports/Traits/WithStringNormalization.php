<?php

namespace App\Imports\Traits;

trait WithStringNormalization
{
    /**
     * Mempersiapkan dan menormalisasi data sebelum proses validasi Laravel berjalan.
     *
     * - Unwrap Collection (akibat ToCollection) agar Laravel Validator bisa akses key via dot-notation.
     * - Cast field numerik (int/float) ke string untuk field yang didefinisikan di $stringFields.
     * - Lowercase + trim field yang didefinisikan di $lowercaseFields (misal: satuan, jenis_customer).
     *
     * @param array|\Illuminate\Support\Collection $data
     * @param int $index
     * @return array
     */
    public function prepareForValidation($data, $index)
    {
        // ToCollection wraps each row in a Collection object; convert to plain array
        // so Laravel Validator can access nested keys via dot-notation (*.field).
        if ($data instanceof \Illuminate\Support\Collection) {
            $data = $data->toArray();
        }

        // Cast numeric values to string for fields that are stored as VARCHAR.
        if (property_exists($this, 'stringFields') && is_array($this->stringFields)) {
            foreach ($this->stringFields as $field) {
                if (array_key_exists($field, $data) && (is_int($data[$field]) || is_float($data[$field]))) {
                    $data[$field] = (string) $data[$field];
                }
            }
        }

        // Normalize fields to lowercase + trimmed (e.g. satuan, jenis_customer).
        // Prevents case-sensitivity failures when user types "Meter" instead of "meter".
        if (property_exists($this, 'lowercaseFields') && is_array($this->lowercaseFields)) {
            foreach ($this->lowercaseFields as $field) {
                if (array_key_exists($field, $data) && is_string($data[$field])) {
                    $data[$field] = strtolower(trim($data[$field]));
                }
            }
        }

        return $data;
    }
}
