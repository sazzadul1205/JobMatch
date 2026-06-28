// resources/js/pages/Backend/CMS/Section/components/modals/Editors/StoriesEditor.jsx

// React
import React, { useState, useEffect } from 'react';

// Icons
import { FaTrash, FaPlus, FaUpload, FaTimes } from 'react-icons/fa';

// Sweetalert
import Swal from 'sweetalert2';

// Shared Components
import { TextField, TextAreaField } from './shared/Fields';

const StoriesEditor = ({ section, hasData, onDataChange }) => {
  // ===== STATE MANAGEMENT =====
  // Get initial data from section prop
  const initialData = section?.data?.data || section?.data || {};
  const [formData, setFormData] = useState(initialData);

  // Track image changes for deletion tracking
  const [imageChanges, setImageChanges] = useState({});
  const [oldImagePaths, setOldImagePaths] = useState({});
  const [uploadingImage, setUploadingImage] = useState({});

  // Notify parent when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // ===== HELPER FUNCTIONS =====

  // Update nested object fields using dot notation (e.g., 'section.title')
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

  // Update a field in a story item
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

  // ===== ARRAY MANAGEMENT FUNCTIONS =====

  // Add a new story with default values
  const addArrayItem = (path, template = {}) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    // Traverse to the parent of the array
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) current[lastKey] = [];

    // Generate unique ID for the new story
    const newId = Math.max(0, ...current[lastKey].map(item => item.id || 0)) + 1;
    current[lastKey].push({ ...template, id: newId });
    setFormData(newData);
  };

  // Remove a story and track its image for deletion
  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    // Store old image path before removal (for deletion tracking)
    const items = formData.stories || [];
    if (items[index]?.image) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].image
      }));
      setImageChanges(prev => ({ ...prev, [index]: true }));
    }

    // Traverse to the parent of the array
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

  // ===== IMAGE HANDLING FUNCTIONS =====

  // Handle image drop from drag & drop
  const handleImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processImageFile(file, index);
    }
  };

  // Handle image selection via file input
  const handleImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file, index);
    }
    e.target.value = '';
  };

  // Process and upload the image file
  const processImageFile = (file, index) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Store old image path if it exists
    const items = formData.stories || [];
    if (items[index]?.image && !imageChanges[index]) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].image
      }));
    }

    // Read and convert image to base64
    setUploadingImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem('stories', index, 'image', imageUrl);
      setImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove image from a story
  const removeImage = (index) => {
    const items = formData.stories || [];
    if (items[index]?.image) {
      setOldImagePaths(prev => ({
        ...prev,
        [index]: items[index].image
      }));
    }
    updateArrayItem('stories', index, 'image', '');
    setImageChanges(prev => ({ ...prev, [index]: true }));
  };

  // Display path for image (shows if it's new or existing)
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  // ===== EMPTY STATE =====
  // Show message when no data exists
  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center py-8 text-gray-400">
        <p className="text-sm">No data available to edit</p>
        <p className="text-xs mt-1">Data will appear here once the section has content</p>
      </div>
    );
  }

  const stories = formData.stories || [];

  // ===== MAIN RENDER =====
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Stories Data</h3>

      {/* <!-- ===== SECTION CONTENT ===== --> */}
      {/* Title and description for the stories section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <div className="space-y-3">
          <TextField
            label="Title"
            value={formData.section?.title || ''}
            onChange={(e) => updateField('section.title', e.target.value)}
            placeholder="Insights, Stories & Impact"
          />
          <TextAreaField
            label="Description"
            value={formData.section?.description || ''}
            onChange={(e) => updateField('section.description', e.target.value)}
            placeholder="Description of the stories section"
            rows={2}
          />
        </div>
      </div>

      {/* <!-- ===== STORIES LIST ===== --> */}
      {/* List of stories with image, date, title, description, and link */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">Stories ({stories.length})</h4>
          <button
            type="button"
            onClick={() => addArrayItem('stories', { id: Date.now(), image: '', date: '', title: '', description: '', link: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add Story
          </button>
        </div>

        {/* Loop through each story */}
        <div className="space-y-3">
          {stories.map((story, index) => (
            <div key={story.id || index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">

              {/* Story header with index and remove button */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500">Story #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeArrayItem('stories', index)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <FaTrash size={12} /> Remove
                </button>
              </div>

              {/* <!-- ===== STORY FIELDS (2 columns on desktop) ===== --> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* <!-- ===== LEFT COLUMN: IMAGE ===== --> */}
                <div>
                  <label className="block text-xs text-gray-400 mb-0.5">Image</label>

                  {/* Drag & drop image upload area */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-3 transition-all ${uploadingImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleImageDrop(e, index)}
                  >
                    {/* Show image preview if exists */}
                    {story.image ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={story.image}
                          alt={story.title || 'Story image'}
                          className="w-16 h-12 object-cover rounded border border-gray-200"
                        />
                        <span className="text-xs text-gray-500 truncate flex-1">
                          {getDisplayPath(story.image)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ) : (
                      // Empty state for image upload
                      <div className="flex items-center gap-3 text-gray-400">
                        <FaUpload size={18} />
                        <span className="text-sm">Drop image or click to browse</span>
                      </div>
                    )}

                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, index)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingImage[index]}
                    />

                    {/* Loading spinner */}
                    {uploadingImage[index] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Show old image deletion notice */}
                  {imageChanges[index] && oldImagePaths[index] && (
                    <div className="mt-1 text-xs text-gray-400">
                      <span className="text-red-500">🗑️</span> Old image will be deleted: {oldImagePaths[index]}
                    </div>
                  )}
                </div>

                {/* <!-- ===== RIGHT COLUMN: FIELDS ===== --> */}
                <div className="space-y-2">
                  {/* Date */}
                  <TextField
                    label="Date"
                    value={story.date || ''}
                    onChange={(e) => updateArrayItem('stories', index, 'date', e.target.value)}
                    placeholder="June 6, 2023"
                  />
                  {/* Title */}
                  <TextField
                    label="Title"
                    value={story.title || ''}
                    onChange={(e) => updateArrayItem('stories', index, 'title', e.target.value)}
                    placeholder="Story title"
                  />
                  {/* Description */}
                  <TextField
                    label="Description"
                    value={story.description || ''}
                    onChange={(e) => updateArrayItem('stories', index, 'description', e.target.value)}
                    placeholder="Brief description of the story"
                  />
                  {/* Link */}
                  <TextField
                    label="Link"
                    value={story.link || ''}
                    onChange={(e) => updateArrayItem('stories', index, 'link', e.target.value)}
                    placeholder="/stories/example-story"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state - no stories */}
        {stories.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            No stories added. Click "Add Story" to create one.
          </div>
        )}
      </div>

      {/* <!-- ===== DATA INFORMATION ===== --> */}
      {/* Display metadata about the section */}
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

export default StoriesEditor;