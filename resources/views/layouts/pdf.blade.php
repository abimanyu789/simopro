<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? 'Laporan SIMOPRO' }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            border: none;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header-table td {
            border: none;
            padding: 0;
        }
        .header-text {
            text-align: center;
        }
        .header-text h1 {
            margin: 0 0 5px 0;
            font-size: 20px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .header-text h2 {
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #555;
            font-weight: normal;
        }
        .header-text p {
            margin: 0;
            color: #666;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f4f4f5;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            background-color: #e4e4e7;
            text-transform: uppercase;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #666;
            position: fixed;
            bottom: 0;
            width: 100%;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
        .page-number:before {
            content: counter(page);
        }
        .info-section {
            margin-bottom: 15px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td style="width: 15%; text-align: left; vertical-align: middle;">
                @if(file_exists(public_path('LogoProvillo.jpg')))
                    <img src="{{ public_path('LogoProvillo.jpg') }}" alt="Logo Provillo" style="width: 80px; height: auto;">
                @endif
            </td>
            <td style="width: 70%; vertical-align: middle;" class="header-text">
                <h1>PROVILLO</h1>
                <h2>Sistem Informasi Manajemen Operasional (SIMOPRO)</h2>
                <p>{{ $title ?? 'Laporan Data' }}</p>
            </td>
            <td style="width: 15%;"></td>
        </tr>
    </table>

    <div class="info-section">
        <table style="width: auto; border: none; margin-bottom: 10px;">
            <tr>
                <td style="border: none; padding: 2px 10px 2px 0;"><strong>Tanggal Cetak</strong></td>
                <td style="border: none; padding: 2px;">: {{ \Carbon\Carbon::now()->translatedFormat('d F Y H:i') }}</td>
            </tr>
            <tr>
                <td style="border: none; padding: 2px 10px 2px 0;"><strong>Total Data</strong></td>
                <td style="border: none; padding: 2px;">: {{ $count ?? 0 }} baris</td>
            </tr>
        </table>
    </div>

    @yield('content')

    <div class="footer">
        Dicetak dari SIMOPRO Provillo | Halaman <span class="page-number"></span>
    </div>
</body>
</html>
