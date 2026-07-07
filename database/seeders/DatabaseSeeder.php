<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            BahanBakuSeeder::class,
            ProdukSeeder::class,
            BomCategorieSeeder::class,
            CustomerSeeder::class,
        ]);
    }
}
