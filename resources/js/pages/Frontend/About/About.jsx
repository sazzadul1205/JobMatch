// resources/js/Pages/Frontend/About/About.jsx

// Inertia
import { Head } from "@inertiajs/react";
import { Suspense, lazy } from "react";

// Layout
import PublicLayout from '../../../layouts/PublicLayout';

// ============================================
// LAZY LOAD SECTIONS - Only load when needed
// ============================================
const FAQSection = lazy(() => import("../../../Sections/FAQSection/FAQSection"));
const CardsSection = lazy(() => import("../../../Sections/CardsSection/CardsSection"));
const LegalSection = lazy(() => import("../../../Sections/LegalSection/LegalSection"));
const PageBannerSection = lazy(() => import("../../../Sections/BannerSection/PageBannerSection"));
const HeroFigureSection = lazy(() => import("../../../Sections/HeroFigureSection/HeroFigureSection"));

// ============================================
// SECTION ORDER CONFIGURATION (JSON)
// ============================================
const SECTION_ORDER_CONFIG = {
  sections: [
    {
      id: "banner",
      component: PageBannerSection,
      enabled: true,
      propName: "bannerData",
      dataKey: "bannerData",
      order: 1,
      customProps: {
        sectionId: 'about-us-banner',
        // bgColor: '',
        // height: 'h-125 md:h-147.25',
        // paddingY: '',
        // paddingX: '',
      }
    },
    {
      id: "background",
      component: HeroFigureSection,
      enabled: true,
      propName: "data",
      dataKey: "backgroundData",
      order: 2,
      customProps: {
        layout: "text-left",
        sectionId: "background",
        // bgColor: '',
      }
    },
    {
      id: "vision-and-mission",
      component: HeroFigureSection,
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
      component: HeroFigureSection,
      enabled: true,
      propName: "data",
      dataKey: "interventionalData",
      order: 4,
      customProps: {
        layout: "text-left",
        sectionId: "interventional-approaches",
        // bgColor: '',
      }
    },
    {
      id: "legal",
      component: LegalSection,
      enabled: true,
      propName: "legalData",
      dataKey: "legalData",
      order: 5,
      customProps: {
        // bgColor: '',
        // paddingY: '',
        // paddingX: '',
      }
    },
    {
      id: "evolutionary-changes",
      component: HeroFigureSection,
      enabled: true,
      propName: "data",
      dataKey: "evolutionaryChangesData",
      order: 6,
      customProps: {
        layout: "text-left",
        sectionId: "evolutionary-changes",
        // bgColor: '',
      }
    },
    {
      id: "governance",
      component: HeroFigureSection,
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
      component: CardsSection,
      enabled: true,
      propName: "cardsData",
      dataKey: "cardsData",
      order: 8,
      customProps: {
        // bgColor: '',
        // paddingY: '',
        // paddingX: '',
      }
    },
    {
      id: "programs-activities",
      component: HeroFigureSection,
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
      component: HeroFigureSection,
      enabled: true,
      propName: "data",
      dataKey: "trainingData",
      order: 10,
      customProps: {
        layout: "text-left",
        sectionId: "training",
        // bgColor: '',
      }
    },
    {
      id: "faq",
      component: FAQSection,
      enabled: true,
      propName: "faqData",
      dataKey: "faqData",
      order: 11,
      customProps: {
        // bgColor: '',
        // paddingY: '',
        // paddingX: '',
      }
    },
  ],
};

// Loading fallback component
const SectionLoader = () => (
  <div className="w-full py-20 flex justify-center items-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-[#009BE2] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#515151] font-400">Loading section...</p>
    </div>
  </div>
);

const About = ({
  // Shared 
  topBarData,
  navbarData,
  footerData,
  storageUrl,

  // Page Specific Data
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
  const sectionDataMap = {
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
  const getSectionsToRender = () => {
    return SECTION_ORDER_CONFIG.sections
      .filter(section => section.enabled === true)
      .sort((a, b) => a.order - b.order);
  };

  // Get sections to render
  const sectionsToRender = getSectionsToRender();

  return (
    <PublicLayout
      topBarData={topBarData}
      navbarData={navbarData}
      footerData={footerData}
      storageUrl={storageUrl}
    >
      <Head title="About Us | DUS - Dwip Unnayan Society | Empowering Communities" />

      {/* Wrap all lazy sections in Suspense */}
      <Suspense fallback={<SectionLoader />}>
        {sectionsToRender.map((section) => {
          const SectionComponent = section.component;
          const sectionData = sectionDataMap[section.dataKey];

          if (!SectionComponent || !sectionData) {
            console.warn(`Missing component or data for: ${section.id}`);
            return null;
          }

          // Merge the required prop with custom props from config
          const props = {
            [section.propName]: sectionData,
            ...(section.customProps || {})
          };

          return <SectionComponent key={section.id} {...props} />;
        })}
      </Suspense>
    </PublicLayout>
  );
};

export default About;