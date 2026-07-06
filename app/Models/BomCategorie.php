<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BomCategorie extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'bom_categorie';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nama_bom', 'keterangan'];

    public function bomDetails(): HasMany
    {
        return $this->hasMany(BomDetail::class, 'bom_category_id');
    }

    public function produk(): HasMany
    {
        return $this->hasMany(Produk::class, 'bom_category_id');
    }
}
