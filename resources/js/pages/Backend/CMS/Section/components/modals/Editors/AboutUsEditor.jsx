// resources/js/pages/Backend/CMS/Section/components/modals/Editors/AboutUsEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ImageUpload from './shared/ImageUpload';
import ArrayManager from './shared/ArrayManager';
import { TextField, TextAreaField } from './shared/Fields';
import { useImageUpload } from './shared/useImageUpload';

const AboutUsEditor = ({ section, hasData, onDataChange }) => {
  const initialData = section?.data?.data || section?.data || {};
  const [formData, setFormData] = useState(initialData);

  const image = useImageUpload(initialData?.image?.src || '');

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const updateArrayItem = (path, index, field, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        if (!current[keys[i]]) current[keys[i]] = [];
        if (!current[keys[i]][index]) current[keys[i]][index] = {};
        current[keys[i]][index] = { ...current[keys[i]][index], [field]: value };
      } else {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
    }
    setFormData(newData);
  };

  const addArrayItem = (path, template = {}) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) current[lastKey] = [];

    const newId = Math.max(0, ...current[lastKey].map(item => item.id || 0)) + 1;
    current[lastKey].push({ ...template, id: newId });
    setFormData(newData);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey].splice(index, 1);
    }
    setFormData(newData);
  };

  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center py-8 text-gray-400">
        <p className="text-sm">No data available to edit</p>
        <p className="text-xs mt-1">Data will appear here once the section has content</p>
      </div>
    );
  }

  const missionItems = formData.mission?.items || [];
  const impactStats = formData.impact?.stats || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit About Us Data</h3>

      {/* Section Content */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <div className="space-y-3">
          <TextField
            label="Title"
            value={formData.section?.title}
            onChange={(e) => updateField('section.title', e.target.value)}
            placeholder="About us"
          />
          <TextAreaField
            label="Description"
            value={formData.section?.description}
            onChange={(e) => updateField('section.description', e.target.value)}
            placeholder="Description about the organization"
            rows={3}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <TextField
              label="Button Text"
              value={formData.section?.button?.text}
              onChange={(e) => updateField('section.button.text', e.target.value)}
              placeholder="More about us"
            />
            <TextField
              label="Button Link"
              value={formData.section?.button?.link}
              onChange={(e) => updateField('section.button.link', e.target.value)}
              placeholder="/about"
            />
          </div>
        </div>
      </div>

      {/* Mission Items */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Mission Items</h4>
          <button
            type="button"
            onClick={() => addArrayItem('mission.items', { id: Date.now(), icon: '', title: '', description: '', alt: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Mission Item
          </button>
        </div>

        <TextField
          label="Mission Title"
          value={formData.mission?.title}
          onChange={(e) => updateField('mission.title', e.target.value)}
          placeholder="The mission of our organization"
        />

        <ArrayManager
          items={missionItems}
          onAdd={() => addArrayItem('mission.items', { id: Date.now(), icon: '', title: '', description: '', alt: '' })}
          onRemove={(index) => removeArrayItem('mission.items', index)}
          itemLabel="Item"
          addLabel="Add Mission Item"
          renderItem={(item, index) => (
            <div className="space-y-2">
              <TextField
                label="Icon URL"
                value={item.icon || ''}
                onChange={(e) => updateArrayItem('mission.items', index, 'icon', e.target.value)}
                placeholder="Icon URL"
              />
              <TextField
                label="Title"
                value={item.title || ''}
                onChange={(e) => updateArrayItem('mission.items', index, 'title', e.target.value)}
                placeholder="Title"
              />
              <TextField
                label="Description"
                value={item.description || ''}
                onChange={(e) => updateArrayItem('mission.items', index, 'description', e.target.value)}
                placeholder="Description"
              />
              <TextField
                label="Alt Text"
                value={item.alt || ''}
                onChange={(e) => updateArrayItem('mission.items', index, 'alt', e.target.value)}
                placeholder="Alt Text"
              />
            </div>
          )}
        />
      </div>

      {/* Impact Stats */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Impact Stats</h4>
          <button
            type="button"
            onClick={() => addArrayItem('impact.stats', { id: Date.now(), value: '', suffix: '', label: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Stat
          </button>
        </div>

        <TextField
          label="Impact Title"
          value={formData.impact?.title}
          onChange={(e) => updateField('impact.title', e.target.value)}
          placeholder="Impact In Numbers"
        />

        <ArrayManager
          items={impactStats}
          onAdd={() => addArrayItem('impact.stats', { id: Date.now(), value: '', suffix: '', label: '' })}
          onRemove={(index) => removeArrayItem('impact.stats', index)}
          itemLabel="Stat"
          addLabel="Add Stat"
          renderItem={(stat, index) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <TextField
                label="Value"
                value={stat.value || ''}
                onChange={(e) => updateArrayItem('impact.stats', index, 'value', e.target.value)}
                placeholder="20"
              />
              <TextField
                label="Suffix"
                value={stat.suffix || ''}
                onChange={(e) => updateArrayItem('impact.stats', index, 'suffix', e.target.value)}
                placeholder="+"
              />
              <TextField
                label="Label"
                value={stat.label || ''}
                onChange={(e) => updateArrayItem('impact.stats', index, 'label', e.target.value)}
                placeholder="Years of Service"
              />
            </div>
          )}
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Image</h4>
        <ImageUpload
          imageSrc={image.imageSrc}
          onImageChange={(src) => {
            image.handleImageChange(src);
            updateField('image.src', src);
          }}
          onImageRemove={() => {
            image.handleImageRemove();
            updateField('image.src', '');
          }}
          oldImagePath={image.oldImagePath}
          imageChanged={image.imageChanged}
          uploadPath="/storage/AboutUs/"
        />
        <TextField
          label="Image Alt Text"
          value={formData.image?.alt}
          onChange={(e) => updateField('image.alt', e.target.value)}
          placeholder="About Us Image"
          className="mt-2"
        />
      </div>

      {/* Additional Data Info */}
      <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Section ID:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Table:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_table || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Key:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_key || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Has Data:</span>
            <span className={`ml-2 font-medium ${hasData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasData ? '✓ Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsEditor;