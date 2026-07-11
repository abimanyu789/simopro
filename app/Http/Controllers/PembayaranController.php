<?php

namespace App\Http\Controllers;

use App\Http\Requests\PembayaranRequest;
use App\Models\Pembayaran;
use App\Models\Pesanan;
use App\Services\PembayaranService;
use Illuminate\Http\RedirectResponse;

class PembayaranController extends Controller
{
    public function __construct(
        private readonly PembayaranService $service
    ) {}

    /**
     * Simpan pembayaran baru untuk pesanan.
     * Auto-create entry arus_kas (pemasukan) via PembayaranService.
     */
    public function store(PembayaranRequest $request, Pesanan $pesanan): RedirectResponse
    {
        $this->service->create($pesanan, $request->validated(), auth()->id());

        return redirect()
            ->route('pesanan.show', $pesanan)
            ->with('success', "Pembayaran berhasil dicatat dan masuk ke Arus Kas.");
    }

    /**
     * Hapus pembayaran beserta entry arus kas terkait.
     */
    public function destroy(Pembayaran $pembayaran): RedirectResponse
    {
        $pesananId = $pembayaran->pesanan_id;

        $this->service->destroy($pembayaran);

        return redirect()
            ->route('pesanan.show', $pesananId)
            ->with('success', "Pembayaran berhasil dihapus.");
    }
}
