// resources/js/pages/Backend/CMS/Section/utils/sectionHelpers.js

// Get component label from component name
export const getComponentLabel = (component) => {
  const labels = {
    'HomeBanner': 'Home Banner',
    'PageBannerSection': 'Page Banner',
    'AboutUsSection': 'About Us',
    'OurActionSection': 'Our Actions',
    'WhereWeWorkSection': 'Where We Work',
    'OurProgramsSection': 'Our Programs',
    'StoriesSection': 'Stories',
    'BlogSection': 'Blog',
    'JobsSection': 'Jobs',
    'ProgramImpactSection': 'Program Impact',
    'UpcomingEventsSection': 'Upcoming Events',
    'HeroFigureSection': 'Hero with Figure',
    'CardsSection': 'Cards',
    'FAQSection': 'FAQ',
    'ContactOfficeSection': 'Contact Office',
    'AddressSection': 'Address',
    'ContactReachSection': 'Contact Reach',
    'FollowUSSection': 'Follow Us',
    'LegalSection': 'Legal',
    'ProgramContentSection': 'Program Content',
    'BlogContentSection': 'Blog Content',
    'ContentSection': 'Content',
  };
  return labels[component] || component;
};

// Get data table label
export const getDataTableLabel = (table) => {
  const labels = {
    'custom_section_data': 'Custom Data',
    'shared_data': 'Shared Data',
    'blogs': 'Blogs',
    'programs': 'Programs',
    'about_content': 'About Content',
    'jobs': 'Jobs',  // ✅ This is correct - it's 'jobs' (lowercase)
  };
  return labels[table] || table || 'None';
};

// Get section type info
export const getSectionTypeInfo = (section) => {
  if (section.is_fixed_section) {
    return { label: 'Fixed', color: 'bg-blue-100 text-blue-700', icon: '🔒' };
  }
  if (section.component === 'HomeBanner' || section.component === 'PageBannerSection') {
    return { label: 'Banner', color: 'bg-yellow-100 text-yellow-700', icon: '⭐' };
  }
  if (section.data_table === 'shared_data') {
    return { label: 'Shared', color: 'bg-green-100 text-green-700', icon: '🔄' };
  }
  if (section.data_table === 'jobs') {
    return { label: 'Jobs', color: 'bg-purple-100 text-purple-700', icon: '💼' };
  }
  return { label: 'Normal', color: 'bg-gray-100 text-gray-600', icon: '📄' };
};

// Get section stats
export const getSectionStats = (sections) => {
  return {
    total: sections.length,
    fixed: sections.filter(s => s.is_fixed_section).length,
    banner: sections.filter(s => s.component === 'HomeBanner' || s.component === 'PageBannerSection').length,
    shared: sections.filter(s => s.data_table === 'shared_data').length,
    jobs: sections.filter(s => s.data_table === 'jobs').length,
    hasData: sections.filter(s => s.data !== null && s.data !== undefined).length,
  };
};