// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ContactReachEditor.jsx

import React, { useState, useEffect } from 'react';
import ImageUpload from './shared/ImageUpload';
import { TextField } from './shared/Fields';
import { useImageUpload } from './shared/useImageUpload';

const ContactReachEditor = ({ section, hasData, onDataChange }) => {
  const initialData = section?.data?.data || section?.data || {};
  const [formData, setFormData] = useState(initialData);
  const image = useImageUpload(initialData?.image || '');

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Contact Reach Data</h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No data available to edit</p>
          <p className="text-xs mt-1">Data will appear here once the section has content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Contact Reach Data</h3>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Image</h4>
        <ImageUpload
          imageSrc={image.imageSrc}
          onImageChange={(src) => {
            image.handleImageChange(src);
            updateField('image', src);
          }}
          onImageRemove={() => {
            image.handleImageRemove();
            updateField('image', '');
          }}
          oldImagePath={image.oldImagePath}
          imageChanged={image.imageChanged}
          uploadPath="/storage/ContactUs/"
        />
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Content</h4>
        <div className="space-y-3">
          <TextField
            label="Title"
            value={formData.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="Reach out to us today!"
          />
          <TextField
            label="Button Text"
            value={formData.buttonText || ''}
            onChange={(e) => updateField('buttonText', e.target.value)}
            placeholder="Submit Message"
          />
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Preview</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Title:</span>
            <span className="text-sm text-gray-700 font-medium">
              {formData.title || 'Not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Button:</span>
            <span className="text-sm text-blue-600">
              {formData.buttonText || 'Not set'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Image:</span>
            <span className="text-sm text-gray-500 truncate max-w-48">
              {formData.image ? (formData.image.startsWith('data:image') ? 'New image' : formData.image) : 'No image'}
            </span>
          </div>
        </div>
      </div>

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

export default ContactReachEditor;