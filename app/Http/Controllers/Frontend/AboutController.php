<?php
// app/Http/Controllers/Frontend/AboutController.php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
  use SharedDataTrait;

  /**
   * Display the about page
   */
  public function about(): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Banner Data
    $bannerData = [
      'background' => [
        'src' => $asset('AboutUs/9734ab42cfed2d40c8ed08cbc3059b227d9aee8b.jpg'),
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40 lg:bg-black/50',
        'gradient' => 'bg-gradient-to-r from-black/85 via-black/10 to-transparent'
      ],
      'content' => [
        'title' => [
          'text' => 'About Us',
          'className' => 'font-bold leading-tight'
        ],
        'description' => [
          'text' => 'Our mission is to help all the people in need',
          'className' => 'font-normal leading-tight'
        ]
      ],
    ];

    // Vision & Mission Data
    $visionAndMissionData = [
      'section' => [
        'title' => 'Vision, Mission, Goal, Objectives and Core values'
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice leading an equitable and gender balanced communities.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Mission</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Coastal areas of Bangladesh are regularly stricken by natural disasters. Most of the people living here are almost poor. Due to regular natural disasters occurs here inhabitants are lacking asset and resources and they are deepened in illiterate, malnourished and culturally remain backward. DUS believes that optimizing utilization of hidden humane capacity & power and local resources intensively could gradually alleviate this condition. It perceives to bring down all this scope of development affords in an integrated manner so that sustainable livelihood ventures emerge in the community according to their aspiration.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Initiating, activating, promoting and facilitating the sustainable development of the targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protected equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.</p>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About Vision, Mission, Goal',
        'link' => '/about/vision-mission'
      ],
      'image' => [
        'src' => $asset('AboutUs/c9c3585f93806d98cf9e2fbeadccb32a66efb4b5.jpg'),
        'alt' => 'Vision and Mission',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Background Data
    $backgroundData = [
      'section' => [
        'title' => 'Background, Roles and Functions'
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background:</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS, by virtue of its roles, functions and services being visioned and dreamt by the founder and associates, is basically a development and philanthropic organization located at Hatiya Island under Noakhali district in southern Bangladesh. The main focus and concentration of the organization since its inception has been to humanitarian and rehabilitation work for war and cyclone victim affected populations which in the passage of time has turned into integrated socio-economic and sustainable community development services directing towards a just society free from all sorts of exploitation, injustice and deprivation.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Until 1981, DUS has been well-thought-out and recognized as a volunteer initiative for providing aid, relief and rehabilitation related activities and gaining experiences on the said services over last one decade since its inception, the structural based organizational formation took into shape in 1982, announcing its mandate as an association/platform for land development, protection and restoration.</p>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About Functions',
        'link' => '/about/functions'
      ],
      'image' => [
        'src' => $asset('AboutUs/f465fcbdab4004cd25dba4df06b9f8d5f2648620.jpg'),
        'alt' => 'Background',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Legal Data
    $legalData = [
      'background' => [
        'src' => $asset('AboutUs/64065404ef679e54d2dabd90bba3b1744817c578.jpg'),
        'alt' => 'Background'
      ],
      'overlay' => [
        'darkOverlay' => 'bg-black/40',
      ],
      'textBox' => [
        'title' => 'Legal Status and Org.',
        'titleLine2' => 'Affiliations',
        'buttonText' => 'Learn More Affiliations',
        'buttonLink' => '/about/legal-affiliations'
      ]
    ];

    // Interventional Data
    $interventionalData = [
      'section' => [
        'title' => 'Interventional Approaches and DUS Priorities'
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Sustainable Poverty Reduction and Human Development:</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventional unit of GoB is each Household. DUS believes if the member of the HHs are developed then they can play an active role to bring immense changes within their families. As a whole each household take part into the process of socio-economic development of the country.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">This Organization\'s aim to help its member\'s inherent abilities to flourish such a way so that they are endowed with the key to their progress to a sustainable livelihood restoration. With renewed confidence and hope, the poor, then, move ahead and break free from the shackles of multidimensional poverty and indignity and achieve living standards characterized by human freedom and dignity, along with material uplift.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Focus on Landless poor</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS concentrates on the settlement of landless poor families who are victims of major riverbank erosion & affected by several natural disasters like tropical cyclone, salinity, tidal surge etc that are living below poverty line in the coastal district of Bangladesh.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Empowerment of Women</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Over 87% of our target population/beneficiaries are poor women. DUS believes if women are empowered towards right direction, they can play an active role to bring vital changes within their families as well as in the communities.</p>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About Interventional Approaches',
        'link' => '/about/interventional-approaches'
      ],
      'image' => [
        'src' => $asset('AboutUs/d3afc7e94d5609f2c2356758f463ee15af0450fe.jpg'),
        'alt' => 'Interventional Approaches',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Evolutionary Changes Data
    $evolutionaryChangesData = [
      'section' => [
        'title' => 'Evolutionary Changes and Footings'
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1972-1985</h2>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS was formed by a group of young volunteers and started working for the victims of Bangladesh Liberation War of 1971 and devastating 1970 cyclone affected households at Hatiya Island focusing on humanitarian service to mankind</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Relief and rehabilitation program for the victims and initiate disaster management program at local level</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Rehabilitation of 2000 landless river bank eroded farmers in the newly accreted Govt. Khash land</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS turn into an organizational shape and named as Dwip Unnayan Sangstha in 1982</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community Mobilization and revolving credit support to community started in 1984</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with Ministry of Social Services &amp; Welfare.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with NGO Affairs Bureau.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Socio-economic development programs for the poor initiative from 1985</li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1986-2000</h2>
                        <ul class="list-disc pl-5 space-y-2">
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Strengthening Local Govt. bodies through capacity building in good governance, accountancy and resource management supported by IVS/ USAID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Capacity building of Union Parishad and Upazila Parishad for effective disaster management in four coastal district of Bangladesh supported by CARE-Bangladesh &amp; USAID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Island fisheries development project implementation supported by DFID.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Disaster rehabilitation support project implementation supported by AusAid/Oxfam-America/Oxfam-UK, Oxfam-Hong Kong British ODA</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Cyclone shelter Construction supported by CAA Australia</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Housing support for poor supported by British ODA/CARE-Bangladesh/AusAid</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livestock development for poor supported by DANIDA, CIDA</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Integrated Socio-economic development program supported by Oxfam-UK</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Emergency Relief and Rehabilitation for Cyclone in coastal islands supported by Oxfam-UK, British ODA, CARE-Bangladesh</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livelihood Rehabilitation for Flood Affected Fisheries Households in Hatiya Island supported by DFID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Flood 98 Rehabilitation program supported by DFID, Oxfam-GB</li>
                        </ul>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About 2001 - 2020',
        'link' => '/about/evolutionary-changes'
      ],
      'image' => [
        'src' => $asset('AboutUs/962bd5ee9dacf1f4261d0592856f5716dcffb725.jpg'),
        'alt' => 'Evolutionary Changes',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Governance Data
    $governanceData = [
      'section' => [
        'title' => 'Governance'
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public-private participation to achieve its goal, purpose and objectives and accordingly the internal management system has been framed comprising the following structures:</p>
                    
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">General Body</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The General Body consists of 31 members who are the permanent resident of the coastal community. Of them 30% are women. The social and professional status of the members include teachers, lawyers, social workers, freedom fighters and community leaders.</p>
                    </div>
                    
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Executive Committee</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS has an Executive Committee of 7 members duly elected by the General Body for a period of three years. DUS is represented by its Executive Director who is the Member Secretary of the Executive Committee. ED and his core staff members are appointed by the board. Executive Director is treated as the Chief Executive of the organization. The Executive Director is the overall authority to implement the projects and programs on behalf of the Executive Committee.</p>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About Governance',
        'link' => '/about/governance'
      ],
      'image' => [
        'src' => $asset('AboutUs/ce88efc81f8b1fe8d4f757eba85f05717acb68e4.jpg'),
        'alt' => 'Governance',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Cards Data
    $cardsData = [
      'section' => [
        'title' => 'Cards Section'
      ],
      'cards' => [
        [
          'id' => 'operational-areas',
          'image' => [
            'src' => $asset('AboutUs/image.png'),
            'alt' => 'Operational Areas',
            'className' => 'mx-auto object-contain'
          ],
          'title' => 'Operational Areas',
          'buttonText' => 'Explore Our Areas of Operation',
          'buttonLink' => '/about/operational-areas',
          'bgColor' => 'bg-[#F5F5F5]',
          'cardBgColor' => 'bg-white'
        ],
        [
          'id' => 'achievements',
          'image' => [
            'src' => $asset('AboutUs/fcbbf1e10ca75bccf6a608e1de01306d56897811.png'),
            'alt' => 'Our Achievements',
            'className' => 'mx-auto object-contain'
          ],
          'title' => 'Our Achievements',
          'buttonText' => 'Explore Our Evolution',
          'buttonLink' => '/about/achievements',
          'bgColor' => 'bg-[#F5F5F5]',
          'cardBgColor' => 'bg-white'
        ]
      ]
    ];

    // Programs Data
    $programsData = [
      'section' => [
        'title' => 'Programs/Activities',
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Micro-Finance Program</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass rote level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Jagoron</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Jagoron is the name of a credit instrument of PKSF to initiate household based enterprise development in Bangladesh. As a Partner Organization of PKSF, DUS is implementing this program which is now comprised with Rural Micro finance and Urban Micro finance. Rural Micro finance is that types of loan which allows rural women to finance their small scale agriculture production at homestead level.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">RMC Loans are allowed as working capital loans to promote poor and disadvantaged households in income earnings. RMC loan range from 10K to 59K to allowed for one year and service charge is 24% (Reducing Balancing Method)/12.0% (Flat Rate Method) per year. The weekly savings of RMC members are 10/= per week.</p>
                    </div>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About Programs',
        'link' => '/about/programs-activities'
      ],
      'image' => [
        'src' => $asset('AboutUs/8235fc0d0e2c3082be7cb9ba5d6f5502a121d0ff.jpg'),
        'alt' => 'Programs',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // Training Data
    $trainingData = [
      'section' => [
        'title' => 'Training and Other Facilities',
      ],
      'content' => [
        'html' => '
                <div class="space-y-6">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes that training is a key element of the development approach which focuses on people and their participation. Training has been introduced as an essential element of DUS\'s intervention strategy.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS takes up need based training programs, prepares module and training curriculum. The training programs generally involve flip chart, posters, handouts, cards &amp; charts, audiocassettes, videocassettes, original model, curriculum, modules, photographs etc. DUS has already developed a training and communication Unit fully equipped with all possible physical and human resources. DUS is organized different type of training since last two decades:</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS is organized different type of training for its staffs as well as beneficiaries. DUS always prepare its yearly training plan which is incorporated basic skill development training for staffs, MIS, ToT general, Branch management and Finance management etc.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS conducts it\'s skill development training through identification of people who need skill training. This is done by conducting survey to identify marketable skills, developing modules of livelihood skills program, conducting training to the selected people, select graduates of the skill program to receive capital, linking other graduates to employment or credit program, following up the graduates to see whether they are able to achieve sustainable livelihood. The skills training programs include tree nursery management, sustainable agriculture, poultry and cattle rearing etc.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Leadership development training is a very important intervention of DUS. Leadership development training is intended for the group members under different project interventions. The training programs focus financial management of community fund, conflict management, and bottom-up planning for sustainable rural livelihoods.</p>
                </div>
            '
      ],
      'btn' => [
        'text' => 'Learn More About DUS Facilities',
        'link' => '/about/facilities'
      ],
      'image' => [
        'src' => 'https://placehold.co/730x730',
        'alt' => 'Training Facilities',
        'className' => 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl'
      ]
    ];

    // FAQ Data
    $faqData = [
      'section' => [
        'title' => 'Key Questions Answered About Our Us',
        'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s mission, projects, and how to help.'
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

    return Inertia::render('Frontend/About/About', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getAboutSectionConfig(),
        'bannerData' => $bannerData,
        'visionAndMissionData' => $visionAndMissionData,
        'backgroundData' => $backgroundData,
        'legalData' => $legalData,
        'interventionalData' => $interventionalData,
        'evolutionaryChangesData' => $evolutionaryChangesData,
        'governanceData' => $governanceData,
        'cardsData' => $cardsData,
        'programsData' => $programsData,
        'trainingData' => $trainingData,
        'faqData' => $faqData,
      ]
    ));
  }

  /**
   * Display about details-page dynamically based on slug
   */
  public function aboutDetails(string $slug): Response
  {
    $asset = function ($path) {
      return route('asset', ['path' => ltrim($path, '/')]);
    };

    // Map slugs to the data from the about page
    $subPageData = $this->getAboutSubPageData($asset, $slug);

    // Check if the slug exists
    if (!isset($subPageData[$slug])) {
      abort(404, 'Page not found');
    }

    $pageData = $subPageData[$slug];

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
          'text' => $pageData['title'],
          'className' => 'font-bold leading-tight'
        ],
      ],
    ];

    // FAQ Data
    $faqData = [
      'section' => [
        'title' => 'Key Questions Answered About Our Us',
        'subtitle' => 'Explore our Frequently Asked Questions for answers about our charity\'s mission, projects, and how to help.'
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

    // Upcoming Events Data
    $upcomingEventsData = [
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

    return Inertia::render('Frontend/AboutDetails/AboutDetails', array_merge(
      $this->getSharedData(),
      [
        'sectionConfig' => $this->getAboutDetailsSectionConfig($slug),
        'slug' => $slug,
        'faqData' => $faqData,
        'subPageData' => $pageData,
        'bannerData' => $bannerData,
        'upcomingEventsData' => $upcomingEventsData,
      ]
    ));
  }

  /**
   * Get About page section configuration
   */
  private function getAboutSectionConfig(): array
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
          'customProps' => ['sectionId' => 'about-us-banner']
        ],
        [
          'id' => 'background',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'backgroundData',
          'order' => 2,
          'customProps' => ['layout' => 'text-left', 'sectionId' => 'background']
        ],
        [
          'id' => 'vision-and-mission',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'visionAndMissionData',
          'order' => 3,
          'customProps' => ['layout' => 'text-right', 'sectionId' => 'vision-and-mission', 'bgColor' => 'bg-[#F5F5F5]']
        ],
        [
          'id' => 'interventional-approaches',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'interventionalData',
          'order' => 4,
          'customProps' => ['layout' => 'text-left', 'sectionId' => 'interventional-approaches']
        ],
        [
          'id' => 'legal',
          'component' => 'LegalSection',
          'enabled' => true,
          'propName' => 'legalData',
          'dataKey' => 'legalData',
          'order' => 5,
          'customProps' => []
        ],
        [
          'id' => 'evolutionary-changes',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'evolutionaryChangesData',
          'order' => 6,
          'customProps' => ['layout' => 'text-left', 'sectionId' => 'evolutionary-changes']
        ],
        [
          'id' => 'governance',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'governanceData',
          'order' => 7,
          'customProps' => ['layout' => 'text-right', 'sectionId' => 'governance', 'bgColor' => 'bg-[#F5F5F5]']
        ],
        [
          'id' => 'cards',
          'component' => 'CardsSection',
          'enabled' => true,
          'propName' => 'cardsData',
          'dataKey' => 'cardsData',
          'order' => 8,
          'customProps' => []
        ],
        [
          'id' => 'programs-activities',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'programsData',
          'order' => 9,
          'customProps' => ['layout' => 'text-right', 'sectionId' => 'programs-activities', 'bgColor' => 'bg-[#F5F5F5]']
        ],
        [
          'id' => 'training',
          'component' => 'HeroFigureSection',
          'enabled' => true,
          'propName' => 'data',
          'dataKey' => 'trainingData',
          'order' => 10,
          'customProps' => ['layout' => 'text-left', 'sectionId' => 'training']
        ],
        [
          'id' => 'faq',
          'component' => 'FAQSection',
          'enabled' => true,
          'propName' => 'faqData',
          'dataKey' => 'faqData',
          'order' => 11,
          'customProps' => []
        ],
      ],
    ];
  }

  /**
   * Get About Details page section configuration
   */
  private function getAboutDetailsSectionConfig(string $slug): array
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
          'customProps' => ['sectionId' => "about-{$slug}-banner"]
        ],
        [
          'id' => 'main-content',
          'component' => 'ContentSection',
          'isSpecialComponent' => true,
          'enabled' => true,
          'order' => 2,
          'customProps' => [
            'bgColor' => 'bg-white',
            'paddingY' => 'py-37.5',
            'paddingX' => 'px-100',
            'sectionId' => 'main-content'
          ]
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
   * Get About sub-page data
   */
  private function getAboutSubPageData($asset, string $slug): array
  {
    return [
      'vision-mission' => [
        'title' => 'Vision, Mission, Goal, Objectives and Core values',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Vision</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS dreams the existence of a society free from all sorts of exploitation where everyone irrespective of class, creed and cast will enjoy equal rights, freedom and justice leading an equitable and gender balanced communities.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Mission</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Coastal areas of Bangladesh are regularly stricken by natural disasters. Most of the people living here are almost poor. Due to regular natural disasters occurs here inhabitants are lacking asset and resources and they are deepened in illiterate, malnourished and culturally remain backward. DUS believes that optimizing utilization of hidden humane capacity & power and local resources intensively could gradually alleviate this condition. It perceives to bring down all this scope of development affords in an integrated manner so that sustainable livelihood ventures emerge in the community according to their aspiration.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Initiating, activating, promoting and facilitating the sustainable development of the targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protected equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.</p>
                    </div>
                </div>
            '
      ],
      'functions' => [
        'title' => 'Background, Roles and Functions',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Background:</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The emergence and existence of Dwip Unnayan Songstha (Island Development Association)- DUS was based upon asserting the victims of The Liberation War in 1971 as well as providing immediate relief support to the worse suffer being affected by the devastating cyclone flown over the coastal areas of Bangladesh in 1970.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS, by virtue of its roles, functions and services being visioned and dreamt by the founder and associates, is basically a development and philanthropic organization located at Hatiya Island under Noakhali district in southern Bangladesh. The main focus and concentration of the organization since its inception has been to humanitarian and rehabilitation work for war and cyclone victim affected populations which in the passage of time has turned into integrated socio-economic and sustainable community development services directing towards a just society free from all sorts of exploitation, injustice and deprivation.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Until 1981, DUS has been well-thought-out and recognized as a volunteer initiative for providing aid, relief and rehabilitation related activities and gaining experiences on the said services over last one decade since its inception, the structural based organizational formation took into shape in 1982, announcing its mandate as an association/platform for land development, protection and restoration.</p>
                    </div>
                </div>
            '
      ],
      'legal-affiliations' => [
        'title' => 'Legal Status and Organizational Affiliations',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Legal Status</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS is a registered organization with the Ministry of Social Services & Welfare and NGO Affairs Bureau. The organization operates under the Societies Registration Act and complies with all government regulations for NGOs in Bangladesh.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Organizational Affiliations</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS maintains affiliations with various national and international organizations including PKSF, CUP, ALRD, CGG, BNNRC, and Disaster Forum Bangladesh.</p>
                    </div>
                </div>
            '
      ],
      'interventional-approaches' => [
        'title' => 'Interventional Approaches and DUS Priorities',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Sustainable Poverty Reduction and Human Development:</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">The development interventional unit of GoB is each Household. DUS believes if the member of the HHs are developed then they can play an active role to bring immense changes within their families. As a whole each household take part into the process of socio-economic development of the country.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">This Organization\'s aim to help its member\'s inherent abilities to flourish such a way so that they are endowed with the key to their progress to a sustainable livelihood restoration. With renewed confidence and hope, the poor, then, move ahead and break free from the shackles of multidimensional poverty and indignity and achieve living standards characterized by human freedom and dignity, along with material uplift.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Focus on Landless poor</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS concentrates on the settlement of landless poor families who are victims of major riverbank erosion & affected by several natural disasters like tropical cyclone, salinity, tidal surge etc that are living below poverty line in the coastal district of Bangladesh.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Empowerment of Women</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Over 87% of our target population/beneficiaries are poor women. DUS believes if women are empowered towards right direction, they can play an active role to bring vital changes within their families as well as in the communities.</p>
                    </div>
                </div>
            '
      ],
      'evolutionary-changes' => [
        'title' => 'Evolutionary Changes and Footings',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1972-1985</h2>
                        <ul class="list-disc pl-5 space-y-2 mb-4">
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS was formed by a group of young volunteers and started working for the victims of Bangladesh Liberation War of 1971 and devastating 1970 cyclone affected households at Hatiya Island focusing on humanitarian service to mankind</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Relief and rehabilitation program for the victims and initiate disaster management program at local level</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Rehabilitation of 2000 landless river bank eroded farmers in the newly accreted Govt. Khash land</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS turn into an organizational shape and named as Dwip Unnayan Sangstha in 1982</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Community Mobilization and revolving credit support to community started in 1984</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with Ministry of Social Services &amp; Welfare.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Registered with NGO Affairs Bureau.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Socio-economic development programs for the poor initiative from 1985</li>
                        </ul>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Year 1986-2000</h2>
                        <ul class="list-disc pl-5 space-y-2">
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Strengthening Local Govt. bodies through capacity building in good governance, accountancy and resource management supported by IVS/ USAID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Capacity building of Union Parishad and Upazila Parishad for effective disaster management in four coastal district of Bangladesh supported by CARE-Bangladesh &amp; USAID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Island fisheries development project implementation supported by DFID.</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Disaster rehabilitation support project implementation supported by AusAid/Oxfam-America/Oxfam-UK, Oxfam-Hong Kong British ODA</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Cyclone shelter Construction supported by CAA Australia</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Housing support for poor supported by British ODA/CARE-Bangladesh/AusAid</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livestock development for poor supported by DANIDA, CIDA</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Integrated Socio-economic development program supported by Oxfam-UK</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Emergency Relief and Rehabilitation for Cyclone in coastal islands supported by Oxfam-UK, British ODA, CARE-Bangladesh</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Livelihood Rehabilitation for Flood Affected Fisheries Households in Hatiya Island supported by DFID</li>
                            <li class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Flood 98 Rehabilitation program supported by DFID, Oxfam-GB</li>
                        </ul>
                    </div>
                </div>
            '
      ],
      'governance' => [
        'title' => 'Governance Structure',
        'content' => '
                <div class="space-y-6">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes in democratic practice and public-private participation to achieve its goal, purpose and objectives and accordingly the internal management system has been framed comprising the following structures:</p>
                    
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">General Body</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">The General Body consists of 31 members who are the permanent resident of the coastal community. Of them 30% are women. The social and professional status of the members include teachers, lawyers, social workers, freedom fighters and community leaders.</p>
                    </div>
                    
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Executive Committee</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">DUS has an Executive Committee of 7 members duly elected by the General Body for a period of three years. DUS is represented by its Executive Director who is the Member Secretary of the Executive Committee. ED and his core staff members are appointed by the board. Executive Director is treated as the Chief Executive of the organization. The Executive Director is the overall authority to implement the projects and programs on behalf of the Executive Committee.</p>
                    </div>
                </div>
            '
      ],
      'operational-areas' => [
        'title' => 'Operational Areas of DUS',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-6">DUS primarily operates in the coastal regions of Bangladesh, with a focus on Hatiya Island and surrounding areas in Noakhali district. Our operations extend to various Upazilas including:</p>
                        <ul class="list-disc pl-6 space-y-3 mb-8">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Hatiya Upazila</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Subarnachar Upazila</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Companyganj Upazila</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Noakhali Sadar</li>
                        </ul>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">We work in over 50 villages, reaching more than 40,000 households through our various programs and interventions.</p>
                    </div>
                </div>
            '
      ],
      'achievements' => [
        'title' => 'Our Achievements',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <p class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed mb-6">Over the years, DUS has achieved significant milestones in community development:</p>
                        <ul class="list-disc pl-6 space-y-3">
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Successfully provided micro-credit to over 40,000+ group members</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Empowered 97% female beneficiaries through financial inclusion</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Established Community Radio for coastal communities</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Implemented climate adaptation programs in disaster-prone areas</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Provided WATSAN services to thousands of households</li>
                            <li class="font-400 text-base sm:text-lg lg:text-xl text-[#333333] leading-relaxed">Received recognition from government and international partners</li>
                        </ul>
                    </div>
                </div>
            '
      ],
      'programs-activities' => [
        'title' => 'Programs & Activities',
        'content' => '
                <div class="space-y-6">
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Micro-Finance Program</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Micro finance Program is the core program of all DUS activities. DUS has been implementing its major program in partnership with Palli Karma Sahayak Foundation (PKSF) since 2000. It provides collateral free micro-credit to its around 40K+ group members where 97 percent are female. Under this program, DUS has savings scheme for poor women who has no access in mainstream banks due to lack of capital and assets.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Most of the targeted beneficiaries of DUS are poor women, marginal farmers and small micro entrepreneurs. Major borrowers are women who used these loan funds to promote various income generating activities for their earnings and employments. As a result, micro finance program has positive impact on poverty reduction especially at grass rote level, income enhancement, consumption, the promotion of rural businesses, education and health and finally the empowerment of women and their employment in rural island communities.</p>
                    </div>
                    <div>
                        <h2 class="font-700 text-xl sm:text-2xl mb-4 text-[#080C14]">Jagoron</h2>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">Jagoron is the name of a credit instrument of PKSF to initiate household based enterprise development in Bangladesh. As a Partner Organization of PKSF, DUS is implementing this program which is now comprised with Rural Micro finance and Urban Micro finance. Rural Micro finance is that types of loan which allows rural women to finance their small scale agriculture production at homestead level.</p>
                        <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">RMC Loans are allowed as working capital loans to promote poor and disadvantaged households in income earnings. RMC loan range from 10K to 59K to allowed for one year and service charge is 24% (Reducing Balancing Method)/12.0% (Flat Rate Method) per year. The weekly savings of RMC members are 10/= per week.</p>
                    </div>
                </div>
            '
      ],
      'facilities' => [
        'title' => 'Training and Other Facilities',
        'content' => '
                <div class="space-y-6">
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS believes that training is a key element of the development approach which focuses on people and their participation. Training has been introduced as an essential element of DUS\'s intervention strategy.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS takes up need based training programs, prepares module and training curriculum. The training programs generally involve flip chart, posters, handouts, cards &amp; charts, audiocassettes, videocassettes, original model, curriculum, modules, photographs etc. DUS has already developed a training and communication Unit fully equipped with all possible physical and human resources. DUS is organized different type of training since last two decades:</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS is organized different type of training for its staffs as well as beneficiaries. DUS always prepare its yearly training plan which is incorporated basic skill development training for staffs, MIS, ToT general, Branch management and Finance management etc.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug mb-4">DUS conducts it\'s skill development training through identification of people who need skill training. This is done by conducting survey to identify marketable skills, developing modules of livelihood skills program, conducting training to the selected people, select graduates of the skill program to receive capital, linking other graduates to employment or credit program, following up the graduates to see whether they are able to achieve sustainable livelihood. The skills training programs include tree nursery management, sustainable agriculture, poultry and cattle rearing etc.</p>
                    <p class="font-400 text-[16px] sm:text-[18px] lg:text-[20px] text-[#333333] leading-snug">Leadership development training is a very important intervention of DUS. Leadership development training is intended for the group members under different project interventions. The training programs focus financial management of community fund, conflict management, and bottom-up planning for sustainable rural livelihoods.</p>
                </div>
            '
      ]
    ];
  }
}
