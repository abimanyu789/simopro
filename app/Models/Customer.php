<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'customer';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama_customer',
        'jenis_customer',
        'no_hp',
        'alamat',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'jenis_customer' => 'string',
    ];

    // ─── Relasi ──────────────────────────────────────────────────────────────

    public function pesanans(): HasMany
    {
        return $this->hasMany(Pesanan::class, 'customer_id');
    }
}
