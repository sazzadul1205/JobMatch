<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [];
        $faker = \Faker\Factory::create();

        // Create 1 admin
        $users[] = [
            'name' => 'Admin User',
            'email' => 'admin@jobportal.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        // Create 30 employers
        $employers = [
            'Tech Solutions Ltd',
            'Bengal Software',
            'Grameenphone',
            'Robi',
            'Banglalink',
            'BRAC Bank',
            'Dutch-Bangla Bank',
            'Square Pharmaceuticals',
            'Renata Limited',
            'Beximco Group',
            'PRAN-RFL Group',
            'Meghna Group',
            'Kazi Farms',
            'Apex Footwear',
            'Walton',
            'Singer Bangladesh',
            'Transcom Group',
            'Partex Group',
            'Akij Group',
            'Navana Group',
            'Bashundhara Group',
            'Orion Group',
            'Summit Group',
            'City Group',
            'Fresh Group',
            'Olympic Industries',
            'Unilever Bangladesh',
            'Marico Bangladesh',
            'Reckitt Benckiser',
            'British American Tobacco'
        ];

        foreach ($employers as $employer) {
            $users[] = [
                'name' => $employer,
                'email' => Str::slug($employer, '.') . '@company.com',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Create 69 job seekers (to reach ~100 total)
        $firstNames = ['Rafiq', 'Shamim', 'Rina', 'Hasan', 'Nadia', 'Farhan', 'Tahmina', 'Rakib', 'Shanta', 'Mahmud'];
        $lastNames = ['Ahmed', 'Khan', 'Rahman', 'Islam', 'Hossain', 'Akter', 'Begum', 'Ali', 'Haque', 'Chowdhury'];

        for ($i = 0; $i < 69; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $email = strtolower($firstName . $lastName . $i . '@gmail.com');

            $users[] = [
                'name' => $firstName . ' ' . $lastName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'job_seeker',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('users')->insert($users);
    }
}
