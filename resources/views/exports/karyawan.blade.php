@extends('layouts.pdf')

@section('content')
    <table>
        <thead>
            <tr>
                <th class="text-center" style="width: 5%;">No</th>
                <th style="width: 30%;">Nama Karyawan</th>
                <th style="width: 30%;">Jabatan</th>
                <th style="width: 20%;">No HP</th>
                <th class="text-center" style="width: 15%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($items as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->nama_karyawan }}</td>
                    <td>{{ $item->jabatan ?? '-' }}</td>
                    <td>{{ $item->no_hp ?? '-' }}</td>
                    <td class="text-center"><span class="badge">{{ strtoupper($item->status) }}</span></td>
                </tr>
            @endforeach
            
            @if(count($items) === 0)
                <tr>
                    <td colspan="5" class="text-center" style="padding: 20px;">
                        Tidak ada data karyawan.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
@endsection
