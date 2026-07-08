<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')
                ->constrained('pesanan')
                ->onDelete('restrict');
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('restrict');
            $table->date('deadline')->nullable();
            $table->integer('qty_target');
            $table->integer('qty_selesai')->default(0);
            $table->enum('status', ['draft', 'proses', 'selesai', 'dibatalkan'])
                ->default('draft');
            $table->enum('status_qc', ['belum_dicek', 'lolos', 'tidak_lolos'])
                ->default('belum_dicek');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produksi');
    }
};
