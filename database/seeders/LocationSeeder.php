<?php
// database/seeders/LocationSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            // Divisional Cities
            ['name' => 'Dhaka', 'address' => 'Dhaka Division, Bangladesh', 'is_active' => true],
            ['name' => 'Chattogram', 'address' => 'Chattogram Division, Bangladesh', 'is_active' => true],
            ['name' => 'Rajshahi', 'address' => 'Rajshahi Division, Bangladesh', 'is_active' => true],
            ['name' => 'Khulna', 'address' => 'Khulna Division, Bangladesh', 'is_active' => true],
            ['name' => 'Barishal', 'address' => 'Barishal Division, Bangladesh', 'is_active' => true],
            ['name' => 'Sylhet', 'address' => 'Sylhet Division, Bangladesh', 'is_active' => true],
            ['name' => 'Rangpur', 'address' => 'Rangpur Division, Bangladesh', 'is_active' => true],
            ['name' => 'Mymensingh', 'address' => 'Mymensingh Division, Bangladesh', 'is_active' => true],

            // Major Industrial/IT Hubs in Dhaka
            ['name' => 'Gulshan', 'address' => 'Gulshan, Dhaka', 'is_active' => true],
            ['name' => 'Banani', 'address' => 'Banani, Dhaka', 'is_active' => true],
            ['name' => 'Mohakhali', 'address' => 'Mohakhali, Dhaka', 'is_active' => true],
            ['name' => 'Uttara', 'address' => 'Uttara, Dhaka', 'is_active' => true],
            ['name' => 'Dhanmondi', 'address' => 'Dhanmondi, Dhaka', 'is_active' => true],
            ['name' => 'Mirpur', 'address' => 'Mirpur, Dhaka', 'is_active' => true],
            ['name' => 'Motijheel', 'address' => 'Motijheel, Dhaka', 'is_active' => true],
            ['name' => 'Paltan', 'address' => 'Paltan, Dhaka', 'is_active' => true],
            ['name' => 'Tejgaon', 'address' => 'Tejgaon, Dhaka', 'is_active' => true],
            ['name' => 'Bashundhara', 'address' => 'Bashundhara, Dhaka', 'is_active' => true],

            // Other Major Cities
            ['name' => 'Narayanganj', 'address' => 'Narayanganj, Dhaka', 'is_active' => true],
            ['name' => 'Gazipur', 'address' => 'Gazipur, Dhaka', 'is_active' => true],
            ['name' => 'Savar', 'address' => 'Savar, Dhaka', 'is_active' => true],
            ['name' => 'Cox\'s Bazar', 'address' => 'Cox\'s Bazar, Chattogram', 'is_active' => true],
            ['name' => 'Comilla', 'address' => 'Comilla, Chattogram', 'is_active' => true],
            ['name' => 'Feni', 'address' => 'Feni, Chattogram', 'is_active' => true],
            ['name' => 'Bogra', 'address' => 'Bogra, Rajshahi', 'is_active' => true],
            ['name' => 'Jessore', 'address' => 'Jessore, Khulna', 'is_active' => true],
            ['name' => 'Kushtia', 'address' => 'Kushtia, Khulna', 'is_active' => true],
            ['name' => 'Pabna', 'address' => 'Pabna, Rajshahi', 'is_active' => true],
            ['name' => 'Tangail', 'address' => 'Tangail, Dhaka', 'is_active' => true],
            ['name' => 'Narsingdi', 'address' => 'Narsingdi, Dhaka', 'is_active' => true],

            // EPZs / Industrial Areas
            ['name' => 'Savar EPZ', 'address' => 'Savar EPZ, Dhaka', 'is_active' => true],
            ['name' => 'Karnaphuli EPZ', 'address' => 'Karnaphuli, Chattogram', 'is_active' => true],
            ['name' => 'Adamjee EPZ', 'address' => 'Adamjee EPZ, Narayanganj', 'is_active' => true],
            ['name' => 'Ishwardi EPZ', 'address' => 'Ishwardi EPZ, Pabna', 'is_active' => true],
            ['name' => 'Mongla EPZ', 'address' => 'Mongla EPZ, Bagerhat', 'is_active' => true],
        ];

        foreach ($locations as $location) {
            DB::table('locations')->insert([
                'name' => $location['name'],
                'address' => $location['address'],
                'is_active' => $location['is_active'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
