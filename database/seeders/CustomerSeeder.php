<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            // ── 10 Customer B2B ──────────────────────────────────────────────
            [
                'nama_customer' => 'CV. Sinar Jaya Footwear',
                'jenis_customer' => 'b2b',
                'no_hp' => '0812-3456-7890',
                'alamat' => 'Jl. Raya Mojosari No. 45, Mojokerto, Jawa Timur',
            ],
            [
                'nama_customer' => 'PT. Mega Distribusi Nusantara',
                'jenis_customer' => 'b2b',
                'no_hp' => '0813-5678-9012',
                'alamat' => 'Jl. Gubernur Suryo No. 12, Surabaya, Jawa Timur',
            ],
            [
                'nama_customer' => 'UD. Berkah Sandang Makmur',
                'jenis_customer' => 'b2b',
                'no_hp' => '0822-1122-3344',
                'alamat' => 'Jl. Pahlawan No. 78, Sidoarjo, Jawa Timur',
            ],
            [
                'nama_customer' => 'Toko Grosir Sepatu Mulia',
                'jenis_customer' => 'b2b',
                'no_hp' => '0811-9988-7766',
                'alamat' => 'Jl. Ahmad Yani No. 33, Malang, Jawa Timur',
            ],
            [
                'nama_customer' => 'CV. Aneka Sandal & Sepatu',
                'jenis_customer' => 'b2b',
                'no_hp' => '0877-2233-4455',
                'alamat' => 'Jl. Basuki Rahmat No. 55, Mojokerto, Jawa Timur',
            ],
            [
                'nama_customer' => 'PT. Global Retail Indonesia',
                'jenis_customer' => 'b2b',
                'no_hp' => '0815-6677-8899',
                'alamat' => 'Jl. Pemuda No. 101, Gresik, Jawa Timur',
            ],
            [
                'nama_customer' => 'UD. Putra Jaya Perdana',
                'jenis_customer' => 'b2b',
                'no_hp' => '0819-4455-6677',
                'alamat' => 'Jl. Raden Wijaya No. 22, Mojokerto, Jawa Timur',
            ],
            [
                'nama_customer' => 'Koperasi Serba Usaha Maju Bersama',
                'jenis_customer' => 'b2b',
                'no_hp' => '0853-3344-5566',
                'alamat' => 'Jl. Kartini No. 18, Pasuruan, Jawa Timur',
            ],
            [
                'nama_customer' => 'CV. Sentosa Mandiri Sejahtera',
                'jenis_customer' => 'b2b',
                'no_hp' => '0831-7788-9900',
                'alamat' => 'Jl. Dr. Soetomo No. 67, Jombang, Jawa Timur',
            ],
            [
                'nama_customer' => 'PT. Nusantara Footwear Trading',
                'jenis_customer' => 'b2b',
                'no_hp' => '0856-1234-5678',
                'alamat' => 'Jl. Diponegoro No. 89, Kediri, Jawa Timur',
            ],

            // ── 10 Customer B2C ──────────────────────────────────────────────
            [
                'nama_customer' => 'Budi Santoso',
                'jenis_customer' => 'b2c',
                'no_hp' => '0812-0011-2233',
                'alamat' => 'Perum. Graha Mojokerto Indah Blok C5, Mojokerto',
            ],
            [
                'nama_customer' => 'Siti Rahayu',
                'jenis_customer' => 'b2c',
                'no_hp' => '0818-5566-7788',
                'alamat' => 'Jl. Melati No. 7, Sooko, Mojokerto',
            ],
            [
                'nama_customer' => 'Ahmad Fauzi',
                'jenis_customer' => 'b2c',
                'no_hp' => '0857-9900-1122',
                'alamat' => 'Jl. Kenanga No. 14, Puri, Mojokerto',
            ],
            [
                'nama_customer' => 'Dewi Kurniawati',
                'jenis_customer' => 'b2c',
                'no_hp' => '0821-3344-5566',
                'alamat' => 'Jl. Mawar No. 3, Bangsal, Mojokerto',
            ],
            [
                'nama_customer' => 'Hendra Wijaya',
                'jenis_customer' => 'b2c',
                'no_hp' => '0838-7788-9900',
                'alamat' => 'Jl. Anggrek No. 21, Dlanggu, Mojokerto',
            ],
            [
                'nama_customer' => 'Rina Susanti',
                'jenis_customer' => 'b2c',
                'no_hp' => '0851-2233-4455',
                'alamat' => 'Jl. Cempaka No. 9, Gedeg, Mojokerto',
            ],
            [
                'nama_customer' => 'Agus Prasetyo',
                'jenis_customer' => 'b2c',
                'no_hp' => '0823-6677-8899',
                'alamat' => 'Perum. Mojokerto Regency B12, Mojokerto',
            ],
            [
                'nama_customer' => 'Yuliana Putri',
                'jenis_customer' => 'b2c',
                'no_hp' => '0812-5544-3322',
                'alamat' => 'Jl. Dahlia No. 5, Jetis, Mojokerto',
            ],
            [
                'nama_customer' => 'Wahyu Hidayat',
                'jenis_customer' => 'b2c',
                'no_hp' => '0817-8899-0011',
                'alamat' => 'Jl. Teratai No. 17, Trowulan, Mojokerto',
            ],
            [
                'nama_customer' => 'Nuraini Hasanah',
                'jenis_customer' => 'b2c',
                'no_hp' => '0832-4455-6677',
                'alamat' => 'Jl. Flamboyan No. 11, Mojoanyar, Mojokerto',
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
