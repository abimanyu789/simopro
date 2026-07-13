@extends('layouts.pdf')

@section('content')

    @if(count($items) === 0)
        <table>
            <tr>
                <td class="text-center" style="padding: 20px;">
                    Tidak ada data BOM.
                </td>
            </tr>
        </table>
    @else
        @foreach($items as $bom)
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
                <h3 style="margin-bottom: 5px;">{{ strtoupper($bom->nama_bom) }}</h3>
                <p style="margin: 0 0 3px 0; font-size: 12px;">
                    <strong>Digunakan Oleh:</strong> {{ $bom->produk->pluck('nama_produk')->implode(', ') ?: 'Belum digunakan' }}
                </p>
                <p style="margin: 0 0 10px 0; font-size: 12px;">
                    <strong>Keterangan:</strong> {{ $bom->keterangan ?? '-' }}
                </p>

                <table>
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 5%;">No</th>
                            <th style="width: 20%;">Kode Bahan</th>
                            <th style="width: 40%;">Nama Bahan</th>
                            <th class="text-center" style="width: 15%;">Qty</th>
                            <th style="width: 20%;">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($bom->bomDetails->count() > 0)
                            @foreach($bom->bomDetails as $index => $detail)
                                <tr>
                                    <td class="text-center">{{ $index + 1 }}</td>
                                    <td>{{ $detail->bahanBaku->kode_bahan ?? '-' }}</td>
                                    <td>{{ $detail->bahanBaku->nama_bahan ?? '-' }}</td>
                                    <td class="text-center">{{ $detail->qty_per_pair }}</td>
                                    <td>{{ $detail->bahanBaku->satuan ?? '-' }}</td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td colspan="5" class="text-center" style="font-style: italic;">
                                    Tidak ada komposisi bahan baku
                                </td>
                            </tr>
                        @endif
                    </tbody>
                </table>
            </div>
        @endforeach
    @endif

@endsection
