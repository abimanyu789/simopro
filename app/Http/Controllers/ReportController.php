<?php

namespace App\Http\Controllers;

use App\Exports\Reports\ReportExcelExport;
use App\Http\Requests\ReportExportRequest;
use App\Http\Requests\ReportPreviewRequest;
use App\Reports\ReportRegistry;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    /**
     * Render halaman Pusat Laporan.
     */
    public function index(): \Inertia\Response
    {
        return \Inertia\Inertia::render('laporan/index', [
            'reportTypes' => ReportRegistry::all(),
        ]);
    }

    /**
     * Kembalikan jenis laporan yang tersedia untuk populate Select di frontend.
     */
    public function types(): JsonResponse
    {
        return response()->json(ReportRegistry::all());
    }

    /**
     * Preview: maks 20 baris + summary cards + total count.
     */
    public function preview(ReportPreviewRequest $request): JsonResponse
    {
        $report = ReportRegistry::resolve($request->input('type'));
        $filters = $request->filters();

        return response()->json([
            'rows'    => $report->preview($filters),
            'summary' => $report->summary($filters),
            'total'   => $report->count($filters),
            'title'   => $report->title(),
            'headings' => $report->headings(),
        ]);
    }

    /**
     * Export ke PDF atau Excel dan kembalikan sebagai download.
     */
    public function export(ReportExportRequest $request): BinaryFileResponse|StreamedResponse
    {
        $report  = ReportRegistry::resolve($request->input('type'));
        $filters = $request->filters();
        $format  = $request->input('format');
        $data    = $report->export($filters);

        if ($format === 'pdf') {
            $pdf = Pdf::loadView($report->bladeView(), [
                'items' => $data,
                'title' => $report->title(),
                'count' => $data->count(),
            ])->setPaper('a4', 'landscape');

            return $pdf->download($report->filename() . '.pdf');
        }

        // Excel
        return Excel::download(
            new ReportExcelExport($data, $report->headings(), $report->title()),
            $report->filename() . '.xlsx',
        );
    }
}
