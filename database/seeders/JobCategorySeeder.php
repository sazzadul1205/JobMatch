<?php
// database/seeders/JobCategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // IT & Software Development
            ['name' => 'Software Development', 'is_active' => true],
            ['name' => 'Web Development', 'is_active' => true],
            ['name' => 'Mobile App Development', 'is_active' => true],
            ['name' => 'Data Science & Analytics', 'is_active' => true],
            ['name' => 'AI & Machine Learning', 'is_active' => true],
            ['name' => 'Cloud Computing', 'is_active' => true],
            ['name' => 'Cybersecurity', 'is_active' => true],
            ['name' => 'DevOps & Site Reliability', 'is_active' => true],
            ['name' => 'Database Administration', 'is_active' => true],
            ['name' => 'IT Support & Networking', 'is_active' => true],

            // Business & Management
            ['name' => 'Project Management', 'is_active' => true],
            ['name' => 'Product Management', 'is_active' => true],
            ['name' => 'Business Development', 'is_active' => true],
            ['name' => 'Operations Management', 'is_active' => true],
            ['name' => 'Quality Assurance', 'is_active' => true],

            // Marketing & Sales
            ['name' => 'Digital Marketing', 'is_active' => true],
            ['name' => 'Social Media Marketing', 'is_active' => true],
            ['name' => 'SEO/SEM', 'is_active' => true],
            ['name' => 'Content Writing', 'is_active' => true],
            ['name' => 'Graphic Design', 'is_active' => true],
            ['name' => 'Sales', 'is_active' => true],
            ['name' => 'Brand Management', 'is_active' => true],

            // Finance & Accounting
            ['name' => 'Accounting', 'is_active' => true],
            ['name' => 'Finance', 'is_active' => true],
            ['name' => 'Audit', 'is_active' => true],
            ['name' => 'Taxation', 'is_active' => true],
            ['name' => 'Banking', 'is_active' => true],

            // Human Resources
            ['name' => 'HR & Recruitment', 'is_active' => true],
            ['name' => 'Training & Development', 'is_active' => true],
            ['name' => 'Payroll Management', 'is_active' => true],

            // Customer Support
            ['name' => 'Customer Support', 'is_active' => true],
            ['name' => 'Call Center', 'is_active' => true],
            ['name' => 'Technical Support', 'is_active' => true],

            // Engineering
            ['name' => 'Civil Engineering', 'is_active' => true],
            ['name' => 'Electrical Engineering', 'is_active' => true],
            ['name' => 'Mechanical Engineering', 'is_active' => true],
            ['name' => 'Textile Engineering', 'is_active' => true],
            ['name' => 'Chemical Engineering', 'is_active' => true],

            // Education & Training
            ['name' => 'Teaching', 'is_active' => true],
            ['name' => 'Academic Research', 'is_active' => true],
            ['name' => 'Online Tutoring', 'is_active' => true],

            // Healthcare
            ['name' => 'Medical', 'is_active' => true],
            ['name' => 'Pharmaceuticals', 'is_active' => true],
            ['name' => 'Nursing', 'is_active' => true],

            // Others
            ['name' => 'Administration', 'is_active' => true],
            ['name' => 'Logistics & Supply Chain', 'is_active' => true],
            ['name' => 'Real Estate', 'is_active' => true],
            ['name' => 'Telecommunications', 'is_active' => true],
            ['name' => 'Media & Journalism', 'is_active' => true],
            ['name' => 'Legal', 'is_active' => true],
            ['name' => 'Architecture', 'is_active' => true],
            ['name' => 'Interior Design', 'is_active' => true],
        ];

        foreach ($categories as $category) {
            DB::table('job_categories')->insert([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'is_active' => $category['is_active'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
