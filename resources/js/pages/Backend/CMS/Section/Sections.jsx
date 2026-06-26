// resources/js/pages/Backend/CMS/Section/Sections.jsx

/* eslint-disable no-undef */
/* eslint-disable import/order */

import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
  FaPlus,
  FaLayerGroup,
  FaGripVertical,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';

// Auth
import { useAuth } from '../../../../hooks/useAuth';

// Constants
import { BANNER_COMPONENTS, SPECIAL_COMPONENTS } from './sectionConstants';

// Hooks & Utils
import {
  initializeSections,
  getDefaultFormData,
  getFormDataFromSection,
  isBannerSection,
  isSharedDataSection,
  isFixedSection,
  getSectionStats,
} from './useSectionUtils';

// Components
import SectionModal from './SectionModal';
import SectionRow from './SectionRow';

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Sections({ page, sections }) {
  const { hasAnyPermission } = useAuth();
  const canEdit = hasAnyPermission(['sections.update', 'sections.manage']);
  const canCreate = hasAnyPermission(['sections.create', 'sections.manage']);
  const canDelete = hasAnyPermission(['sections.destroy', 'sections.manage']);

  // ============================================================
  // STATE
  // ============================================================

  const [localSections, setLocalSections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [dragError, setDragError] = useState(null);

  const [formData, setFormData] = useState(getDefaultFormData());

  // ============================================================
  // INITIALIZE SECTIONS
  // ============================================================

  useEffect(() => {
    if (sections) {
      setLocalSections(initializeSections(sections));
    }
  }, [sections]);

  // ============================================================
  // PERMISSION CHECK
  // ============================================================

  if (!canEdit && !canCreate && !canDelete) {
    return (
      <AuthenticatedLayout>
        <Head title="Access Denied" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
            <p className="text-gray-500 mt-2">You don&apos;t have permission to manage sections.</p>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // ============================================================
  // SECTION STATS
  // ============================================================

  const stats = getSectionStats(localSections);

  // ============================================================
  // MODAL HANDLERS
  // ============================================================

  const handleOpenCreate = () => {
    setEditingSection(null);
    setFormData(getDefaultFormData(localSections.length));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (section) => {
    if (isSharedDataSection(section)) {
      Swal.fire({
        title: 'Shared Data Section',
        text: "This section's content is managed through the Shared Data management interface. You can only change its position and enable/disable status.",
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }

    setEditingSection(section);
    setFormData(getFormDataFromSection(section));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSection(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = {
      ...formData,
      is_fixed_section: BANNER_COMPONENTS.includes(formData.component) ||
        SPECIAL_COMPONENTS.includes(formData.component) ? true : formData.is_fixed_section,
      is_special_component: SPECIAL_COMPONENTS.includes(formData.component) ? true : formData.is_special_component,
    };

    const url = editingSection
      ? route('backend.cms.sections.update', { pageId: page.id, sectionId: editingSection.id })
      : route('backend.cms.sections.store', page.id);

    router[editingSection ? 'put' : 'post'](url, submitData, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Section ${editingSection ? 'updated' : 'created'} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        setIsModalOpen(false);
        router.reload();
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: error?.message || `Failed to ${editingSection ? 'update' : 'create'} section.`,
        });
        setIsSubmitting(false);
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  // ============================================================
  // DELETE HANDLER
  // ============================================================

  const handleDelete = (sectionId) => {
    if (!canDelete) {
      Swal.fire('Permission Denied', 'You do not have permission to delete sections.', 'error');
      return;
    }

    const section = localSections.find(s => s.id === sectionId);
    if (isFixedSection(section)) {
      Swal.fire({
        title: 'Cannot Delete Section',
        text: isBannerSection(section)
          ? 'Banner sections are required and cannot be deleted.'
          : 'This section is special/fixed and cannot be deleted.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    let deleteMessage = 'This will permanently delete this section configuration.';
    if (isSharedDataSection(section)) {
      deleteMessage = 'This will only delete the section configuration. The shared data content will remain in the Shared Data management interface.';
    }

    Swal.fire({
      title: 'Delete Section?',
      text: deleteMessage,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(sectionId);
        router.delete(route('backend.cms.sections.destroy', { pageId: page.id, sectionId }), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Section deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete section.',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  // ============================================================
  // TOGGLE HANDLER
  // ============================================================

  const handleToggle = (section) => {
    if (!canEdit) {
      Swal.fire('Permission Denied', 'You do not have permission to update sections.', 'error');
      return;
    }

    if (isFixedSection(section)) {
      Swal.fire({
        title: 'Cannot Disable Section',
        text: isBannerSection(section)
          ? 'Banner sections are required and cannot be disabled.'
          : 'This section is special/fixed and cannot be disabled.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    router.put(
      route('backend.cms.sections.update', { pageId: page.id, sectionId: section.id }),
      { ...section, is_enabled: !section.is_enabled },
      {
        preserveScroll: true,
        onSuccess: () => {
          router.reload();
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: `Section ${section.is_enabled ? 'disabled' : 'enabled'} successfully.`,
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error?.message || 'Failed to update section status.',
          });
        },
      }
    );
  };

  // ============================================================
  // DRAG & DROP REORDERING - FIXED
  // ============================================================

  const handleDragStart = (e, index) => {
    const section = localSections[index];
    if (isFixedSection(section)) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Move Section',
        text: isBannerSection(section)
          ? 'Banner sections are fixed and cannot be moved.'
          : 'This section is special/fixed and cannot be moved.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e?.preventDefault();

    // Get drag index from dataTransfer
    const dragData = e?.dataTransfer?.getData('text/plain');
    if (!dragData) return;

    const dragIndex = parseInt(dragData, 10);
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;

    const draggedSection = localSections[dragIndex];
    const dropSection = localSections[dropIndex];

    // Check if either section is fixed
    if (isFixedSection(draggedSection) || isFixedSection(dropSection)) {
      setDragError('Fixed sections cannot be reordered.');
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Reorder',
        text: 'Fixed/special sections are locked and cannot be moved.',
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setDragError(null);

    // Create new order
    const newSections = [...localSections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, removed);

    // Update display_order for all sections
    const updatedSections = newSections.map((section, idx) => ({
      ...section,
      display_order: idx,
    }));

    // Update local state immediately for visual feedback
    setLocalSections(updatedSections);
    setIsReordering(true);

    // Prepare batch update data
    const orders = updatedSections.map((section) => ({
      id: section.id,
      display_order: section.display_order,
    }));

    // Send batch update to server using Inertia post
    router.post(
      route('backend.cms.sections.update-order', page.id),
      { orders },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setIsReordering(false);
          Swal.fire({
            icon: 'success',
            title: 'Reordered!',
            text: 'Section order updated successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          setIsReordering(false);
          // Revert to original order on error
          setLocalSections(initializeSections(sections));
          setDragError('Failed to update order. Changes reverted.');
          const errorMessage = errors?.message || 'Failed to update section order. Changes have been reverted.';
          Swal.fire({
            icon: 'error',
            title: 'Reorder Failed',
            text: errorMessage,
          });
        },
      }
    );
  };

  // ============================================================
  // MOVE UP/DOWN HANDLERS
  // ============================================================

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const section = localSections[index];
    if (isFixedSection(section)) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Move',
        text: 'This section is fixed and cannot be moved.',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    // Simulate a drop at index - 1
    const fakeEvent = {
      preventDefault: () => { },
      dataTransfer: {
        getData: () => index.toString(),
      },
    };
    handleDrop(fakeEvent, index - 1);
  };

  const handleMoveDown = (index) => {
    if (index === localSections.length - 1) return;
    const section = localSections[index];
    if (isFixedSection(section)) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Move',
        text: 'This section is fixed and cannot be moved.',
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    // Simulate a drop at index + 1
    const fakeEvent = {
      preventDefault: () => { },
      dataTransfer: {
        getData: () => index.toString(),
      },
    };
    handleDrop(fakeEvent, index + 1);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AuthenticatedLayout>
      <Head title={`Sections - ${page.name}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100/50 p-6">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href={route('backend.cms.pages.index')}
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                  <span className="text-sm">Back to Pages</span>
                </Link>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Sections - {page.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {stats.bannerCount > 0 && (
                  <span className="text-yellow-600 font-medium">⭐ {stats.bannerCount} banner section{stats.bannerCount > 1 ? 's' : ''} • </span>
                )}
                {stats.specialCount > 0 && (
                  <span className="text-purple-600 font-medium">⚡ {stats.specialCount} special section{stats.specialCount > 1 ? 's' : ''} • </span>
                )}
                {stats.sharedCount > 0 && (
                  <span className="text-green-600 font-medium">🔄 {stats.sharedCount} shared data section{stats.sharedCount > 1 ? 's' : ''} • </span>
                )}
                {stats.total} sections total
                {isReordering && <span className="ml-2 text-blue-600">Saving order...</span>}
                {dragError && <span className="ml-2 text-red-600">{dragError}</span>}
              </p>
            </div>
            {canCreate && (
              <button
                onClick={handleOpenCreate}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} /> Add Section
              </button>
            )}
          </div>

          {/* Sections List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {localSections.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLayerGroup className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No sections found</h3>
                <p className="text-sm text-gray-500 mt-1">Add a section to start building your page.</p>
                {canCreate && (
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaPlus size={14} /> Add Section
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {localSections.map((section, index) => (
                  <SectionRow
                    key={section.id}
                    section={section}
                    index={index}
                    totalSections={localSections.length}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    isReordering={isReordering}
                    deletingId={deletingId}
                    onToggle={handleToggle}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reorder Instructions */}
          {localSections.length > 1 && canEdit && (
            <div className="mt-4 text-xs text-gray-400 flex items-center gap-4 flex-wrap">
              <span>⭐ <span className="text-yellow-600 font-medium">Banner sections</span> are automatically fixed at the top</span>
              <span>⚡ <span className="text-purple-600 font-medium">Special sections</span> are locked and cannot be moved/deleted</span>
              <span>🔄 <span className="text-green-600 font-medium">Shared Data sections</span> content is managed via Shared Data interface (can be moved &amp; deleted)</span>
              <span>💡 Drag the <FaGripVertical className="inline text-gray-400" size={12} /> handle to reorder</span>
              <span>Or use <span className="inline text-gray-400">↑</span> <span className="inline text-gray-400">↓</span> buttons</span>
              <span>🔒 Fixed sections cannot be moved</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingSection={editingSection}
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
      />

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </AuthenticatedLayout>
  );
}