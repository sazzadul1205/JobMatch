// resources/js/Pages/Frontend/Blogs/Blogs.jsx

import React from 'react';

// Inertia
import { Head } from '@inertiajs/react';

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// Components
import DynamicSectionRenderer from '../../../components/Shared/DynamicSectionRenderer';

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: "PageBannerSection",
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {
        sectionId: 'blogs-banner',
      }
    },
    {
      id: "blog-section",
      component: "BlogSection",
      enabled: true,
      // BlogSection is multi-prop, handled by registry config
      order: 2,
      customProps: {}
    },
    {
      id: "faq",
      component: "FAQSection",
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 3,
      customProps: {}
    },
  ],
};

const Blogs = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  bannerData,
  faqData,
  mainBlog,
  blogPosts,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    faqData,
    mainBlog,
    blogPosts,
  };

  // Get enabled sections sorted by order
  const sectionsToRender = SECTION_ORDER_CONFIG.sections
    .filter(section => section.enabled === true)
    .sort((a, b) => a.order - b.order);

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="Blogs | DUS - Dwip Unnayan Society | Empowering Communities" />

      {sectionsToRender.map((section) => (
        <DynamicSectionRenderer
          key={section.id}
          section={section}
          pageData={pageData}
          globalProps={{ storageUrl }}
        />
      ))}
    </PublicLayout>
  );
};

export default Blogs;