<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Pesanan extends Model
{
    protected $table = 'pesanan';

    protected $fillable = [
        'customer_id',
        'created_by',
        'nomor_pesanan',
        'tanggal',
        'status',
        'subtotal',
        'diskon',
        'ongkir',
        'total',
        'keterangan',
    ];

    protected $casts = [
        'tanggal'  => 'date',
        'subtotal' => 'decimal:2',
        'diskon'   => 'decimal:2',
        'ongkir'   => 'decimal:2',
        'total'    => 'decimal:2',
    ];

    /**
     * Auto-generate nomor_pesanan saat creating.
     * Format: PSN-{YYYYMMDD}-{urutan 4 digit per hari}
     * Contoh: PSN-20260708-0001
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $pesanan) {
            if (empty($pesanan->nomor_pesanan)) {
                $pesanan->nomor_pesanan = static::generateNomor();
            }
        });
    }

    public static function generateNomor(): string
    {
        $tanggal = now()->format('Ymd');
        $prefix  = "PSN-{$tanggal}-";

        // Lock agar aman dari race condition
        $last = DB::table('pesanan')
            ->where('nomor_pesanan', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->orderByDesc('nomor_pesanan')
            ->value('nomor_pesanan');

        $urutan = $last
            ? (int) substr($last, -4) + 1
            : 1;

        return $prefix . str_pad($urutan, 4, '0', STR_PAD_LEFT);
    }

    // ─── Status helpers ──────────────────────────────────────────────────────

    public function isPending(): bool   { return $this->status === 'pending'; }
    public function isProses(): bool    { return $this->status === 'proses'; }
    public function isSelesai(): bool   { return $this->status === 'selesai'; }
    public function isDibatalkan(): bool { return $this->status === 'dibatalkan'; }

    /** Status selesai/dibatalkan tidak boleh diedit/dihapus (BR-07) */
    public function isLocked(): bool
    {
        return in_array($this->status, ['selesai', 'dibatalkan']);
    }

    // ─── Relasi ──────────────────────────────────────────────────────────────

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function detailPesanan(): HasMany
    {
        return $this->hasMany(DetailPesanan::class, 'pesanan_id');
    }
}
