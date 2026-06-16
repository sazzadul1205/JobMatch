<?php
// database/seeders/CMS/SettingsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SettingsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('settings')->truncate();
        Schema::enableForeignKeyConstraints();

        $assetBase = '/storage';

        $settings = [
            // Top Bar Settings
            [
                'key' => 'topbar',
                'value' => json_encode([
                    'contactInfo' => [
                        'email' => [
                            'text' => 'dus.eddus@gmail.com',
                            'icon' => $assetBase . '/images/TopBar/Email.svg',
                            'alt' => 'Email'
                        ],
                        'phone' => [
                            'text' => '+880 1761-493412',
                            'icon' => $assetBase . '/images/TopBar/Phone.svg',
                            'alt' => 'Phone'
                        ],
                        'hours' => [
                            'text' => 'Sun - Thu 9:00AM - 5:00PM',
                            'icon' => $assetBase . '/images/TopBar/Clock.svg',
                            'alt' => 'Clock'
                        ]
                    ],
                    'languages' => [
                        [
                            'code' => 'us',
                            'name' => 'English',
                            'flag' => $assetBase . '/images/Flags/united-states.png'
                        ],
                        [
                            'code' => 'bd',
                            'name' => 'Bengali',
                            'flag' => $assetBase . '/images/Flags/bangladesh.png'
                        ]
                    ]
                ]),
                'description' => 'Top bar configuration with contact info, languages and social links',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Navbar Logo
            [
                'key' => 'navbar_logo',
                'value' => json_encode([
                    'src' => $assetBase . '/images/Icon.svg',
                    'alt' => 'DUS Logo',
                    'className' => 'h-17.5 w-auto',
                    'href' => '/'
                ]),
                'description' => 'Navigation bar logo',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Logo
            [
                'key' => 'footer_logo',
                'value' => json_encode([
                    'src' => $assetBase . '/images/Icon-bottom.svg',
                    'alt' => 'DUS Logo',
                    'className' => 'h-41.25 w-auto'
                ]),
                'description' => 'Footer logo',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Description
            [
                'key' => 'footer_description',
                'value' => json_encode('A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society'),
                'description' => 'Footer description text',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Address
            [
                'key' => 'footer_address',
                'value' => json_encode([
                    'title' => 'Address',
                    'details' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207'
                ]),
                'description' => 'Footer address block',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Contact
            [
                'key' => 'footer_contact',
                'value' => json_encode([
                    'title' => 'Call',
                    'numbers' => [
                        '+88 01761 493407',
                        '+88 01622 093793 – (In Emergency)',
                        '+88 02 48110362'
                    ]
                ]),
                'description' => 'Footer contact numbers',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Email
            [
                'key' => 'footer_email',
                'value' => json_encode([
                    'title' => 'Email Us',
                    'addresses' => [
                        'dusdhaka@gmail.com',
                        'dus.eddus@gmail.com'
                    ]
                ]),
                'description' => 'Footer email addresses',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Newsletter
            [
                'key' => 'footer_newsletter',
                'value' => json_encode([
                    'title' => 'Subscribe to Our Newsletter',
                    'placeholder' => 'Enter your email address',
                    'buttonText' => 'Subscribe',
                    'apiEndpoint' => '/api/subscribe-newsletter'
                ]),
                'description' => 'Newsletter subscription settings',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Copyright
            [
                'key' => 'footer_copyright',
                'value' => json_encode('© 2026 Dwip Unnayan. All rights reserved.'),
                'description' => 'Copyright text',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Footer Link Icons
            [
                'key' => 'quickLinkLinkIcon',
                'value' => json_encode($assetBase . '/images/link.svg'),
                'description' => 'Icon for quick links',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'ourProgramLinkIcon',
                'value' => json_encode($assetBase . '/images/link.svg'),
                'description' => 'Icon for program links',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('settings')->insert($settings);

        $this->command->info('SettingsTableSeeder completed. Inserted ' . count($settings) . ' settings.');
    }
}
