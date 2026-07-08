<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Karyawan extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'karyawan';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_karyawan',
        'jabatan',
        'no_hp',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'string',
    ];

    // ─── Relasi ──────────────────────────────────────────────────────────────

    /**
     * Relasi ke tabel detail_produksi.
     * Akan diaktifkan sepenuhnya setelah Modul Produksi selesai.
     * Deklarasi ini sudah siap dipakai untuk validasi hapus nanti.
     */
    public function detailProduksis(): HasMany
    {
        return $this->hasMany(DetailProduksi::class, 'karyawan_id');
    }
}
