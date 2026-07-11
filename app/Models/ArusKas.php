<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArusKas extends Model
{
    protected $table = 'arus_kas';

    protected $fillable = [
        'pembayaran_id',
        'created_by',
        'tanggal',
        'jenis',
        'kategori',
        'nominal',
        'metode_pembayaran',
        'keterangan',
        'bukti_transaksi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
    ];

    /** Apakah transaksi ini berasal dari pembayaran pesanan (bukan manual) */
    public function dariPembayaran(): bool
    {
        return $this->pembayaran_id !== null;
    }

    public function pembayaran(): BelongsTo
    {
        return $this->belongsTo(Pembayaran::class, 'pembayaran_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
