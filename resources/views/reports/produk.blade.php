@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 14%;">Kode Produk</th>
                <th style="width: 28%;">Nama Produk</th>
                <th style="width: 20%;">Kategori BOM</th>
                <th class="text-right" style="width: 18%;">Harga Jual</th>
                <th class="text-right" style="width: 16%;">Stok</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['kode_produk'] }}</td>
                    <td>{{ $item['nama_produk'] }}</td>
                    <td>{{ $item['kategori_bom'] }}</td>
                    <td class="text-right">Rp {{ number_format($item['harga_jual'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ $item['stok'] }} unit</td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="6" class="text-center" style="padding:20px;">Tidak ada data produk.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
