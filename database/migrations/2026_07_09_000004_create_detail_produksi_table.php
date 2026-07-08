<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_produksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produksi_id')
                ->constrained('produksi')
                ->onDelete('restrict');
            $table->foreignId('karyawan_id')
                ->constrained('karyawan')
                ->onDelete('restrict');
            $table->integer('qty_selesai');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_produksi');
    }
};
