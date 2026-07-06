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
        Schema::create('bom_detail', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bom_category_id');
            $table->unsignedBigInteger('bahan_baku_id');
            $table->decimal('qty_per_pair', 12, 2);
            $table->timestamps();

            $table->foreign('bom_category_id')->references('id')->on('bom_categorie')->onDelete('restrict');
            $table->foreign('bahan_baku_id')->references('id')->on('bahan_baku')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bom_detail');
    }
};
