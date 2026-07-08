<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailProduksi extends Model
{
    protected $table = 'detail_produksi';

    protected $fillable = [
        'produksi_id',
        'karyawan_id',
        'qty_selesai',
    ];

    protected $casts = [
        'qty_selesai' => 'integer',
    ];

    public function produksi(): BelongsTo
    {
        return $this->belongsTo(Produksi::class, 'produksi_id');
    }

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_id');
    }
}
