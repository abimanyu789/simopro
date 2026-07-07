<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        // 'float' mengirim number ke JSON (bukan string seperti 'decimal:2')
        // agar perbandingan JavaScript tidak bersifat leksikografis
        'stok'         => 'float',
        'minimum_stok' => 'float',
    ];

    /**
     * Get the stock history records for this bahan baku.
     */
    public function stokHistory(): HasMany
    {
        return $this->hasMany(StokBahanBaku::class, 'bahan_baku_id');
    }
}
