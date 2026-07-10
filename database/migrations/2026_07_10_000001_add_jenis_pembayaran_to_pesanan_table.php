<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pesanan', function (Blueprint $table) {
            $table->enum('jenis_pembayaran', ['dp', 'lunas', 'bertahap', 'cod', 'termin'])
                ->nullable()
                ->after('status')
                ->comment('Kontrak pembayaran yang disepakati saat order');
        });
    }

    public function down(): void
    {
        Schema::table('pesanan', function (Blueprint $table) {
            $table->dropColumn('jenis_pembayaran');
        });
    }
};
