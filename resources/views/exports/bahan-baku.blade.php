@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">No</th>
                <th style="width: 20%;">Kode Bahan</th>
                <th style="width: 35%;">Nama Bahan Baku</th>
                <th class="text-center" style="width: 15%;">Satuan</th>
                <th class="text-right" style="width: 10%;">Min. Stok</th>
                <th class="text-right" style="width: 15%;">Stok Saat Ini</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->kode_bahan }}</td>
                    <td>{{ $item->nama_bahan }}</td>
                    <td class="text-center"><span class="badge">{{ $item->satuan }}</span></td>
                    <td class="text-right">{{ rtrim(rtrim(number_format($item->minimum_stok, 2, ',', '.'), '0'), ',') }}</td>
                    <td class="text-right">{{ rtrim(rtrim(number_format($item->stok, 2, ',', '.'), '0'), ',') }}</td>
                </tr>
            @endforeach
            
            @if(count($items) === 0)
                <tr>
                    <td colspan="6" class="text-center" style="padding: 20px;">
                        Tidak ada data bahan baku.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection
