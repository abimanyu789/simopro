@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 26%;">Nama Customer</th>
                <th style="width: 16%;">Jenis Customer</th>
                <th style="width: 16%;">No. HP</th>
                <th style="width: 26%;">Alamat</th>
                <th class="text-right" style="width: 12%;">Total Pesanan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['nama_customer'] }}</td>
                    <td>{{ $item['jenis_customer'] }}</td>
                    <td>{{ $item['no_hp'] }}</td>
                    <td>{{ $item['alamat'] }}</td>
                    <td class="text-right">{{ $item['total_pesanan'] }}</td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="6" class="text-center" style="padding:20px;">Tidak ada data customer.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
