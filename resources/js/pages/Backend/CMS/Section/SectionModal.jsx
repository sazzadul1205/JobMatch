// resources/js/components/Backend/CMS/Sections/SectionModal.jsx

/* eslint-disable import/order */

// React
import React from 'react';

// React Icons
import { FaTimes, FaSave, FaSpinner, FaStar, FaCog, FaShareAlt } from 'react-icons/fa';

// Constants
import {
  AVAILABLE_COMPONENTS,
  DATA_TABLES,
  BANNER_COMPONENTS,
  SPECIAL_COMPONENTS,
  SHARED_DATA_COMPONENTS,
  COMPONENT_DATA_TABLE_MAPPING
} from './sectionConstants';

const SectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingSection,
  formData,
  setFormData,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'component') {
      const isBanner = BANNER_COMPONENTS.includes(value);
      const isSpecial = SPECIAL_COMPONENTS.includes(value);
      const isShared = SHARED_DATA_COMPONENTS.includes(value);

      setFormData(prev => ({
        ...prev,
        [name]: value,
        is_fixed_section: isBanner || isSpecial ? true : prev.is_fixed_section,
        is_special_component: isSpecial ? true : prev.is_special_component,
        is_shared_data: isShared ? true : prev.is_shared_data,
        data_table: isShared ? 'shared_data' : (isSpecial ? COMPONENT_DATA_TABLE_MAPPING[value] : prev.data_table),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleCustomPropsChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData(prev => ({ ...prev, custom_props: parsed }));
    } catch (err) {
      console.error(err);
      // Allow invalid JSON to be edited, but don't update state
    }
  };

  const isBannerSelected = BANNER_COMPONENTS.includes(formData.component);
  const isSpecialSelected = SPECIAL_COMPONENTS.includes(formData.component);
  const isSharedSelected = SHARED_DATA_COMPONENTS.includes(formData.component);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingSection ? 'Edit Section' : 'Add Section'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {editingSection ? 'Update section configuration' : 'Configure a new section for this page'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Section Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="section_key"
              value={formData.section_key}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., banner, about-us, our-programs"
              required
            />
            <p className="text-xs text-gray-400 mt-1">Unique identifier. Use lowercase letters and hyphens.</p>
          </div>

          {/* Component */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Component <span className="text-red-500">*</span>
            </label>
            <select
              name="component"
              value={formData.component}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a component</option>
              {Object.entries(AVAILABLE_COMPONENTS).map(([value, label]) => {
                const isBanner = BANNER_COMPONENTS.includes(value);
                const isSpecial = SPECIAL_COMPONENTS.includes(value);
                const isShared = SHARED_DATA_COMPONENTS.includes(value);
                let prefix = '';
                if (isBanner) prefix = '⭐ ';
                else if (isSpecial) prefix = '⚡ ';
                else if (isShared) prefix = '🔄 ';
                return (
                  <option key={value} value={value}>
                    {prefix}{label} {isShared ? '(Shared Data)' : ''}
                  </option>
                );
              })}
            </select>
            {formData.component && isBannerSelected && (
              <p className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                <FaStar size={10} /> Banner sections are automatically fixed at the top of the page
              </p>
            )}
            {formData.component && isSpecialSelected && (
              <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <FaCog size={10} /> Special component - requires specific data structure
              </p>
            )}
            {formData.component && isSharedSelected && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <FaShareAlt size={10} /> Shared Data component - content is managed via Shared Data interface
              </p>
            )}
          </div>

          {/* Data Table */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Table</label>
            <select
              name="data_table"
              value={formData.data_table}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isSharedSelected}
            >
              <option value="">None</option>
              {Object.entries(DATA_TABLES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {isSharedSelected && (
              <p className="text-xs text-green-600 mt-1">✓ Automatically set to &quot;Shared Data&quot; for this component type</p>
            )}
            <p className="text-xs text-gray-400 mt-1">Where the section data is stored</p>
          </div>

          {/* Data Key & Prop Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Key</label>
              <input
                type="text"
                name="data_key"
                value={formData.data_key}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
                disabled={isSharedSelected}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prop Name</label>
              <input
                type="text"
                name="prop_name"
                value={formData.prop_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Default: data"
                disabled={isSharedSelected}
              />
            </div>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">Banner sections will be automatically placed first</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {[
              { name: 'is_enabled', label: 'Enabled', desc: 'Section will be displayed on the page' },
              { name: 'is_fixed_section', label: 'Fixed Section', desc: 'Section cannot be moved or deleted' },
              { name: 'is_special_component', label: 'Special Component', desc: 'Component requires special handling' },
            ].map(({ name, label, desc }) => {
              const isDisabled = (name === 'is_fixed_section' && (isBannerSelected || isSpecialSelected)) ||
                (name === 'is_special_component' && isSpecialSelected) ||
                (name === 'is_fixed_section' && isSharedSelected);
              return (
                <div key={name} className={`flex items-center justify-between p-3 rounded-lg ${isDisabled ? 'bg-gray-100 opacity-60' : 'bg-gray-50'}`}>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{label}</span>
                    <p className="text-xs text-gray-500">{desc}</p>
                    {isDisabled && (
                      <p className="text-xs text-yellow-600 mt-1">✓ Automatically enabled for this component type</p>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleChange}
                    disabled={isDisabled}
                    className={`w-5 h-5 ${isDisabled ? 'text-gray-400 border-gray-300' : 'text-blue-600 border-gray-300'} rounded`}
                  />
                </div>
              );
            })}
          </div>

          {/* Custom Props */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Props (JSON)</label>
            <textarea
              name="custom_props"
              value={JSON.stringify(formData.custom_props || {}, null, 2)}
              onChange={handleCustomPropsChange}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder='{"key": "value"}'
            />
            <p className="text-xs text-gray-400 mt-1">Enter valid JSON for custom component props</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
            >
              {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
              <FaSave size={16} />
              {editingSection ? (isSubmitting ? 'Updating...' : 'Update Section') : (isSubmitting ? 'Creating...' : 'Create Section')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionModal;