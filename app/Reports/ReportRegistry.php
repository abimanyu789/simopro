<?php

namespace App\Reports;

use App\Reports\Contracts\ReportInterface;
use InvalidArgumentException;

class ReportRegistry
{
    private static array $reports = [
        'pesanan'          => PesananReport::class,
        'produksi'         => ProduksiReport::class,
        'arus-kas'         => ArusKasReport::class,
        'stok-bahan-baku'  => StokBahanBakuReport::class,
        'stok-produk-jadi' => StokProdukJadiReport::class,
        'bahan-baku'       => BahanBakuReport::class,
        'produk'           => ProdukReport::class,
        'customer'         => CustomerReport::class,
        'karyawan'         => KaryawanReport::class,
        'bom'              => BomReport::class,
    ];

    public static function resolve(string $type): ReportInterface
    {
        if (!isset(self::$reports[$type])) {
            throw new InvalidArgumentException("Jenis laporan '{$type}' tidak dikenali.");
        }

        return new (self::$reports[$type])();
    }

    /** Kembalikan semua slug beserta title, untuk populate Select di frontend. */
    public static function all(): array
    {
        return collect(self::$reports)
            ->map(fn ($class, $slug) => [
                'value' => $slug,
                'label' => (new $class())->title(),
            ])
            ->values()
            ->all();
    }

    public static function isValid(string $type): bool
    {
        return isset(self::$reports[$type]);
    }
}
