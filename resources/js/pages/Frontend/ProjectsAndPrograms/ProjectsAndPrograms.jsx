// resources/js/Pages/Frontend/ProjectsAndPrograms/ProjectsAndPrograms.jsx

// Inertia
import { Head } from "@inertiajs/react";

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
        sectionId: 'projects-programs-banner',
      }
    },
    {
      id: "our-programs",
      component: "OurProgramsSection",
      enabled: true,
      propName: "programsData",
      dataKey: "ourProgramsData",
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

const ProjectsAndPrograms = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  faqData,
  bannerData,
  ourProgramsData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    ourProgramsData,
    faqData,
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
      <Head title="Projects & Programs | DUS - Dwip Unnayan Society | Empowering Communities" />

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

export default ProjectsAndPrograms;