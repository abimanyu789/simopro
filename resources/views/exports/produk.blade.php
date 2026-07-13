@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">No</th>
                <th style="width: 15%;">Kode Produk</th>
                <th style="width: 25%;">Nama Produk</th>
                <th style="width: 10%;">Ukuran</th>
                <th style="width: 15%;">Warna</th>
                <th class="text-right" style="width: 15%;">Harga Jual</th>
                <th class="text-right" style="width: 15%;">Stok</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->kode_produk }}</td>
                    <td>{{ $item->nama_produk }}</td>
                    <td>{{ $item->ukuran ?? '-' }}</td>
                    <td>{{ $item->warna ?? '-' }}</td>
                    <td class="text-right">Rp {{ number_format($item->harga_jual, 0, ',', '.') }}</td>
                    <td class="text-right">{{ $item->stok }}</td>
                </tr>
            @endforeach
            
            @if(count($items) === 0)
                <tr>
                    <td colspan="7" class="text-center" style="padding: 20px;">
                        Tidak ada data produk.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection
