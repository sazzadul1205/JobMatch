// resources/js/pages/Backend/CMS/Section/components/modals/RenderDataTab.jsx

import React from 'react';
import SectionDataViewer from '../SectionDataViewer';
import HomeBannerEditor from './Editors/HomeBannerEditor';

/**
 * Render Section Data Tab Component
 * Routes to the appropriate editor based on component type
 * 
 * @param {Object} props
 * @param {Object} props.section - The section data
 * @param {boolean} props.hasData - Whether the section has data
 * @param {Function} props.onDataChange - Callback when data changes
 */
const RenderDataTab = ({ section, hasData, onDataChange }) => {
  // Check if data exists
  if (!hasData || !section?.data || Object.keys(section.data).length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Section Data</h3>
          <SectionDataViewer section={section} hasSectionData={hasData} />
        </div>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No data available to edit</p>
          <p className="text-xs mt-1">Data will appear here once the section has content</p>
        </div>
      </div>
    );
  }

  // Route to the appropriate editor based on component type
  const renderEditor = () => {
    switch (section.component) {
      case 'HomeBanner':
        return <HomeBannerEditor
          section={section}
          hasData={hasData}
          onDataChange={onDataChange}
        />;

      // Add more cases for other components here
      // case 'PageBannerSection':
      //   return <PageBannerEditor section={section} hasData={hasData} onDataChange={onDataChange} />;
      // 
      // case 'AboutUsSection':
      //   return <AboutUsEditor section={section} hasData={hasData} onDataChange={onDataChange} />;

      default:
        // Default: show data viewer only
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Section Data</h3>
              <SectionDataViewer section={section} hasSectionData={hasData} />
            </div>
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No editable fields available for this section type</p>
              <p className="text-xs mt-1">Data viewer is available above</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Always show data viewer */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Section Data Viewer</h3>
        <SectionDataViewer section={section} hasSectionData={hasData} />
      </div>

      {/* Editor */}
      {renderEditor()}
    </div>
  );
};

export default RenderDataTab;