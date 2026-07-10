<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produksi_id')
                ->constrained('produksi')
                ->onDelete('restrict');
            $table->foreignId('produk_id')
                ->constrained('produk')
                ->onDelete('restrict');
            $table->integer('qty_target');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi_item');
    }
};
