<?php

namespace App\Exports;

use App\Models\BomCategorie;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BomExport implements FromCollection, WithEvents, WithStyles, ShouldAutoSize
{
    protected $rowStyles = [];
    protected $mergeCells = [];

    public function collection()
    {
        $boms = BomCategorie::with(['produk', 'bomDetails.bahanBaku'])->orderBy('nama_bom')->get();
        $rows = new Collection();
        $currentRow = 1;

        foreach ($boms as $bom) {
            // Master Data
            $rows->push([strtoupper($bom->nama_bom), '', '', '', '']);
            $this->rowStyles[$currentRow] = ['font' => ['bold' => true, 'size' => 14]];
            $this->mergeCells[] = "A{$currentRow}:E{$currentRow}";
            $currentRow++;

            $produkList = $bom->produk->pluck('nama_produk')->implode(', ') ?: 'Belum digunakan';
            $rows->push(['Digunakan Oleh:', $produkList, '', '', '']);
            $this->rowStyles[$currentRow] = ['font' => ['italic' => true]];
            $this->mergeCells[] = "B{$currentRow}:E{$currentRow}";
            $currentRow++;

            $rows->push(['Keterangan:', $bom->keterangan ?? '-', '', '', '']);
            $this->rowStyles[$currentRow] = [];
            $this->mergeCells[] = "B{$currentRow}:E{$currentRow}";
            $currentRow++;

            $rows->push(['', '', '', '', '']); // Blank row before table
            $currentRow++;

            // Detail Table Header
            $rows->push(['No', 'Kode Bahan', 'Nama Bahan', 'Qty', 'Satuan']);
            $this->rowStyles[$currentRow] = [
                'font' => ['bold' => true],
                'borders' => [
                    'bottom' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN],
                    'top' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN],
                ]
            ];
            $currentRow++;

            // Detail Table Rows
            if ($bom->bomDetails->count() > 0) {
                foreach ($bom->bomDetails as $index => $detail) {
                    $rows->push([
                        $index + 1,
                        $detail->bahanBaku->kode_bahan ?? '-',
                        $detail->bahanBaku->nama_bahan ?? '-',
                        $detail->qty_per_pair,
                        $detail->bahanBaku->satuan ?? '-'
                    ]);
                    $this->rowStyles[$currentRow] = [
                        'borders' => [
                            'bottom' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_HAIR],
                        ]
                    ];
                    $currentRow++;
                }
            } else {
                $rows->push(['Tidak ada komposisi bahan baku', '', '', '', '']);
                $this->rowStyles[$currentRow] = ['font' => ['italic' => true]];
                $this->mergeCells[] = "A{$currentRow}:E{$currentRow}";
                $currentRow++;
            }

            // Blank rows between BOMs
            $rows->push(['', '', '', '', '']);
            $currentRow++;
            $rows->push(['', '', '', '', '']);
            $currentRow++;
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        return $this->rowStyles;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                foreach ($this->mergeCells as $merge) {
                    $event->sheet->getDelegate()->mergeCells($merge);
                }
            },
        ];
    }
}
