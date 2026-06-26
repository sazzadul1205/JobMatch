// resources/js/pages/Backend/CMS/Section/sectionConstants.js

// ============================================================
// AVAILABLE COMPONENTS - Complete list matching SectionController
// ============================================================

export const AVAILABLE_COMPONENTS = {
  'PageBannerSection': 'Page Banner',
  'HomeBanner': 'Home Banner',
  'HeroFigureSection': 'Hero with Figure',
  'CardsSection': 'Cards Section',
  'AboutUsSection': 'About Us Section',
  'OurActionSection': 'Our Action Section',
  'WhereWeWorkSection': 'Where We Work Section',
  'OurProgramsSection': 'Our Programs',
  'StoriesSection': 'Stories Section',
  'BlogSection': 'Blog Section',
  'BlogContentSection': 'Blog Content Section',
  'ProgramContentSection': 'Program Content Section',
  'ContentSection': 'Content Section',
  'FAQSection': 'FAQ Section',
  'UpcomingEventsSection': 'Upcoming Events Section',
  'JobsSection': 'Jobs Section',
  'ProgramImpactSection': 'Program Impact Section',
  'LegalSection': 'Legal Section',
  'ContactOfficeSection': 'Contact Office',
  'AddressSection': 'Address Section',
  'ContactReachSection': 'Contact Reach Section',
  'FollowUSSection': 'Follow Us Section',
};

// ============================================================
// DATA TABLES - Where section data is stored
// ============================================================

export const DATA_TABLES = {
  'custom_section_data': 'Custom Section Data',
  'about_content': 'About Content',
  'blogs': 'Blogs',
  'programs': 'Programs',
  'shared_data': 'Shared Data',
  'jobs': 'Jobs',
};

// ============================================================
// BANNER COMPONENTS - Always appear first
// ============================================================

export const BANNER_COMPONENTS = ['PageBannerSection', 'HomeBanner'];

// ============================================================
// SPECIAL COMPONENTS - Cannot be deleted or moved
// ============================================================

export const SPECIAL_COMPONENTS = ['BlogContentSection', 'ProgramContentSection', 'ContentSection'];

// ============================================================
// SHARED DATA COMPONENTS - Data comes from shared_data table (read-only content)
// ============================================================

export const SHARED_DATA_COMPONENTS = ['FAQSection', 'UpcomingEventsSection'];

// ============================================================
// DATA TABLE MAPPING FOR COMPONENTS
// ============================================================

export const COMPONENT_DATA_TABLE_MAPPING = {
  'BlogContentSection': 'blogs',
  'ProgramContentSection': 'programs',
  'ContentSection': 'about_content',
  'OurProgramsSection': 'programs',
  'BlogSection': 'blogs',
  'FAQSection': 'shared_data',
  'UpcomingEventsSection': 'shared_data',
};