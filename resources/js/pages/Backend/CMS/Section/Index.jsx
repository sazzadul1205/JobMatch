/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/Index.jsx

/**
 * Index - Main Section Management Page
 * Features:
 * - Authenticated layout wrapper
 * - Section header with stats
 * - Section table with all sections
 * - Footer with summary
 * - Edit modal for section editing
 * - Add new section modal
 * - Trash button with count badge
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';

// Hooks
import { useSectionHelpers } from './hooks/useSectionHelpers';

// Icons
import { FaPlus, FaTrash } from 'react-icons/fa';

// Components
import SectionTable from './components/SectionTable';
import SectionFooter from './components/SectionFooter';
import SectionHeader from './components/SectionHeader';
import AddSectionModal from './components/AddSectionModal';
import SectionEditModal from './components/SectionEditModal';

// Utils
import { getSectionStats } from './utils/sectionHelpers';

const Index = ({ page, sections: initialSections }) => {
  // Use custom hook for section management
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
    editingSection,
    isEditModalOpen,
    handleEditClick,
    handleEditClose,
    handleEditSuccess,
  } = useSectionHelpers(initialSections, page.id);

  // Calculate statistics for header
  const stats = getSectionStats(sections);

  // State for Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for trashed count
  const [trashedCount, setTrashedCount] = useState(0);

  // Fetch trashed count function - defined before useEffect
  const fetchTrashedCount = useCallback(async () => {
    try {
      const response = await fetch(route('backend.cms.sections.trashed-count', { pageId: page.id }));
      const data = await response.json();
      setTrashedCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching trashed count:', error);
    }
  }, [page.id]);

  // Fetch trashed count on mount
  useEffect(() => {
    fetchTrashedCount();
  }, [fetchTrashedCount]);

  // Handle section deleted/restored - refresh count
  const handleSectionDeleted = useCallback(() => {
    fetchTrashedCount();
    // Reload the page to reflect changes
    window.location.reload();
  }, [fetchTrashedCount]);

  return (
    <AuthenticatedLayout>
      {/* Page Title */}
      <Head title={`Sections - ${page.name}`} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            {/* Header with Stats */}
            <SectionHeader
              page={page}
              sections={sections}
              stats={stats}
              isSaving={isSaving}
              dragError={dragError}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Trash Button */}
            <Link
              href={route('backend.cms.sections.trashed', { pageId: page.id })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200"
            >
              <FaTrash size={14} />
              Trash
              {trashedCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full min-w-5 text-center">
                  {trashedCount}
                </span>
              )}
            </Link>

            {/* Add New Section Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus size={14} />
              Add New Section
            </button>
          </div>
        </div>

        {/* Main Table */}
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
            onEditClick={handleEditClick}
            onSectionDeleted={handleSectionDeleted}
            showTrashed={false}
          />
        </div>

        {/* Footer with Summary */}
        <SectionFooter sections={sections} hasData={hasData} />

        {/* Edit Modal */}
        <SectionEditModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          section={editingSection}
          pageId={page.id}
          onSuccess={handleEditSuccess}
        />

        {/* Create Modal */}
        <AddSectionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          pageId={page.id}
          onSuccess={handleEditSuccess}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;