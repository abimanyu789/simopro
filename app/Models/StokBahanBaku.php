<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokBahanBaku extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stok_bahan_baku';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'bahan_baku_id',
        'jenis_transaksi',
        'qty',
        'stok_sebelum',
        'stok_sesudah',
        'keterangan',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'qty'           => 'float',
        'stok_sebelum'  => 'float',
        'stok_sesudah'  => 'float',
    ];

    /**
     * Get the bahan baku that owns this stock record.
     */
    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class, 'bahan_baku_id');
    }
}
