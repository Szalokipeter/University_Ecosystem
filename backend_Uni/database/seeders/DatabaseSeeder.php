<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\UniUser;
use App\Models\User;
use App\Models\User_Session;
use App\Models\User_Validation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Role::factory()->create([
            "name" => "admin",
        ]);
        Role::factory()->create([
            "name" => "teacher",
        ]);
        Role::factory()->create([
            "name" => "user",
        ]);
        User_Session::factory()->create([
            'ip_address' => '127.0.0.2',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'payload' => 'a:0:{}',
            'last_activity' => now(),
        ]);
        User_Session::factory()->create([
            'ip_address' => '192.0.0.2',
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'payload' => 'a:0:{}',
            'last_activity' => now(),
        ]);

        User_Validation::factory()->create([
            'validUntil' => now()->addDays(15),
            'approved' => 1,
            'approvedAt' => now()->addMinute(),
            'token' => '1234567890',
        ]);
        User_Validation::factory()->create([
            'validUntil' => now()->addDays(15),
            'approved' => 1,
            'approvedAt' => now()->addMinute(),
            'token' => '0987654321',
        ]);


        UniUser::factory()->create([
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'roles_id' => 1,
            'sessions_id' => 1,
            'validations_id' => 1,
        ]);

        UniUser::factory()->create([
            'username' => 'user',
            'email' => 'user@user.com',
            'password' => bcrypt('user'),
            'roles_id' => 3,
            'sessions_id' => 2,
            'validations_id' => 2,
        ]);


        UniUser::factory(4)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
