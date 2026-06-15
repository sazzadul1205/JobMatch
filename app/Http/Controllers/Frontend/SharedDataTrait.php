<?php
// app/Http/Controllers/Frontend/SharedDataTrait.php

namespace App\Http\Controllers\Frontend;

trait SharedDataTrait
{
  /**
   * Get shared data for all frontend pages (TopBar, Navbar, Footer)
   */
  public function getSharedData(): array
  {
    // Asset helper function using route
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Top Bar Data
    $topBarData = [
      'contactInfo' => [
        'email' => [
          'text' => 'dus.eddus@gmail.com',
          'icon' => $asset('images/TopBar/Email.svg'),
          'alt' => 'Email'
        ],
        'phone' => [
          'text' => '+880 1761-493412',
          'icon' => $asset('images/TopBar/Phone.svg'),
          'alt' => 'Phone'
        ],
        'hours' => [
          'text' => 'Sun - Thu 9:00AM - 5:00PM',
          'icon' => $asset('images/TopBar/Clock.svg'),
          'alt' => 'Clock'
        ]
      ],
      'languages' => [
        ['code' => 'us', 'name' => 'English', 'flag' => $asset('images/Flags/united-states.png')],
        ['code' => 'bd', 'name' => 'Bengali', 'flag' => $asset('images/Flags/bangladesh.png')],
      ],
      'socialLinks' => [
        ['id' => 1, 'name' => 'Facebook', 'url' => 'https://facebook.com', 'iconName' => 'FaFacebook', 'hoverColor' => 'hover:text-blue-400'],
        ['id' => 2, 'name' => 'Instagram', 'url' => 'https://instagram.com', 'iconName' => 'FaInstagram', 'hoverColor' => 'hover:text-pink-400'],
        ['id' => 3, 'name' => 'Twitter', 'url' => 'https://twitter.com', 'iconName' => 'FaXTwitter', 'hoverColor' => 'hover:text-gray-400'],
        ['id' => 4, 'name' => 'LinkedIn', 'url' => 'https://linkedin.com', 'iconName' => 'FaLinkedin', 'hoverColor' => 'hover:text-blue-500']
      ],
    ];

    // Navbar Data
    $navbarData = [
      'logo' => [
        'src' => $asset('images/Icon.svg'),
        'alt' => 'DUS Logo',
        'className' => 'h-17.5 w-auto',
        'href' => '/'
      ],
      'navLinks' => [
        ['name' => 'Home', 'href' => '/'],
        ['name' => 'About', 'href' => '/about'],
        ['name' => 'Projects & Programs', 'href' => '/projects-programs'],
        ['name' => 'Blogs', 'href' => '/blogs'],
        ['name' => 'Contact Us', 'href' => '/contact'],
      ],
      'button' => [
        'text' => 'Contact Us',
        'href' => '/contact',
        'className' => 'capitalize text-white bg-[#009BE2] hover:bg-[#009BE2]/80 px-6 py-2 rounded-lg transition-colors duration-200'
      ]
    ];

    // Footer Data
    $footerData = [
      'logo' => [
        'src' => $asset('images/Icon-bottom.svg'),
        'alt' => 'DUS Logo',
        'className' => 'h-41.25 w-auto'
      ],
      'description' => 'A Community based philanthropic and development organization emergence/dedicated to sustainable poverty reduction, entrepreneur\'s promotion and capacity building of the underprivileged directing towards a just society',
      'socialLinks' => [
        ['iconName' => 'FaFacebook', 'url' => '#', 'hoverColor' => 'hover:text-blue-400', 'ariaLabel' => 'Facebook'],
        ['iconName' => 'FaInstagram', 'url' => '#', 'hoverColor' => 'hover:text-pink-400', 'ariaLabel' => 'Instagram'],
        ['iconName' => 'FaXTwitter', 'url' => '#', 'hoverColor' => 'hover:text-gray-400', 'ariaLabel' => 'Twitter'],
        ['iconName' => 'FaLinkedin', 'url' => '#', 'hoverColor' => 'hover:text-blue-500', 'ariaLabel' => 'LinkedIn']
      ],
      'address' => [
        'title' => 'Address',
        'details' => '24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207',
      ],
      'contact' => [
        'title' => 'Call',
        'numbers' => [
          '+88 01761 493407',
          '+88 01622 093793 – (In Emergency)',
          '+88 02 48110362'
        ]
      ],
      'email' => [
        'title' => 'Email Us',
        'addresses' => [
          'dusdhaka@gmail.com',
          'dus.eddus@gmail.com'
        ]
      ],
      'quickLinks' => [
        ['name' => 'About Us', 'url' => '/about-us'],
        ['name' => 'Community Radio', 'url' => '/community-radio'],
        ['name' => 'Evaluation', 'url' => '/evaluation'],
        ['name' => 'Working Area', 'url' => '/working-area'],
        ['name' => 'Publication', 'url' => '/publication'],
        ['name' => 'Mission & Visions', 'url' => '/mission-visions'],
        ['name' => 'Blogs', 'url' => '/blogs'],
        ['name' => 'Contact Us', 'url' => '/contact-us']
      ],
      'programs' => [
        ['name' => 'Micro-Finance Program', 'url' => '/programs/micro-finance'],
        ['name' => 'Disaster Management', 'url' => '/programs/disaster-management'],
        ['name' => 'Community Radio', 'url' => '/programs/community-radio'],
        ['name' => 'Education', 'url' => '/programs/education'],
        ['name' => 'ICT for Development', 'url' => '/programs/ict-development'],
        ['name' => 'Health Program', 'url' => '/programs/health'],
        ['name' => 'Livelihood', 'url' => '/programs/livelihood'],
        ['name' => 'Member Facilities', 'url' => '/programs/member-facilities'],
        ['name' => 'Social Development', 'url' => '/programs/social-development'],
        ['name' => 'Legal Support', 'url' => '/programs/legal-support'],
        ['name' => 'Agriculture', 'url' => '/programs/agriculture'],
        ['name' => 'Water and Sanitation', 'url' => '/programs/water-sanitation'],
        ['name' => 'Research and Documentation', 'url' => '/programs/research-documentation'],
        ['name' => 'Training Facilities', 'url' => '/programs/training'],
        ['name' => 'Tourism', 'url' => '/programs/tourism']
      ],
      'newsletter' => [
        'title' => 'Subscribe to Our Newsletter',
        'placeholder' => 'Enter your email address',
        'buttonText' => 'Subscribe',
        'apiEndpoint' => '/api/subscribe-newsletter'
      ],
      'bottomFooter' => [
        'copyright' => '© 2026 Dwip Unnayan. All rights reserved.',
        'links' => [
          ['text' => 'Terms of Service', 'url' => '/terms'],
          ['text' => 'Privacy Policy', 'url' => '/privacy']
        ]
      ],
      'quickLinkLinkIcon' => $asset('images/link.svg'),
      'OurProgramLinkIcon' => $asset('images/link.svg'),
    ];

    return [
      'topBarData' => $topBarData,
      'navbarData' => $navbarData,
      'footerData' => $footerData,
    ];
  }
}
