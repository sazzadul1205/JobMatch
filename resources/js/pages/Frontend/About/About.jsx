// resources/js/Pages/Frontend/About/About.jsx

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
        sectionId: 'about-us-banner',
      }
    },
    {
      id: "background",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "backgroundData",
      order: 2,
      customProps: {
        layout: "text-left",
        sectionId: "background",
      }
    },
    {
      id: "vision-and-mission",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "visionAndMissionData",
      order: 3,
      customProps: {
        layout: "text-right",
        sectionId: "vision-and-mission",
        bgColor: "bg-[#F5F5F5]",
      }
    },
    {
      id: "interventional-approaches",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "interventionalData",
      order: 4,
      customProps: {
        layout: "text-left",
        sectionId: "interventional-approaches",
      }
    },
    {
      id: "legal",
      component: "LegalSection",
      enabled: true,
      propName: "legalData",
      dataKey: "legalData",
      order: 5,
      customProps: {}
    },
    {
      id: "evolutionary-changes",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "evolutionaryChangesData",
      order: 6,
      customProps: {
        layout: "text-left",
        sectionId: "evolutionary-changes",
      }
    },
    {
      id: "governance",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "governanceData",
      order: 7,
      customProps: {
        layout: "text-right",
        sectionId: "governance",
        bgColor: "bg-[#F5F5F5]",
      }
    },
    {
      id: "cards",
      component: "CardsSection",
      enabled: true,
      propName: "cardsData",
      dataKey: "cardsData",
      order: 8,
      customProps: {}
    },
    {
      id: "programs-activities",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "programsData",
      order: 9,
      customProps: {
        layout: "text-right",
        sectionId: "programs-activities",
        bgColor: "bg-[#F5F5F5]",
      }
    },
    {
      id: "training",
      component: "HeroFigureSection",
      enabled: true,
      propName: "data",
      dataKey: "trainingData",
      order: 10,
      customProps: {
        layout: "text-left",
        sectionId: "training",
      }
    },
    {
      id: "faq",
      component: "FAQSection",
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 11,
      customProps: {}
    },
  ],
};

const About = ({
  topBarData,
  navbarData,
  footerData,
  storageUrl,
  faqData,
  cardsData,
  legalData,
  bannerData,
  programsData,
  trainingData,
  backgroundData,
  governanceData,
  interventionalData,
  visionAndMissionData,
  evolutionaryChangesData,
}) => {

  // Prepare data mapping
  const pageData = {
    bannerData,
    backgroundData,
    visionAndMissionData,
    interventionalData,
    legalData,
    evolutionaryChangesData,
    governanceData,
    cardsData,
    programsData,
    trainingData,
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
      <Head title="About Us | DUS - Dwip Unnayan Society | Empowering Communities" />

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

export default About;