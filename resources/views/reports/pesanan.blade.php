@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 16%;">No. Pesanan</th>
                <th style="width: 10%;">Tanggal</th>
                <th style="width: 18%;">Customer</th>
                <th class="text-center" style="width: 10%;">Status</th>
                <th style="width: 10%;">Jenis Bayar</th>
                <th class="text-right" style="width: 12%;">Subtotal</th>
                <th class="text-right" style="width: 8%;">Diskon</th>
                <th class="text-right" style="width: 8%;">Ongkir</th>
                <th class="text-right" style="width: 14%;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['nomor_pesanan'] }}</td>
                    <td>{{ $item['tanggal'] }}</td>
                    <td>{{ $item['customer'] }}</td>
                    <td class="text-center"><span class="badge">{{ $item['status'] }}</span></td>
                    <td>{{ $item['jenis_pembayaran'] }}</td>
                    <td class="text-right">{{ number_format($item['subtotal'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['diskon'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['ongkir'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['total'], 0, ',', '.') }}</td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="10" class="text-center" style="padding:20px;">Tidak ada data pesanan.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
