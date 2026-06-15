<?php
// app/Http/Controllers/Frontend/ContactController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the contact us page
   */
  public function contactUs(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Banner Data for sub-page
    $bannerData = [
      'background' => [
        'src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'),
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40 lg:bg-black/50',
        'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
      ],
      'content' => [
        'title' => [
          'text' => "Let's Get in Touch",
          'className' => 'font-bold leading-tight'
        ],
        'description' => [
          'text' => 'Reach out today and let\'s create meaningful, lasting positive change together worldwide',
          'className' => 'font-normal leading-tight'
        ]
      ],
    ];

    // Office data from database or config
    $offices = $this->getOfficesData();

    // Social media links
    $socialItems = $this->getSocialItemsData();

    // Reach section image
    $reachUsImage = $asset('ContactUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg');

    // Office locations for map section
    $officesLocation = $this->getOfficesLocationData($offices);

    // FAQ Data
    $faqData = $this->getContactFaqData();

    // Stories Data
    $storiesData = $this->getStoriesData($asset);

    // Upcoming Events Data
    $upcomingEventsData = $this->getUpcomingEventsData($asset);

    return Inertia::render('Frontend/ContactUs/ContactUs', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getContactUsSectionConfig(),
        'bannerData' => $bannerData,
        'offices' => $offices,
        'socialItems' => $socialItems,
        'reachUsImage' => $reachUsImage,
        'officesLocation' => $officesLocation,
        'faqData' => $faqData,
        'storiesData' => $storiesData,
        'upcomingEventsData' => $upcomingEventsData
      ]
    ));
  }

  /**
   * Get Contact Us page section configuration
   */
  private function getContactUsSectionConfig(): array
  {
    return [
      'sections' => [
        [
          'id' => 'banner',
          'component' => 'PageBannerSection',
          'enabled' => true,
          'propName' => 'bannerData',
          'dataKey' => 'bannerData',
          'order' => 1,
          'customProps' => ['sectionId' => 'contact-us-banner']
        ],
        [
          'id' => 'contact-offices',
          'component' => 'ContactOfficeSection',
          'enabled' => true,
          'propName' => 'offices',
          'dataKey' => 'offices',
          'order' => 2,
          'customProps' => []
        ],
        [
          'id' => 'contact-reach',
          'component' => 'ContactReachSection',
          'enabled' => true,
          'propName' => 'image',
          'dataKey' => 'reachUsImage',
          'order' => 3,
          'customProps' => []
        ],
        [
          'id' => 'follow-us',
          'component' => 'FollowUSSection',
          'enabled' => true,
          'propName' => 'socialItems',
          'dataKey' => 'socialItems',
          'order' => 4,
          'customProps' => []
        ],
        [
          'id' => 'address',
          'component' => 'AddressSection',
          'enabled' => true,
          'propName' => 'officesLocation',
          'dataKey' => 'officesLocation',
          'order' => 5,
          'customProps' => []
        ],
        [
          'id' => 'faq',
          'component' => 'FAQSection',
          'enabled' => true,
          'propName' => 'faqData',
          'dataKey' => 'faqData',
          'order' => 6,
          'customProps' => ['bgColor' => 'bg-white']
        ],
        [
          'id' => 'stories',
          'component' => 'StoriesSection',
          'enabled' => true,
          'propName' => 'storiesData',
          'dataKey' => 'storiesData',
          'order' => 7,
          'customProps' => []
        ],
        [
          'id' => 'upcoming-events',
          'component' => 'UpcomingEventsSection',
          'enabled' => true,
          'propName' => 'eventsData',
          'dataKey' => 'upcomingEventsData',
          'order' => 8,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get Offices Data
   */
  private function getOfficesData(): array
  {
    return [
      [
        'title' => "Head Office",
        'address' => "24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka -1207.",
        'phones' => ["+880 1761-493412", "+880 1781 732352"],
        'emails' => ["dusdhaka@gmail.com", "dus.eddus@gmail.com"],
        'map_url' => "https://www.google.com/maps?q=23.7570,90.3620&output=embed",
        'coordinates' => ['lat' => 23.7570, 'lng' => 90.3620],
        'is_active' => true
      ],
      [
        'title' => "Regional Office",
        'address' => "Delower Commission Road, Sonapur, Sadar, Noakhali",
        'phones' => ["+880 1761-493411", "+880 1761-493414"],
        'emails' => ["dusreg@gmail.com"],
        'map_url' => "https://www.google.com/maps?q=22.8256,91.1039&output=embed",
        'coordinates' => ['lat' => 22.8256, 'lng' => 91.1039],
        'is_active' => false
      ],
      [
        'title' => "Foundation Office",
        'address' => "DUS Centre, Sayedia Bazar, Hatiya, Noakhali",
        'phones' => ["+880 1761-493418", "+880 1673-011347"],
        'emails' => ["dusreg@gmail.com"],
        'map_url' => "https://www.google.com/maps?q=22.4082,91.0909&output=embed",
        'coordinates' => ['lat' => 22.4082, 'lng' => 91.0909],
        'is_active' => false
      ],
    ];
  }

  /**
   * Get Social Items Data
   */
  private function getSocialItemsData(): array
  {
    return [
      ['icon' => 'facebook', 'label' => 'Facebook', 'url' => '#'],
      ['icon' => 'instagram', 'label' => 'Instagram', 'url' => '#'],
      ['icon' => 'linkedin', 'label' => 'LinkedIn', 'url' => '#'],
      ['icon' => 'youtube', 'label' => 'YouTube', 'url' => '#'],
      ['icon' => 'twitter', 'label' => 'X', 'url' => '#'],
    ];
  }

  /**
   * Get Offices Location Data for map section
   */
  private function getOfficesLocationData(array $offices): array
  {
    return array_map(function ($office) {
      return [
        'id' => strtolower(str_replace(' ', '-', $office['title'])),
        'label' => $office['title'],
        'address' => $office['address'],
        'mapUrl' => $office['map_url'],
        'coordinates' => $office['coordinates'],
        'phones' => $office['phones'],
        'emails' => $office['emails'],
      ];
    }, $offices);
  }

  /**
   * Get FAQ Data for Contact page
   */
  private function getContactFaqData(): array
  {
    return [
      'section' => [
        'title' => 'Key Questions Answered About Our Blogs',
        'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s blog content, mission, projects, and how to help.'
      ],
      'faqs' => [
        [
          'id' => 1,
          'question' => 'What is the mission of your charity?',
          'answer' => 'Any company that is using spreadsheets and emails to manage the people side of their business is wasting time on admin and making life more difficult for themselves. A well-designed HR system like PiHR automates menial tasks allowing business owners to focus on the strategic work of growing the business. It improves the recruitment process, enriches payroll management, provides real-time feedback, improves employees, improves data security, helps make decisions.',
        ],
        [
          'id' => 2,
          'question' => 'Who benefits from your programs?',
          'answer' => 'Our programs benefit underprivileged communities, women and children, disaster-affected families, and landless poor in coastal areas of Bangladesh.',
        ],
        [
          'id' => 3,
          'question' => 'Can I make a recurring donation?',
          'answer' => 'Yes, you can make recurring donations monthly, quarterly, or annually. Visit our donation page to set up your recurring contribution.',
        ],
        [
          'id' => 4,
          'question' => 'Can I visit the projects I support?',
          'answer' => 'Yes, we welcome donors to visit our project sites. Please contact our office in advance to arrange a visit and meet the communities you are supporting.',
        ],
        [
          'id' => 5,
          'question' => 'How can I get involved?',
          'answer' => 'You can get involved by donating, volunteering, sponsoring a child, or becoming a community ambassador. Visit our "Get Involved" page for more details.',
        ],
        [
          'id' => 6,
          'question' => 'How can I make a donation?',
          'answer' => 'You can make a donation online through our secure payment portal, bank transfer, or by visiting our office. We accept one-time and recurring donations.',
        ],
        [
          'id' => 7,
          'question' => 'How do you maintain accountability?',
          'answer' => 'We maintain transparency through regular audits, annual reports, community feedback mechanisms, and public disclosure of our financial statements.',
        ],
        [
          'id' => 8,
          'question' => 'Are donations tax-deductible?',
          'answer' => 'Yes, donations to DUS are tax-deductible under applicable tax laws. You will receive a receipt for your donation for tax purposes.',
        ]
      ]
    ];
  }

  /**
   * Get Stories Data for Contact page
   */
  private function getStoriesData($asset): array
  {
    return [
      'section' => [
        'title' => 'Insights, Stories & Impact',
        'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.'
      ],
      'stories' => [
        [
          'id' => 1,
          'image' => $asset('Stories/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'),
          'date' => 'June 6, 2023',
          'title' => 'Invest in Kindness, Reap a Better Future',
          'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
          'link' => '/stories/invest-in-kindness'
        ],
        [
          'id' => 2,
          'image' => $asset('Stories/b3d758bf8cd7985c857cdbe55b5101b105ee9f75.webp'),
          'date' => 'June 6, 2023',
          'title' => 'How to Design a Custom Pool That Perfectly Fits Your Charlotte Backyard',
          'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
          'link' => '/stories/custom-pool-design'
        ],
        [
          'id' => 3,
          'image' => $asset('Stories/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff%20(1).webp'),
          'date' => 'June 6, 2023',
          'title' => 'The Benefits of Mindfulness in Daily Life',
          'description' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry...',
          'link' => '/stories/mindfulness-benefits'
        ],
        [
          'id' => 4,
          'image' => $asset('Stories/3fe55eb9ebcfd7efb80f559a00b8b5a1da0e8c3e.webp'),
          'date' => 'July 15, 2023',
          'title' => 'Empowering Women Through Microfinance',
          'description' => 'Discover how small loans are making a big difference...',
          'link' => '/stories/empowering-women'
        ],
        [
          'id' => 5,
          'image' => $asset('Stories/de90e922c05aa3585b8f65361c306413c3b3d7be.webp'),
          'date' => 'August 2, 2023',
          'title' => 'Building Resilient Communities Against Climate Change',
          'description' => 'Learn about our initiatives to help coastal communities...',
          'link' => '/stories/climate-resilience'
        ],
        [
          'id' => 6,
          'image' => $asset('Stories/f465fcbdab4004cd25dba4df06b9f8d5f2648620.webp'),
          'date' => 'September 10, 2023',
          'title' => 'Providing Clean Water to Remote Villages',
          'description' => 'Access to clean water is a basic human right...',
          'link' => '/stories/clean-water'
        ]
      ]
    ];
  }

  /**
   * Get Upcoming Events Data
   */
  private function getUpcomingEventsData($asset): array
  {
    return [
      'section' => [
        'title' => 'Upcoming Events & Community Actions',
        'description' => 'Read real stories from the field, community experiences, and thought-provoking perspectives that reflect our mission and impact.',
        'button' => [
          'text' => 'Explore All Events',
          'link' => '/events'
        ]
      ],
      'image' => [
        'src' => $asset('UpcomingEvent/8107b01ed92d05bd5a6861d1ca3a78ccbffc6289.webp'),
        'alt' => 'Events Image',
        'className' => 'mt-15 rounded-2xl h-139.25 w-auto'
      ],
      'events' => [
        [
          'id' => 1,
          'date' => [
            'day' => '25',
            'month' => 'Apr',
            'weekday' => 'THU',
            'dayNumber' => '1',
            'time' => '10:30AM'
          ],
          'location' => 'International Convention City Bashundhara - ICCB',
          'title' => 'Participate in our community clean-up day and make a difference together',
          'description' => 'Let\'s shape the future of the food industry together! Participate at the 9th Food Bangladesh Int\'l Expo 2026,',
          'link' => '/events/community-cleanup'
        ],
        [
          'id' => 2,
          'date' => [
            'day' => '28',
            'month' => 'Apr',
            'weekday' => 'SUN',
            'dayNumber' => '2',
            'time' => '02:00PM'
          ],
          'location' => 'Dhaka University Campus - Dhaka',
          'title' => 'Education for All: Scholarship Distribution Ceremony',
          'description' => 'Join us as we distribute scholarships to underprivileged students and celebrate their achievements in pursuing quality education.',
          'link' => '/events/scholarship-ceremony'
        ],
        [
          'id' => 3,
          'date' => [
            'day' => '05',
            'month' => 'May',
            'weekday' => 'MON',
            'dayNumber' => '3',
            'time' => '09:00AM'
          ],
          'location' => 'Hatiya Island Community Center - Noakhali',
          'title' => 'Climate Adaptation Workshop for Coastal Communities',
          'description' => 'Learn sustainable farming techniques and disaster preparedness strategies to combat climate change impacts in coastal areas.',
          'link' => '/events/climate-workshop'
        ]
      ]
    ];
  }
}
