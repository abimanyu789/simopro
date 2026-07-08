<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produk extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'produk';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'kode_produk',
        'nama_produk',
        'ukuran',
        'warna',
        'harga_jual',
        'stok',
        'minimum_stok',
        'bom_category_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'harga_jual' => 'decimal:2',
        'stok' => 'integer',
        'minimum_stok' => 'integer',
        'bom_category_id' => 'integer',
    ];

    public function bomCategorie(): BelongsTo
    {
        return $this->belongsTo(BomCategorie::class, 'bom_category_id');
    }

    /**
     * Get the stock history records for this produk.
     */
    public function stokHistory(): HasMany
    {
        return $this->hasMany(StokProdukJadi::class, 'produk_id');
    }

    public function detailPesanans(): HasMany
    {
        return $this->hasMany(DetailPesanan::class, 'produk_id');
    }
}
