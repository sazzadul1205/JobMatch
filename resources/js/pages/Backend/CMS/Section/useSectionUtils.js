// resources/js/pages/Backend/CMS/Section/useSectionUtils.js

import {
  BANNER_COMPONENTS,
  SPECIAL_COMPONENTS,
  SHARED_DATA_COMPONENTS,
  COMPONENT_DATA_TABLE_MAPPING,
  AVAILABLE_COMPONENTS,
  DATA_TABLES
} from './sectionConstants';

// ============================================================
// SECTION TYPE CHECKERS
// ============================================================

export const isBannerSection = (section) => {
  return BANNER_COMPONENTS.includes(section?.component);
};

export const isSpecialSection = (section) => {
  return SPECIAL_COMPONENTS.includes(section?.component) || section?.is_special_component;
};

export const isSharedDataSection = (section) => {
  return SHARED_DATA_COMPONENTS.includes(section?.component) || section?.is_shared_data;
};

export const isFixedSection = (section) => {
  return isBannerSection(section) || isSpecialSection(section) || section?.is_fixed_section;
};

// ============================================================
// DATA TABLE HELPERS
// ============================================================

export const getDataTableForComponent = (component) => {
  return COMPONENT_DATA_TABLE_MAPPING[component] || '';
};

export const getComponentLabel = (component) => AVAILABLE_COMPONENTS[component] || component;

export const getDataTableLabel = (table) => DATA_TABLES[table] || table || 'None';

// ============================================================
// SECTION TYPE LABEL
// ============================================================

export const getSectionTypeLabel = (section) => {
  if (isBannerSection(section)) {
    return { label: 'Banner', color: 'bg-yellow-100 text-yellow-800', icon: '⭐' };
  }
  if (isSpecialSection(section)) {
    return { label: 'Special', color: 'bg-purple-100 text-purple-700', icon: '⚡' };
  }
  if (isSharedDataSection(section)) {
    return { label: 'Shared Data', color: 'bg-green-100 text-green-700', icon: '🔄' };
  }
  if (section?.is_fixed_section) {
    return { label: 'Fixed', color: 'bg-blue-100 text-blue-700', icon: '🔒' };
  }
  return { label: 'Normal', color: 'bg-gray-100 text-gray-600', icon: '📄' };
};

// ============================================================
// SECTION INITIALIZATION
// ============================================================

export const initializeSections = (sections) => {
  if (!sections) return [];

  const sortedSections = [...sections].sort((a, b) => {
    const aIsBanner = isBannerSection(a);
    const bIsBanner = isBannerSection(b);

    if (aIsBanner && !bIsBanner) return -1;
    if (!aIsBanner && bIsBanner) return 1;
    return a.display_order - b.display_order;
  });

  return sortedSections.map((section, index) => ({
    ...section,
    display_order: index,
    is_fixed_section: BANNER_COMPONENTS.includes(section.component) || SPECIAL_COMPONENTS.includes(section.component) ? true : section.is_fixed_section,
    is_special_component: SPECIAL_COMPONENTS.includes(section.component) ? true : section.is_special_component,
    is_shared_data: SHARED_DATA_COMPONENTS.includes(section.component) ? true : section.is_shared_data,
  }));
};

// ============================================================
// DEFAULT FORM DATA
// ============================================================

export const getDefaultFormData = (sectionsCount = 0) => ({
  section_key: '',
  component: '',
  data_table: '',
  data_key: '',
  prop_name: '',
  display_order: sectionsCount,
  is_enabled: true,
  is_fixed_section: false,
  is_special_component: false,
  is_shared_data: false,
  custom_props: {},
});

export const getFormDataFromSection = (section) => {
  const isBanner = isBannerSection(section);
  const isSpecial = isSpecialSection(section);
  const isShared = isSharedDataSection(section);

  return {
    section_key: section.section_key,
    component: section.component,
    data_table: section.data_table || '',
    data_key: section.data_key || '',
    prop_name: section.prop_name || '',
    display_order: section.display_order,
    is_enabled: section.is_enabled,
    is_fixed_section: isBanner || isSpecial ? true : section.is_fixed_section,
    is_special_component: isSpecial ? true : section.is_special_component,
    is_shared_data: isShared ? true : section.is_shared_data,
    custom_props: section.custom_props || {},
  };
};

// ============================================================
// SECTION STATS
// ============================================================

export const getSectionStats = (sections) => {
  const bannerCount = sections.filter(s => isBannerSection(s)).length;
  const specialCount = sections.filter(s => isSpecialSection(s)).length;
  const sharedCount = sections.filter(s => isSharedDataSection(s)).length;
  
  return { bannerCount, specialCount, sharedCount, total: sections.length };
};