@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">No</th>
                <th style="width: 30%;">Nama BOM</th>
                <th style="width: 35%;">Digunakan Oleh Produk</th>
                <th style="width: 30%;">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->nama_bom }}</td>
                    <td>{{ $item->produk->pluck('nama_produk')->implode(', ') ?: 'Belum digunakan' }}</td>
                    <td>{{ $item->keterangan ?? '-' }}</td>
                </tr>
            @endforeach
            
            @if(count($items) === 0)
                <tr>
                    <td colspan="4" class="text-center" style="padding: 20px;">
                        Tidak ada data BOM.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection
