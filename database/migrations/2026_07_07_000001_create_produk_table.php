<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('kode_produk', 50)->unique();
            $table->string('nama_produk', 255);
            $table->string('ukuran', 30)->nullable();
            $table->string('warna', 50)->nullable();
            $table->decimal('harga_jual', 15, 2)->nullable();
            $table->integer('stok')->default(0);
            $table->integer('minimum_stok')->nullable();
            // Kolom referensi ke bom_categorie; FK constraint BELUM ditambahkan karena
            // tabel bom_categorie belum dibuat. Constraint onDelete('restrict') akan
            // ditambahkan bersama migration bom_categorie pada Modul 5 (BOM).
            $table->unsignedBigInteger('bom_category_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
