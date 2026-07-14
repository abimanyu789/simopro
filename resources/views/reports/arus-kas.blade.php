@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 12%;">Tanggal</th>
                <th class="text-center" style="width: 12%;">Jenis</th>
                <th style="width: 16%;">Kategori</th>
                <th style="width: 24%;">Keterangan</th>
                <th style="width: 12%;">Metode</th>
                <th class="text-right" style="width: 20%;">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['tanggal'] }}</td>
                    <td class="text-center"><span class="badge">{{ $item['jenis'] }}</span></td>
                    <td>{{ $item['kategori'] }}</td>
                    <td>{{ $item['keterangan'] }}</td>
                    <td>{{ $item['metode_pembayaran'] }}</td>
                    <td class="text-right">Rp {{ number_format($item['nominal'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="7" class="text-center" style="padding:20px;">Tidak ada data arus kas.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
