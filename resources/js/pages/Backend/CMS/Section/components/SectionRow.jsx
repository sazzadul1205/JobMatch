// resources/js/pages/Backend/CMS/Section/components/SectionRow.jsx

// React
import React from 'react';

// Icons
import {
  FaDatabase,
  FaToggleOn,
  FaToggleOff,
  FaChevronDown,
  FaChevronUp,
  FaGripVertical,
  FaEye,
  FaEyeSlash,
  FaShareAlt,
  FaBriefcase,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { BsStack } from 'react-icons/bs';

// Helpers
import { getComponentLabel, getDataTableLabel, getSectionTypeInfo } from '../utils/sectionHelpers';

// Import SectionIndex for preview
import SectionIndex from '../../../../../Sections/SectionIndex';

const SectionRow = ({
  section,
  index,
  totalSections,
  isExpanded,
  isPreviewOpen,
  isReordering,
  isSaving,
  isMovable,
  hasSectionData,
  dataSummary,
  onToggleExpand,
  onTogglePreview,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const typeInfo = getSectionTypeInfo(section);
  const isBanner = section.component === 'HomeBanner' || section.component === 'PageBannerSection';
  const isShared = section.data_table === 'shared_data';
  const isJobs = section.data_table === 'jobs';
  const rowBgClass = isBanner
    ? 'bg-yellow-50/50'
    : section.is_fixed_section
      ? 'bg-blue-50/30'
      : isShared
        ? 'bg-green-50/30'
        : isJobs
          ? 'bg-purple-50/30'
          : '';

  // Check if preview should be shown (not for jobs or shared)
  const canPreview = !isJobs && !isShared;

  return (
    <React.Fragment>
      {/* Main Row */}
      <tr
        className={`hover:bg-gray-50 transition-colors cursor-pointer ${rowBgClass} ${isReordering ? 'opacity-75' : ''}`}
        draggable={isMovable}
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
      >
        {/* Index with Drag Handle */}
        <td className="px-4 py-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            {isMovable ? (
              <span
                className="cursor-grab text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGripVertical size={12} />
              </span>
            ) : (
              <span className="w-4" />
            )}
            <span>{index + 1}</span>
          </div>
        </td>

        {/* Section Key */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${section.is_enabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
              {isShared ? (
                <FaShareAlt className={section.is_enabled ? 'text-green-600' : 'text-gray-400'} size={14} />
              ) : isJobs ? (
                <FaBriefcase className={section.is_enabled ? 'text-purple-600' : 'text-gray-400'} size={14} />
              ) : (
                <BsStack className={section.is_enabled ? 'text-blue-600' : 'text-gray-400'} size={14} />
              )}
            </span>
            <span className="text-sm font-medium text-gray-900">{section.section_key}</span>
            {isBanner && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">⭐</span>
            )}
            {section.is_fixed_section && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">🔒</span>
            )}
            {isShared && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">🔄 Shared</span>
            )}
            {isJobs && (
              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">💼 Jobs</span>
            )}
          </div>
        </td>

        {/* Component */}
        <td className="px-4 py-3">
          <span className="text-sm text-gray-700">{getComponentLabel(section.component)}</span>
          <div className="text-xs text-gray-400">{section.component}</div>
        </td>

        {/* Data Source */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <FaDatabase size={12} className="text-gray-400" />
            <span className="text-sm text-gray-700">{getDataTableLabel(section.data_table)}</span>
            {hasSectionData && (
              <span className="text-xs text-green-600 ml-1">✓</span>
            )}
            <span className="text-xs text-gray-400 ml-1">({dataSummary})</span>
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${section.is_enabled
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
            }`}>
            {section.is_enabled ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
            {section.is_enabled ? 'Active' : 'Inactive'}
          </span>
        </td>

        {/* Type */}
        <td className="px-4 py-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
            <span>{typeInfo.icon}</span>
            {typeInfo.label}
          </span>
        </td>

        {/* Order with Move Buttons & Preview */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(index);
              }}
              disabled={index === 0 || !isMovable || isSaving}
              className={`p-1 rounded transition-all ${index === 0 || !isMovable || isSaving
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title={!isMovable ? 'Fixed section cannot be moved' : 'Move Up'}
            >
              ↑
            </button>
            
            <span className="text-sm text-gray-500">#{section.display_order}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(index);
              }}
              disabled={index === totalSections - 1 || !isMovable || isSaving}
              className={`p-1 rounded transition-all ${index === totalSections - 1 || !isMovable || isSaving
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
              title={!isMovable ? 'Fixed section cannot be moved' : 'Move Down'}
            >
              ↓
            </button>

            {/* Preview Button - Disabled for Jobs and Shared */}
            {canPreview ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePreview(section.id);
                }}
                className={`ml-1 p-1 rounded transition-all ${isPreviewOpen
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                title={isPreviewOpen ? 'Close Preview' : 'Preview Section'}
              >
                {isPreviewOpen ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            ) : (
              <button
                className="ml-1 p-1 rounded text-gray-300 cursor-not-allowed"
                title={isShared ? 'Shared data - Edit in Shared Data Manager' : 'Jobs data - Edit in Job Manager'}
                disabled={true}
              >
                <FaEye size={14} className="opacity-40" />
              </button>
            )}

            {/* Expand/Collapse Data Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(section.id);
              }}
              className="ml-1 text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
              title="View Data"
            >
              {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Data Details Expanded Row */}
      {isExpanded && (
        <tr>
          <td colSpan="7" className="px-4 py-4 bg-gray-50 border-t border-gray-100">
            <div className="overflow-x-auto max-w-full">
              <SectionDetails section={section} hasSectionData={hasSectionData} />
            </div>
          </td>
        </tr>
      )}

      {/* Preview Expanded Row - Only for non-Jobs and non-Shared */}
      {isPreviewOpen && canPreview && (
        <tr>
          <td colSpan="7" className="px-4 py-4 bg-blue-50/30 border-t border-blue-200">
            <div className="space-y-3 w-full max-w-full">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-blue-700">🔍 Preview</span>
                  <span className="text-xs text-blue-500">{section.component}</span>
                </div>
                <button
                  onClick={() => onTogglePreview(section.id)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition"
                >
                  Close Preview ✕
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-inner overflow-hidden border border-blue-100 w-full max-w-full">
                <div className="overflow-x-auto w-full max-w-full">
                  <div className="min-w-full" style={{ minWidth: '100%' }}>
                    <SectionIndex sections={[section]} />
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Shared Data Preview - Special Message */}
      {isPreviewOpen && isShared && (
        <tr>
          <td colSpan="7" className="px-4 py-6 bg-green-50/30 border-t border-green-200">
            <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
              <FaShareAlt className="text-green-500 text-5xl" />
              <h3 className="text-lg font-semibold text-green-700">Shared Data Section</h3>
              <p className="text-gray-600 max-w-md">
                This section uses data from the <strong>Shared Data</strong> system.
                To edit this content, please go to the Shared Data Manager.
              </p>
              <button
                onClick={() => {
                  // eslint-disable-next-line no-undef
                  window.location.href = route('backend.cms.shared.index');
                }}
                className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                <FaExternalLinkAlt size={14} />
                Go to Shared Data Manager
              </button>
            </div>
          </td>
        </tr>
      )}

      {/* Jobs Data Preview - Special Message */}
      {isPreviewOpen && isJobs && (
        <tr>
          <td colSpan="7" className="px-4 py-6 bg-purple-50/30 border-t border-purple-200">
            <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
              <FaBriefcase className="text-purple-500 text-5xl" />
              <h3 className="text-lg font-semibold text-purple-700">Jobs Section</h3>
              <p className="text-gray-600 max-w-md">
                This section displays job listings. The data comes from the <strong>Jobs</strong> system.
                To edit job listings, please go to the Job Listings Manager.
              </p>
              <button
                onClick={() => {
                  // eslint-disable-next-line no-undef
                  window.location.href = route('backend.listing.index');
                }}
                className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <FaExternalLinkAlt size={14} />
                Go to Job Listings
              </button>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

// Sub-component for Section Details
const SectionDetails = ({ section, hasSectionData }) => (
  <div className="space-y-3 w-full max-w-full overflow-x-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm min-w-125">
      <div>
        <span className="font-semibold text-gray-600">ID:</span>
        <span className="ml-2 text-gray-700 break-all">{section.id}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Section Key:</span>
        <span className="ml-2 text-gray-700 break-all">{section.section_key}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Data Table:</span>
        <span className="ml-2 text-gray-700 break-all">{section.data_table || 'None'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Data Key:</span>
        <span className="ml-2 text-gray-700 break-all">{section.data_key || 'None'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Prop Name:</span>
        <span className="ml-2 text-gray-700 break-all">{section.prop_name || 'Default'}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Fixed:</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${section.is_fixed_section ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
          {section.is_fixed_section ? 'Yes' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Special:</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${section.is_special_component ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
          {section.is_special_component ? 'Yes' : 'No'}
        </span>
      </div>
      <div>
        <span className="font-semibold text-gray-600">Created:</span>
        <span className="ml-2 text-gray-500 text-xs break-all">
          {section.created_at ? new Date(section.created_at).toLocaleDateString() : 'N/A'}
        </span>
      </div>
    </div>

    {/* Custom Props */}
    {section.custom_props && Object.keys(section.custom_props).length > 0 && (
      <div>
        <span className="font-semibold text-gray-600 text-sm">Custom Props:</span>
        <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs text-gray-600 max-h-24 w-full">
          {JSON.stringify(section.custom_props, null, 2)}
        </pre>
      </div>
    )}

    {/* Section Data */}
    <div>
      <span className="font-semibold text-gray-600 text-sm flex items-center gap-2">
        <FaDatabase size={12} />
        Section Data:
        {hasSectionData ? (
          <span className="text-xs text-green-600">✓ Available</span>
        ) : (
          <span className="text-xs text-gray-400">No data available</span>
        )}
      </span>
      {hasSectionData && (
        <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs text-gray-600 max-h-48 w-full">
          {JSON.stringify(section.data, null, 2)}
        </pre>
      )}
    </div>
  </div>
);

export default SectionRow;