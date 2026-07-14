@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 4%;">No</th>
                <th style="width: 10%;">ID</th>
                <th style="width: 16%;">No. Pesanan</th>
                <th style="width: 10%;">Jenis</th>
                <th style="width: 10%;">Deadline</th>
                <th class="text-right" style="width: 10%;">Target</th>
                <th class="text-right" style="width: 10%;">Selesai</th>
                <th class="text-center" style="width: 10%;">Status</th>
                <th class="text-center" style="width: 10%;">QC</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item['id'] }}</td>
                    <td>{{ $item['nomor_pesanan'] }}</td>
                    <td>{{ $item['jenis_produksi'] }}</td>
                    <td>{{ $item['deadline'] }}</td>
                    <td class="text-right">{{ $item['qty_target'] }}</td>
                    <td class="text-right">{{ $item['qty_selesai'] }}</td>
                    <td class="text-center"><span class="badge">{{ $item['status'] }}</span></td>
                    <td class="text-center"><span class="badge">{{ $item['status_qc'] }}</span></td>
                </tr>
            @endforeach
            @if($items->isEmpty())
                <tr><td colspan="9" class="text-center" style="padding:20px;">Tidak ada data produksi.</td></tr>
            @endif
        </tbody>
    </table>
@endsection
