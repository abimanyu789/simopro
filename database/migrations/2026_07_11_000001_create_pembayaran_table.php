<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pesanan_id')
                ->constrained('pesanan')
                ->onDelete('restrict');
            $table->date('tanggal')->nullable();
            $table->enum('jenis_pembayaran', ['dp', 'pelunasan', 'termin'])->comment('Realisasi per transaksi: dp/pelunasan/termin');
            $table->decimal('nominal', 15, 2);
            $table->string('metode', 100)->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
