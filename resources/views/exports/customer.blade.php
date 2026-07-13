@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">No</th>
                <th style="width: 30%;">Nama Customer</th>
                <th class="text-center" style="width: 15%;">Jenis</th>
                <th style="width: 20%;">No HP</th>
                <th style="width: 30%;">Alamat</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->nama_customer }}</td>
                    <td class="text-center"><span class="badge">{{ strtoupper($item->jenis_customer) }}</span></td>
                    <td>{{ $item->no_hp ?? '-' }}</td>
                    <td>{{ $item->alamat ?? '-' }}</td>
                </tr>
            @endforeach
            
            @if(count($items) === 0)
                <tr>
                    <td colspan="5" class="text-center" style="padding: 20px;">
                        Tidak ada data customer.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection
