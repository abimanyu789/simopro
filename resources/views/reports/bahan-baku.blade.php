@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 16%;">Kode Bahan</th>
                <th style="width: 30%;">Nama Bahan Baku</th>
                <th class="text-center" style="width: 10%;">Satuan</th>
                <th class="text-right" style="width: 14%;">Min. Stok</th>
                <th class="text-right" style="width: 14%;">Stok Saat Ini</th>
                <th class="text-center" style="width: 12%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['kode_bahan'] }}</td>
                    <td>{{ $item['nama_bahan'] }}</td>
                    <td class="text-center"><span class="badge">{{ $item['satuan'] }}</span></td>
                    <td class="text-right">{{ rtrim(rtrim(number_format($item['minimum_stok'], 2, ',', '.'), '0'), ',') }}</td>
                    <td class="text-right">{{ rtrim(rtrim(number_format($item['stok'], 2, ',', '.'), '0'), ',') }}</td>
                    <td class="text-center"><span class="badge">{{ $item['status_stok'] }}</span></td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="7" class="text-center" style="padding:20px;">Tidak ada data bahan baku.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
