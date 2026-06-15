<?php
// app/Http/Controllers/Frontend/BlogController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the blogs page (frontend public blogs listing)
   */
  public function blogs(): Response
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
          'text' => 'Blog',
          'className' => 'font-bold leading-tight'
        ],
      ],
    ];

    // Main Blog Data
    $mainBlog = $this->getMainBlogData();

    // Blog Posts Data (10 posts as before)
    $blogPosts = $this->getBlogPostsData();

    // FAQ Data
    $faqData = $this->getBlogFaqData();

    return Inertia::render('Frontend/Blogs/Blogs', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getBlogsSectionConfig(),
        'bannerData' => $bannerData,
        'faqData' => $faqData,
        'mainBlog' => $mainBlog,
        'blogPosts' => $blogPosts,
      ]
    ));
  }

  /**
   * Display blog details page
   */
  public function blogDetails(string $slug): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Full blog posts data with HTML content
    $blogPostsData = $this->getFullBlogPostsData();

    // Check if the blog post exists
    if (!isset($blogPostsData[$slug])) {
      abort(404, 'Blog post not found');
    }

    $blogData = $blogPostsData[$slug];

    // All blog posts for related posts (excluding current one)
    $allBlogPosts = $this->getBlogPostsData();

    // Get related blogs (excluding current, limit to 3)
    $relatedBlogs = array_filter($allBlogPosts, function ($post) use ($slug) {
      return $post['slug'] !== $slug;
    });

    // Limit to 3
    $relatedBlogs = array_slice($relatedBlogs, 0, 3);

    // Upcoming Events Data
    $upcomingEventsData = $this->getUpcomingEventsData($asset);

    // Banner Data for blog details page
    $bannerData = [
      'background' => [
        'src' => $asset('OurPrograms/db1b2b6eae5fc260b4204f8257dadbd5a7aa0af7.png'),
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40 lg:bg-black/70',
      ],
    ];

    return Inertia::render('Frontend/BlogDetails/BlogDetails', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getBlogDetailsSectionConfig(),
        'slug' => $slug,
        'bannerData' => $bannerData,
        'blogData' => $blogData,
        'relatedBlogs' => $relatedBlogs,
        'upcomingEventsData' => $upcomingEventsData,
      ]
    ));
  }

  /**
   * Get Blogs page section configuration
   */
  private function getBlogsSectionConfig(): array
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
          'customProps' => ['sectionId' => 'blogs-banner']
        ],
        [
          'id' => 'blog-section',
          'component' => 'BlogSection',
          'enabled' => true,
          // No propName/dataKey - handled by registry config
          'order' => 2,
          'customProps' => []
        ],
        [
          'id' => 'faq',
          'component' => 'FAQSection',
          'enabled' => true,
          'propName' => 'faqData',
          'dataKey' => 'faqData',
          'order' => 3,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get Blog Details page section configuration
   */
  private function getBlogDetailsSectionConfig(): array
  {
    return [
      'sections' => [
        [
          'id' => 'banner',
          'component' => 'BannerSection',
          'isSpecialComponent' => true,
          'enabled' => true,
          'order' => 1,
          'customProps' => []
        ],
        [
          'id' => 'blog-content',
          'component' => 'BlogContentSection',
          'isSpecialComponent' => true,
          'enabled' => true,
          'order' => 2,
          'customProps' => [
            'bgColor' => 'bg-white',
            'paddingY' => 'py-12 lg:py-16',
            'paddingX' => 'px-4'
          ]
        ],
        [
          'id' => 'related-blogs',
          'component' => 'BlogSection',
          'enabled' => true,
          'order' => 3,
          'customProps' => [
            'bgColor' => 'bg-[#F5F5F5]',
            'sectionTitle' => 'Related Blogs'
          ]
        ],
        [
          'id' => 'upcoming-events',
          'component' => 'UpcomingEventsSection',
          'enabled' => true,
          'propName' => 'eventsData',
          'dataKey' => 'upcomingEventsData',
          'order' => 4,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get Main Blog Data for the featured blog post
   */
  private function getMainBlogData(): array
  {
    return [
      'id' => 1,
      'date' => "June 6, 2023",
      'title' => "Invest in Kindness, Reap a Better Future",
      'description' => "Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.",
      'image' => "https://placehold.co/750x450",
      'slug' => "invest-in-kindness-reap-a-better-future",
      'tags' => ["Kindness", "Future", "Investment"],
      'createdBy' => "Admin",
      'timerRead' => "5 min read"
    ];
  }

  /**
   * Get Blog Posts Data (listing page)
   */
  private function getBlogPostsData(): array
  {
    return [
      [
        'id' => 2,
        'date' => "June 5, 2023",
        'title' => "How Technology is Changing Education",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "how-technology-is-changing-education",
        'tags' => ["Technology", "Education", "Innovation"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read"
      ],
      [
        'id' => 3,
        'date' => "June 4, 2023",
        'title' => "Sustainable Living: Small Changes, Big Impact",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "sustainable-living-small-changes-big-impact",
        'tags' => ["Sustainability", "Environment", "Lifestyle"],
        'createdBy' => "Admin",
        'timerRead' => "6 min read"
      ],
      [
        'id' => 4,
        'date' => "June 3, 2023",
        'title' => "The Future of Remote Work",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "the-future-of-remote-work",
        'tags' => ["Work", "Technology", "Future"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read"
      ],
      [
        'id' => 5,
        'date' => "June 2, 2023",
        'title' => "Mental Health Awareness in the Workplace",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "mental-health-awareness-in-the-workplace",
        'tags' => ["Health", "Wellness", "Workplace"],
        'createdBy' => "Admin",
        'timerRead' => "7 min read"
      ],
      [
        'id' => 6,
        'date' => "June 1, 2023",
        'title' => "Innovations in Renewable Energy",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "innovations-in-renewable-energy",
        'tags' => ["Energy", "Innovation", "Sustainability"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read"
      ],
      [
        'id' => 7,
        'date' => "May 31, 2023",
        'title' => "Building a Personal Brand Online",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "building-a-personal-brand-online",
        'tags' => ["Branding", "Marketing", "Career"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read"
      ],
      [
        'id' => 8,
        'date' => "May 30, 2023",
        'title' => "The Art of Effective Communication",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "the-art-of-effective-communication",
        'tags' => ["Communication", "Skills", "Leadership"],
        'createdBy' => "Admin",
        'timerRead' => "6 min read"
      ],
      [
        'id' => 9,
        'date' => "May 29, 2023",
        'title' => "Financial Planning for Young Professionals",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "financial-planning-for-young-professionals",
        'tags' => ["Finance", "Planning", "Career"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read"
      ],
      [
        'id' => 10,
        'date' => "May 28, 2023",
        'title' => "Tech is Changing the World",
        'description' => "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        'image' => "https://placehold.co/420x250",
        'slug' => "tech-is-changing-the-world",
        'tags' => ["Technology", "Innovation", "Future"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read"
      ]
    ];
  }

  /**
   * Get Full Blog Posts Data with detailed HTML content for details page
   */
  private function getFullBlogPostsData(): array
  {
    return [
      'invest-in-kindness-reap-a-better-future' => [
        'id' => 1,
        'date' => "June 6, 2023",
        'title' => "Invest in Kindness, Reap a Better Future",
        'description' => "Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.",
        'image' => "https://placehold.co/750x450",
        'slug' => "invest-in-kindness-reap-a-better-future",
        'tags' => ["Kindness", "Future", "Investment"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read",
        'fullContent' => $this->getInvestInKindnessContent()
      ],
      'how-technology-is-changing-education' => [
        'id' => 2,
        'date' => "June 5, 2023",
        'title' => "How Technology is Changing Education",
        'description' => "Discover how digital tools and innovative technologies are transforming the educational landscape for underprivileged communities.",
        'image' => "https://placehold.co/750x450",
        'slug' => "how-technology-is-changing-education",
        'tags' => ["Technology", "Education", "Innovation"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read",
        'fullContent' => $this->getTechnologyInEducationContent()
      ],
      'sustainable-living-small-changes-big-impact' => [
        'id' => 3,
        'date' => "June 4, 2023",
        'title' => "Sustainable Living: Small Changes, Big Impact",
        'description' => "Learn how simple lifestyle changes can contribute to environmental sustainability and community well-being.",
        'image' => "https://placehold.co/750x450",
        'slug' => "sustainable-living-small-changes-big-impact",
        'tags' => ["Sustainability", "Environment", "Lifestyle"],
        'createdBy' => "Admin",
        'timerRead' => "6 min read",
        'fullContent' => $this->getSustainableLivingContent()
      ],
      'the-future-of-remote-work' => [
        'id' => 4,
        'date' => "June 3, 2023",
        'title' => "The Future of Remote Work",
        'description' => "Exploring how remote work is reshaping the modern workplace and creating new opportunities for professionals worldwide.",
        'image' => "https://placehold.co/750x450",
        'slug' => "the-future-of-remote-work",
        'tags' => ["Work", "Technology", "Future"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read",
        'fullContent' => $this->getRemoteWorkContent()
      ],
      'mental-health-awareness-in-the-workplace' => [
        'id' => 5,
        'date' => "June 2, 2023",
        'title' => "Mental Health Awareness in the Workplace",
        'description' => "Understanding the importance of mental health support and wellness programs in creating a healthy work environment.",
        'image' => "https://placehold.co/750x450",
        'slug' => "mental-health-awareness-in-the-workplace",
        'tags' => ["Health", "Wellness", "Workplace"],
        'createdBy' => "Admin",
        'timerRead' => "7 min read",
        'fullContent' => $this->getMentalHealthContent()
      ],
      'innovations-in-renewable-energy' => [
        'id' => 6,
        'date' => "June 1, 2023",
        'title' => "Innovations in Renewable Energy",
        'description' => "Exploring the latest breakthroughs in solar, wind, and other renewable energy technologies shaping our sustainable future.",
        'image' => "https://placehold.co/750x450",
        'slug' => "innovations-in-renewable-energy",
        'tags' => ["Energy", "Innovation", "Sustainability"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read",
        'fullContent' => $this->getRenewableEnergyContent()
      ],
      'building-a-personal-brand-online' => [
        'id' => 7,
        'date' => "May 31, 2023",
        'title' => "Building a Personal Brand Online",
        'description' => "Strategies and tips for creating a compelling personal brand in the digital age to advance your career.",
        'image' => "https://placehold.co/750x450",
        'slug' => "building-a-personal-brand-online",
        'tags' => ["Branding", "Marketing", "Career"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read",
        'fullContent' => $this->getPersonalBrandContent()
      ],
      'the-art-of-effective-communication' => [
        'id' => 8,
        'date' => "May 30, 2023",
        'title' => "The Art of Effective Communication",
        'description' => "Mastering communication skills to enhance personal and professional relationships in today's interconnected world.",
        'image' => "https://placehold.co/750x450",
        'slug' => "the-art-of-effective-communication",
        'tags' => ["Communication", "Skills", "Leadership"],
        'createdBy' => "Admin",
        'timerRead' => "6 min read",
        'fullContent' => $this->getCommunicationContent()
      ],
      'financial-planning-for-young-professionals' => [
        'id' => 9,
        'date' => "May 29, 2023",
        'title' => "Financial Planning for Young Professionals",
        'description' => "Essential financial planning strategies for young professionals to build wealth and secure their financial future.",
        'image' => "https://placehold.co/750x450",
        'slug' => "financial-planning-for-young-professionals",
        'tags' => ["Finance", "Planning", "Career"],
        'createdBy' => "Admin",
        'timerRead' => "5 min read",
        'fullContent' => $this->getFinancialPlanningContent()
      ],
      'tech-is-changing-the-world' => [
        'id' => 10,
        'date' => "May 28, 2023",
        'title' => "Tech is Changing the World",
        'description' => "How technological innovations are transforming industries, societies, and the way we live and work globally.",
        'image' => "https://placehold.co/750x450",
        'slug' => "tech-is-changing-the-world",
        'tags' => ["Technology", "Innovation", "Future"],
        'createdBy' => "Admin",
        'timerRead' => "4 min read",
        'fullContent' => $this->getTechWorldContent()
      ]
    ];
  }

  /**
   * Get FAQ Data for Blogs page
   */
  private function getBlogFaqData(): array
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

  /**
   * Blog Content Helper Methods
   */

  private function getInvestInKindnessContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with <strong class="text-[#009BE2]">Palli Karma Sahayak Foundation (PKSF)</strong> since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female.</p>
                    
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets. Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs.</p>
                    
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass root level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Power of Microfinance</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Microfinance has proven to be one of the most effective tools for poverty alleviation in developing countries. By providing small loans to those who lack access to traditional banking services, we enable families to start businesses, generate income, and build a better future for their children.</p>
                    
                    <!-- Two Images Side by Side -->
                    <div class="flex flex-col sm:flex-row gap-12 my-8">
                        <img 
                            src="https://placehold.co/460x400" 
                            alt="Microfinance beneficiaries"
                            class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg"
                        />
                        <img 
                            src="https://placehold.co/460x400" 
                            alt="Community empowerment"
                            class="w-full sm:w-115 h-100 object-cover rounded-2xl shadow-lg"
                        />
                    </div>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Success Stories</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Take the story of Fatema, a mother of three from Hatiya Island. With a small loan of BDT 15,000, she started a tailoring business. Today, she employs two other women from her community and has been able to send all her children to school.</p>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6 mb-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Key Impact Statistics</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">40,000+ active group members</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">97% female beneficiaries</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Over 95% loan recovery rate</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Operating in 50+ villages</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">BDT 50+ crore distributed in loans</li>
                        </ul>
                    </div>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Looking Ahead</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As we continue to expand our microfinance program, we remain committed to reaching more underserved communities. Your support helps us create lasting change and build a more equitable future for all.</p>
                    
                </div>
            </div>
        ';
  }

  private function getTechnologyInEducationContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is revolutionizing education in ways we could never have imagined. From digital classrooms to online learning platforms, students now have access to a world of knowledge at their fingertips.</p>
                    
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">In remote areas like Hatiya Island, technology is bridging the gap between rural and urban education. Our <strong class="text-[#009BE2]">Digital Learning Centers</strong> provide students with access to computers, internet connectivity, and online educational resources.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Technological Interventions</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Computer literacy programs for students and teachers</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Online scholarship applications and tracking systems</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Digital libraries with thousands of e-books and resources</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Virtual tutoring and mentorship programs</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Impact So Far</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">1,500+ students trained in basic computer skills</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">50 teachers equipped with digital teaching tools</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">10 community ICT centers established</li>
                        </ul>
                    </div>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Future of Digital Learning</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As we continue to invest in technology-enabled education, we envision a future where every child, regardless of their geographical location, has access to quality learning resources and opportunities for growth.</p>
                </div>
            </div>
        ';
  }

  private function getSustainableLivingContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Sustainable living is not just a trend—it\'s a necessity for our planet\'s future. Small changes in our daily habits can collectively make a significant impact on environmental conservation.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Simple Steps for Sustainable Living</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduce, reuse, and recycle waste materials</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Conserve water and electricity at home</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Support local farmers and sustainable agriculture</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Plant trees and maintain home gardens</li>
                    </ul>
                    
                    <div class="flex flex-col sm:flex-row gap-8 my-8">
                        <img src="https://placehold.co/400x300" alt="Sustainable farming" class="w-full sm:w-1/2 object-cover rounded-2xl" />
                        <img src="https://placehold.co/400x300" alt="Recycling initiative" class="w-full sm:w-1/2 object-cover rounded-2xl" />
                    </div>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Community-Led Initiatives</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">DUS has launched several community-led sustainability projects, including tree planting campaigns, waste management programs, and awareness workshops on environmental conservation. These initiatives not only protect our planet but also create green jobs for local residents.</p>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Our Environmental Achievements</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">10,000+ trees planted in coastal areas</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">50+ community awareness workshops conducted</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">100+ households practicing composting</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getRemoteWorkContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">The COVID-19 pandemic accelerated the adoption of remote work, transforming how businesses operate and how employees balance their professional and personal lives.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Benefits of Remote Work</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Increased flexibility and work-life balance</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Reduced commute time and associated stress</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Access to a global talent pool for employers</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Lower overhead costs for businesses</li>
                    </ul>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Challenges and Solutions</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">While remote work offers many advantages, it also presents challenges such as isolation, communication barriers, and difficulty maintaining work-life boundaries. Companies are addressing these through virtual team-building activities, regular check-ins, and providing resources for home office setups.</p>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Remote Work Statistics</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">74% of professionals expect remote work to become standard</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Companies save an average of $11,000 per remote employee annually</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">85% of businesses plan to continue hybrid work models</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getMentalHealthContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Mental health awareness in the workplace has gained significant attention in recent years, with organizations recognizing the importance of supporting employee well-being.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Common Mental Health Challenges</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Work-related stress and burnout</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Anxiety and depression</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Imposter syndrome</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Work-life balance issues</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Employer Best Practices</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Offer employee assistance programs (EAPs)</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Provide mental health days and flexible schedules</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Train managers in mental health first aid</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Create a stigma-free culture through open dialogue</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getRenewableEnergyContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Renewable energy technologies are advancing rapidly, offering sustainable alternatives to fossil fuels and helping combat climate change.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Latest Innovations</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Solar panel efficiency improvements</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Offshore wind farms</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Tidal and wave energy converters</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Green hydrogen production</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Global Impact</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Renewable energy jobs reached 12 million globally</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Solar and wind are now cheapest energy sources in many regions</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Electric vehicle adoption is accelerating rapidly</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getPersonalBrandContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Building a personal brand online has become essential for career advancement and professional opportunities in the digital age.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Key Elements of Personal Branding</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Define your unique value proposition</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Consistent visual identity across platforms</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Share valuable content regularly</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Engage authentically with your audience</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Platforms for Personal Branding</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">LinkedIn for professional networking</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Twitter for industry commentary</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Medium or personal blog for thought leadership</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">YouTube or podcast for video/audio content</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getCommunicationContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Effective communication is a critical skill that impacts every aspect of our lives, from personal relationships to professional success.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Core Communication Skills</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Active listening and empathy</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Clear and concise messaging</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Non-verbal communication awareness</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Conflict resolution techniques</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Communication in the Digital Age</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Email etiquette and professionalism</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Virtual meeting best practices</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Collaboration tools (Slack, Teams, Zoom)</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Cross-cultural communication</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getFinancialPlanningContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Financial planning is crucial for young professionals to build wealth, achieve financial independence, and secure their future.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Essential Financial Strategies</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Create and stick to a budget</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Build an emergency fund (3-6 months of expenses)</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Pay off high-interest debt aggressively</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Start investing early for compound growth</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Investment Options for Beginners</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">401(k) or employer retirement plans</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Index funds and ETFs</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">High-yield savings accounts</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Real estate investment trusts (REITs)</li>
                        </ul>
                    </div>
                </div>
            </div>
        ';
  }

  private function getTechWorldContent(): string
  {
    return '
            <div class="space-y-6">
                <div>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-4">Technology is fundamentally reshaping our world, from how we work and communicate to how we access information and healthcare.</p>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">Transformative Technologies</h2>
                    <ul class="list-disc pl-6 space-y-3 mb-6">
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Artificial Intelligence and Machine Learning</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Internet of Things (IoT)</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Blockchain and cryptocurrencies</li>
                        <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">5G and edge computing</li>
                    </ul>
                    
                    <div class="bg-white/50 rounded-lg p-6 mt-6">
                        <h3 class="font-600 text-xl sm:text-2xl text-[#080C14] mb-3">Technology Impact by Sector</h3>
                        <ul class="list-disc pl-6 space-y-2">
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Healthcare: Telemedicine and AI diagnostics</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Education: Online learning and VR training</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Finance: Digital payments and robo-advisors</li>
                            <li class="font-400 text-base sm:text-lg text-[#333333]">Transportation: Autonomous vehicles and ride-sharing</li>
                        </ul>
                    </div>
                    
                    <h2 class="font-700 text-2xl sm:text-3xl lg:text-4xl text-[#080C14] mt-8 mb-4">The Future of Technology</h2>
                    <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">As technology continues to evolve, we can expect even more groundbreaking innovations that will further transform our society. The key is to harness these technologies responsibly and ensure they benefit everyone, not just a select few.</p>
                </div>
            </div>
        ';
  }
}
