<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produksi extends Model
{
    protected $table = 'produksi';

    protected $fillable = [
        'pesanan_id',
        'created_by',
        'deadline',
        'qty_target',
        'qty_selesai',
        'status',
        'status_qc',
        'catatan',
    ];

    protected $casts = [
        'deadline'    => 'date',
        'qty_target'  => 'integer',
        'qty_selesai' => 'integer',
    ];

    // ─── Status helpers ──────────────────────────────────────────────────────

    public function isDraft(): bool      { return $this->status === 'draft'; }
    public function isProses(): bool     { return $this->status === 'proses'; }
    public function isSelesai(): bool    { return $this->status === 'selesai'; }
    public function isDibatalkan(): bool { return $this->status === 'dibatalkan'; }

    /** Produksi aktif = masih draft atau proses */
    public function isAktif(): bool
    {
        return in_array($this->status, ['draft', 'proses']);
    }

    // ─── Relasi ──────────────────────────────────────────────────────────────

    public function pesanan(): BelongsTo
    {
        return $this->belongsTo(Pesanan::class, 'pesanan_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function detailProduksi(): HasMany
    {
        return $this->hasMany(DetailProduksi::class, 'produksi_id');
    }
}
