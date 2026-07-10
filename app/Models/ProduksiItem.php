<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProduksiItem extends Model
{
    protected $table = 'produksi_item';

    protected $fillable = [
        'produksi_id',
        'produk_id',
        'qty_target',
    ];

    protected $casts = [
        'qty_target' => 'integer',
    ];

    public function produksi(): BelongsTo
    {
        return $this->belongsTo(Produksi::class, 'produksi_id');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id');
    }
}
