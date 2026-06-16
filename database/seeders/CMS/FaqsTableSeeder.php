<?php
// database/seeders/CMS/FaqsTableSeeder.php

namespace Database\Seeders\CMS;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FaqsTableSeeder extends Seeder
{
    public function run()
    {
        // Truncate table first
        Schema::disableForeignKeyConstraints();
        DB::table('faqs')->truncate();
        Schema::enableForeignKeyConstraints();

        $faqs = [
            // FAQs for About page (page_slug: about)
            [
                'page_slug' => 'about',
                'question' => 'What is the mission of DUS?',
                'answer' => 'Our mission is to initiate, activate, promote and facilitate sustainable development of targeted population through capacity building, resource mobilization, networking, lobbying, need assessment, impact analysis, research, evaluation and policy advocacy in order to ensure and protect equal human rights, freedom, justice in all shape of individual, family and community life in all interventional areas.',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'question' => 'When was DUS established?',
                'answer' => 'DUS was formed by a group of young volunteers in 1972, working for victims of the Bangladesh Liberation War of 1971 and the devastating 1970 cyclone. The organization took its structural shape in 1982 and was named Dwip Unnayan Sangstha.',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'question' => 'Where does DUS operate?',
                'answer' => 'DUS primarily operates in the coastal regions of Bangladesh, with a focus on Hatiya Island and surrounding areas in Noakhali district. Our operations extend to Hatiya, Subarnachar, Companyganj, and Noakhali Sadar Upazilas, covering over 50 villages.',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'about',
                'question' => 'How is DUS governed?',
                'answer' => 'DUS has a democratic governance structure with a General Body of 31 members (30% women) and an Executive Committee of 7 members elected for three years. The Executive Director serves as the Chief Executive and Member Secretary of the Executive Committee.',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // FAQs for Projects & Programs page (page_slug: projects-programs)
            [
                'page_slug' => 'projects-programs',
                'question' => 'How can I participate in your programs?',
                'answer' => 'You can participate by becoming a volunteer, donor, or partner organization. Visit our "Get Involved" page or contact our office directly to learn about current opportunities.',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'Who is eligible for micro-finance support?',
                'answer' => 'Our micro-finance program primarily serves poor women, marginal farmers, and small micro-entrepreneurs in coastal communities. Priority is given to landless households and disaster-affected families.',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'How do you ensure program sustainability?',
                'answer' => 'We ensure sustainability through community ownership, capacity building, income generation mechanisms, and partnerships with local government and development organizations like PKSF.',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'Can international donors support your programs?',
                'answer' => 'Yes, we welcome international support. DUS is registered with the NGO Affairs Bureau and can receive foreign donations. Contact us for partnership opportunities.',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'How do you measure program impact?',
                'answer' => 'We conduct regular monitoring, baseline and end-line surveys, impact assessments, and participatory evaluations involving community members to measure our program effectiveness.',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'What geographical areas do you cover?',
                'answer' => 'Our primary focus is Hatiya Island and surrounding coastal areas in Noakhali district, including Subarnachar, Companyganj, and Noakhali Sadar Upazilas.',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'How can I volunteer with DUS?',
                'answer' => 'You can apply through our website\'s volunteer section, attend our orientation sessions, or contact our HR department. We welcome both local and international volunteers.',
                'order' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'projects-programs',
                'question' => 'Are your financial reports publicly available?',
                'answer' => 'Yes, we maintain transparency by publishing annual reports, audit statements, and financial summaries on our website and making them available to stakeholders upon request.',
                'order' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // FAQs for Blogs page (page_slug: blogs)
            [
                'page_slug' => 'blogs',
                'question' => 'What is the mission of your charity?',
                'answer' => 'Any company that is using spreadsheets and emails to manage the people side of their business is wasting time on admin and making life more difficult for themselves. A well-designed HR system like PiHR automates menial tasks allowing business owners to focus on the strategic work of growing the business.',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'Who benefits from your programs?',
                'answer' => 'Our programs benefit underprivileged communities, women and children, disaster-affected families, and landless poor in coastal areas of Bangladesh.',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'Can I make a recurring donation?',
                'answer' => 'Yes, you can make recurring donations monthly, quarterly, or annually. Visit our donation page to set up your recurring contribution.',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'Can I visit the projects I support?',
                'answer' => 'Yes, we welcome donors to visit our project sites. Please contact our office in advance to arrange a visit and meet the communities you are supporting.',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'How can I get involved?',
                'answer' => 'You can get involved by donating, volunteering, sponsoring a child, or becoming a community ambassador. Visit our "Get Involved" page for more details.',
                'order' => 5,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'How can I make a donation?',
                'answer' => 'You can make a donation online through our secure payment portal, bank transfer, or by visiting our office. We accept one-time and recurring donations.',
                'order' => 6,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'How do you maintain accountability?',
                'answer' => 'We maintain transparency through regular audits, annual reports, community feedback mechanisms, and public disclosure of our financial statements.',
                'order' => 7,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'blogs',
                'question' => 'Are donations tax-deductible?',
                'answer' => 'Yes, donations to DUS are tax-deductible under applicable tax laws. You will receive a receipt for your donation for tax purposes.',
                'order' => 8,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // FAQs for Contact page (page_slug: contact)
            [
                'page_slug' => 'contact',
                'question' => 'What are your office hours?',
                'answer' => 'Our offices are open Sunday through Thursday, 9:00 AM to 5:00 PM. We are closed on Fridays and Saturdays.',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'contact',
                'question' => 'How can I reach DUS for emergency support?',
                'answer' => 'For emergency support, please call our emergency hotline at +88 01622 093793. For general inquiries, email dusdhaka@gmail.com or call +88 01761 493407.',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'page_slug' => 'contact',
                'question' => 'Can I visit your head office?',
                'answer' => 'Yes, you can visit our head office at 24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka - 1207. We recommend calling ahead to schedule an appointment.',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('faqs')->insert($faqs);

        $this->command->info('FaqsTableSeeder completed. Inserted ' . count($faqs) . ' FAQs.');
    }
}
