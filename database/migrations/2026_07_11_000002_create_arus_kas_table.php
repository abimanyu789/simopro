<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arus_kas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pembayaran_id')
                ->nullable()
                ->constrained('pembayaran')
                ->onDelete('restrict')
                ->comment('null jika transaksi manual; not null jika dari pembayaran pesanan');
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('restrict');
            $table->date('tanggal')->nullable();
            $table->enum('jenis', ['pemasukan', 'pengeluaran']);
            $table->string('kategori', 100)->nullable();
            $table->decimal('nominal', 15, 2)->nullable();
            $table->string('metode_pembayaran', 100)->nullable();
            $table->text('keterangan')->nullable();
            $table->string('bukti_transaksi', 255)->nullable()->comment('Path file — upload diimplementasi mendatang');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arus_kas');
    }
};
