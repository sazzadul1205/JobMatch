
// resources/js/pages/Backend/CMS/Section/Index.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';

// Hooks
import { useSectionHelpers } from './hooks/useSectionHelpers';

// Components
import SectionHeader from './components/SectionHeader';
import SectionTable from './components/SectionTable';
import SectionFooter from './components/SectionFooter';

// Utils
import { getSectionStats } from './utils/sectionHelpers';

const Index = ({ page, sections: initialSections }) => {
  const {
    sections,
    expandedSections,
    previewSections,
    isReordering,
    dragError,
    isSaving,
    toggleExpand,
    togglePreview,
    hasData,
    getDataSummary,
    canMove,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleMoveUp,
    handleMoveDown,
  } = useSectionHelpers(initialSections, page.id);

  const stats = getSectionStats(sections);

  return (
    <AuthenticatedLayout>
      <Head title={`Sections - ${page.name}`} />

      <div className="p-6">
        <SectionHeader
          page={page}
          sections={sections}
          stats={stats}
          isSaving={isSaving}
          dragError={dragError}
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <SectionTable
            sections={sections}
            expandedSections={expandedSections}
            previewSections={previewSections}
            isReordering={isReordering}
            isSaving={isSaving}
            hasData={hasData}
            getDataSummary={getDataSummary}
            canMove={canMove}
            toggleExpand={toggleExpand}
            togglePreview={togglePreview}
            handleMoveUp={handleMoveUp}
            handleMoveDown={handleMoveDown}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
          />
        </div>

        <SectionFooter sections={sections} hasData={hasData} />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;