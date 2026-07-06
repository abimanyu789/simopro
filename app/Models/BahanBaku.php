<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BahanBaku extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'bahan_baku';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'kode_bahan',
        'nama_bahan',
        'satuan',
        'stok',
        'minimum_stok',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stok' => 'decimal:2',
        'minimum_stok' => 'decimal:2',
    ];
}
