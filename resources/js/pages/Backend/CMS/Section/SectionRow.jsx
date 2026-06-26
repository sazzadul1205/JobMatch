// resources/js/components/Backend/CMS/Section/SectionRow.jsx

/* eslint-disable import/order */

// React
import React, { useState } from 'react';

// React Icons
import {
  FaGripVertical,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaLayerGroup,
  FaToggleOn,
  FaToggleOff,
  FaArrowUp,
  FaArrowDown,
  FaDatabase,
  FaShareAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

// Utils
import {
  getComponentLabel,
  getDataTableLabel,
  getSectionTypeLabel,
  isBannerSection,
  isSpecialSection,
  isSharedDataSection,
  isFixedSection,
} from './useSectionUtils';

const SectionRow = ({
  section,
  index,
  totalSections,
  canEdit,
  canDelete,
  isReordering,
  deletingId,
  onToggle,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isBanner = isBannerSection(section);
  const isSpecial = isSpecialSection(section);
  const isShared = isSharedDataSection(section);
  const isFixed = isFixedSection(section);
  const typeInfo = getSectionTypeLabel(section);
  const isDeleting = deletingId === section.id;

  const toggleRowExpand = () => setIsExpanded(!isExpanded);

  const rowBgClass = isBanner
    ? 'bg-linear-to-r from-yellow-50/50 to-white border-l-4 border-yellow-500'
    : isSpecial
      ? 'bg-linear-to-r from-purple-50/50 to-white border-l-4 border-purple-500'
      : isShared
        ? 'bg-linear-to-r from-green-50/50 to-white border-l-4 border-green-500'
        : '';

  return (
    <div
      className={`transition-all duration-200 ${isReordering ? 'opacity-75' : ''} ${rowBgClass}`}
      draggable={canEdit && !isFixed}
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      {/* Main Row */}
      <div
        className="p-4 hover:bg-gray-50/50 transition-all duration-200 cursor-pointer"
        onClick={toggleRowExpand}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Drag Handle */}
            {canEdit && !isFixed && (
              <div
                className="cursor-grab text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGripVertical size={16} />
              </div>
            )}
            {isFixed && (
              <div className="w-6 text-center" title="Fixed section - cannot be moved">
                {typeInfo.icon}
              </div>
            )}

            {/* Expand/Collapse Icon */}
            <div className="text-gray-400">
              {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </div>

            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${section.is_enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
              {isShared ? (
                <FaShareAlt className={section.is_enabled ? 'text-green-600' : 'text-gray-400'} size={14} />
              ) : (
                <FaLayerGroup className={section.is_enabled ? 'text-green-600' : 'text-gray-400'} size={14} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900 text-sm">
                  {section.section_key}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                  {getComponentLabel(section.component)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${typeInfo.color}`}>
                  {typeInfo.icon} {typeInfo.label}
                </span>
                {isShared && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <FaShareAlt size={10} />
                    Shared Content
                  </span>
                )}
                {section.data_table && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
                    <FaDatabase size={10} />
                    {getDataTableLabel(section.data_table)}
                  </span>
                )}
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
              <div className="text-xs text-gray-500 truncate">
                Order: {section.display_order} • Data: {section.data_table || 'None'} • Prop: {section.prop_name || 'Default'}
                {isShared && <span className="text-green-600 ml-2">📌 Content managed via Shared Data</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Move Up/Down Buttons */}
            {canEdit && !isFixed && (
              <>
                <button
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0 || isReordering}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Up"
                >
                  <FaArrowUp size={12} />
                </button>
                <button
                  onClick={() => onMoveDown(index)}
                  disabled={index === totalSections - 1 || isReordering}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move Down"
                >
                  <FaArrowDown size={12} />
                </button>
              </>
            )}

            {/* Toggle */}
            <button
              onClick={() => onToggle(section)}
              disabled={!canEdit || isReordering || isFixed}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${section.is_enabled
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${(!canEdit || isReordering || isFixed) ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isFixed ? "This section cannot be disabled" : ""}
            >
              {section.is_enabled ? <FaToggleOn size={12} /> : <FaToggleOff size={12} />}
              {section.is_enabled ? 'On' : 'Off'}
            </button>

            {/* Edit */}
            {canEdit && (
              <button
                onClick={() => onEdit(section)}
                className={`p-1.5 rounded transition-all duration-200 ${isShared
                  ? 'text-gray-400 cursor-not-allowed opacity-50'
                  : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                  }`}
                title={isShared ? "Content is managed via Shared Data interface" : "Edit"}
                disabled={isShared}
              >
                <FaEdit size={14} />
              </button>
            )}

            {/* Delete */}
            {canDelete && !isFixed && (
              <button
                onClick={() => onDelete(section.id)}
                disabled={isDeleting}
                className={`p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-all duration-200 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                title="Delete"
              >
                {isDeleting ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Row Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">ID:</span>
              <span className="ml-2 text-gray-600">{section.id}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Section Key:</span>
              <span className="ml-2 text-gray-600">{section.section_key}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Component:</span>
              <span className="ml-2 text-gray-600">{section.component}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Data Table:</span>
              <span className="ml-2 text-gray-600">{section.data_table || 'None'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Data Key:</span>
              <span className="ml-2 text-gray-600">{section.data_key || 'None'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Prop Name:</span>
              <span className="ml-2 text-gray-600">{section.prop_name || 'Default'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Display Order:</span>
              <span className="ml-2 text-gray-600">{section.display_order}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${section.is_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                {section.is_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-gray-700">Type:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${typeInfo.color}`}>
                {typeInfo.icon} {typeInfo.label}
              </span>
              {isShared && (
                <span className="ml-2 text-xs text-green-600">📌 Shared Data</span>
              )}
              {isFixed && (
                <span className="ml-2 text-xs text-blue-600">🔒 Fixed</span>
              )}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-gray-700">Custom Props:</span>
              <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-x-auto text-xs text-gray-600">
                {JSON.stringify(section.custom_props || {}, null, 2)}
              </pre>
            </div>
            <div className="md:col-span-2 text-xs text-gray-400">
              Created: {section.created_at ? new Date(section.created_at).toLocaleString() : 'N/A'}
              {section.updated_at && ` • Updated: ${new Date(section.updated_at).toLocaleString()}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionRow;