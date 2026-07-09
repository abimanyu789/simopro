<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detail_produksi', function (Blueprint $table) {
            $table->foreignId('produk_id')
                ->after('produksi_id')
                ->constrained('produk')
                ->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::table('detail_produksi', function (Blueprint $table) {
            $table->dropForeign(['produk_id']);
            $table->dropColumn('produk_id');
        });
    }
};
