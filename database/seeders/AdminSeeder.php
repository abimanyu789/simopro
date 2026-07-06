<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Buat 1 akun admin default untuk sistem Provillo.
     *
     * Gunakan updateOrCreate supaya seeder aman dijalankan berulang kali
     * tanpa membuat duplikat. email_verified_at diisi now() agar admin
     * langsung bisa login tanpa perlu verifikasi email.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@provillo.com'],
            [
                'name' => 'Admin Provillo',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
