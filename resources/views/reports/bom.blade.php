@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 22%;">Nama BOM</th>
                <th style="width: 20%;">Keterangan</th>
                <th style="width: 24%;">Bahan Baku</th>
                <th style="width: 14%;">Kode Bahan</th>
                <th class="text-center" style="width: 8%;">Satuan</th>
                <th class="text-right" style="width: 8%;">Qty/Pasang</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['nama_bom'] }}</td>
                    <td>{{ $item['keterangan'] }}</td>
                    <td>{{ $item['nama_bahan'] }}</td>
                    <td>{{ $item['kode_bahan'] }}</td>
                    <td class="text-center"><span class="badge">{{ $item['satuan'] }}</span></td>
                    <td class="text-right">{{ $item['qty_per_pair'] }}</td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="7" class="text-center" style="padding:20px;">Tidak ada data BOM.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
