// resources/js/pages/Backend/CMS/Section/components/modals/RenderDataTab.jsx

import React, { lazy, Suspense } from 'react';

// ===== LAZY LOAD EDITORS =====
// Each editor is loaded only when needed, reducing initial bundle size
const FAQEditor = lazy(() => import('./Editors/FAQEditor'));
const JobsEditor = lazy(() => import('./Editors/JobsEditor'));
const BlogEditor = lazy(() => import('./Editors/BlogEditor'));
const CardsEditor = lazy(() => import('./Editors/CardsEditor'));
const LegalEditor = lazy(() => import('./Editors/LegalEditor'));
const AddressEditor = lazy(() => import('./Editors/AddressEditor'));
const ContentEditor = lazy(() => import('./Editors/ContentEditor'));
const StoriesEditor = lazy(() => import('./Editors/StoriesEditor'));
const AboutUsEditor = lazy(() => import('./Editors/AboutUsEditor'));
const FollowUsEditor = lazy(() => import('./Editors/FollowUsEditor'));
const OurActionEditor = lazy(() => import('./Editors/OurActionEditor'));
const HeroFigureEditor = lazy(() => import('./Editors/HeroFigureEditor'));
const HomeBannerEditor = lazy(() => import('./Editors/HomeBannerEditor'));
const PageBannerEditor = lazy(() => import('./Editors/PageBannerEditor'));
const OurProgramsEditor = lazy(() => import('./Editors/OurProgramsEditor'));
const WhereWeWorkEditor = lazy(() => import('./Editors/WhereWeWorkEditor'));
const ContactReachEditor = lazy(() => import('./Editors/ContactReachEditor'));
const ProgramImpactEditor = lazy(() => import('./Editors/ProgramImpactEditor'));
const ContactOfficeEditor = lazy(() => import('./Editors/ContactOfficeEditor'));
const UpcomingEventsEditor = lazy(() => import('./Editors/UpcomingEventsEditor'));

// ===== LOADING COMPONENT =====
// Shows while editor is being loaded
const EditorLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <p className="text-sm text-gray-500">Loading editor...</p>
    </div>
  </div>
);

// ===== EDITOR MAP =====
// Maps component names to their lazy-loaded editor components
const EDITOR_COMPONENTS = {

  'FAQSection': FAQEditor,
  'JobsSection': JobsEditor,
  'BlogSection': BlogEditor,
  'CardsSection': CardsEditor,
  'LegalSection': LegalEditor,
  'HomeBanner': HomeBannerEditor,
  'StoriesSection': StoriesEditor,
  'ContentSection': ContentEditor,
  'AddressSection': AddressEditor,
  'AboutUsSection': AboutUsEditor,
  'FollowUSSection': FollowUsEditor,
  'OurActionSection': OurActionEditor,
  'HeroFigureSection': HeroFigureEditor,
  'PageBannerSection': PageBannerEditor,
  'WhereWeWorkSection': WhereWeWorkEditor,
  'OurProgramsSection': OurProgramsEditor,
  'ContactReachSection': ContactReachEditor,
  'ContactOfficeSection': ContactOfficeEditor,
  'ProgramImpactSection': ProgramImpactEditor,
  'UpcomingEventsSection': UpcomingEventsEditor,
};

/**
 * Render Section Data Tab Component
 * Routes to the appropriate editor based on component type
 * Uses lazy loading to improve performance
 */
const RenderDataTab = ({ section, hasData, onDataChange }) => {
  // Check if data exists
  if (!hasData || !section?.data || Object.keys(section.data).length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No data available to edit</p>
          <p className="text-xs mt-1">Data will appear here once the section has content</p>
        </div>
      </div>
    );
  }

  // ===== RENDER EDITOR =====
  // Get the appropriate editor component from the map
  const EditorComponent = EDITOR_COMPONENTS[section.component];

  // If no editor is found for this component type, show fallback
  if (!EditorComponent) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No editable fields available for this section type</p>
          <p className="text-xs mt-1">Data viewer is available above</p>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <div className="space-y-4">
      {/* Lazy Loaded Editor - wrapped in Suspense */}
      <Suspense fallback={<EditorLoader />}>
        <EditorComponent
          section={section}
          hasData={hasData}
          onDataChange={onDataChange}
        />
      </Suspense>
    </div>
  );
};

export default RenderDataTab;