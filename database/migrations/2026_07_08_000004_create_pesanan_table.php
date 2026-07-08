<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')
                ->constrained('customer')
                ->onDelete('restrict');
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('restrict');
            $table->string('nomor_pesanan', 100)->unique();
            $table->date('tanggal');
            $table->enum('status', ['pending', 'proses', 'selesai', 'dibatalkan'])
                ->default('pending');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('diskon', 15, 2)->default(0);
            $table->decimal('ongkir', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pesanan');
    }
};
