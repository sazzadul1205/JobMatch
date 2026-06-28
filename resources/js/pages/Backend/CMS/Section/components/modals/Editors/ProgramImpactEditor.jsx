// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ProgramImpactEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaUpload, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { TextField } from './shared/Fields';

const ProgramImpactEditor = ({ section, hasData, onDataChange }) => {
  // ===== STATE MANAGEMENT =====
  // Get initial data from section prop
  const initialData = section?.data?.data || section?.data || {};
  const [formData, setFormData] = useState(initialData);

  // Track main image changes for deletion tracking
  const [mainImageChanges, setMainImageChanges] = useState({});
  const [oldMainImagePaths, setOldMainImagePaths] = useState({});

  // Track SDG image changes for deletion tracking
  const [sdgImageChanges, setSdgImageChanges] = useState({});
  const [oldSdgImagePaths, setOldSdgImagePaths] = useState({});

  // Upload states for main and SDG images
  const [uploadingMainImage, setUploadingMainImage] = useState({});
  const [uploadingSdgImage, setUploadingSdgImage] = useState({});

  // Notify parent when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // ===== HELPER FUNCTIONS =====

  // Update nested object fields using dot notation
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

  // Update a field in an array item
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

  // Add a new item to an array
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

    // Generate unique ID for the new item
    const newId = Math.max(0, ...current[lastKey].map(item => item.id || 0)) + 1;
    current[lastKey].push({ ...template, id: newId });
    setFormData(newData);
  };

  // Remove an item from an array
  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    // Track SDG image deletion if removing from sdgImages
    if (path === 'sdgImages') {
      const items = formData.sdgImages || [];
      if (items[index]?.src) {
        setOldSdgImagePaths(prev => ({
          ...prev,
          [index]: items[index].src
        }));
        setSdgImageChanges(prev => ({ ...prev, [index]: true }));
      }
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

  // ===== MAIN IMAGE HANDLING FUNCTIONS =====

  // Handle main image drop from drag & drop
  const handleMainImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processMainImageFile(file, index);
    }
  };

  // Handle main image selection via file input
  const handleMainImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processMainImageFile(file, index);
    }
    e.target.value = '';
  };

  // Process and upload the main image file
  const processMainImageFile = (file, index) => {
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
    const items = formData.section?.mainImage?.images || [];
    if (items[index] && !mainImageChanges[index]) {
      setOldMainImagePaths(prev => ({
        ...prev,
        [index]: items[index]
      }));
    }

    // Read and convert image to base64
    setUploadingMainImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem('section.mainImage.images', index, '', imageUrl);
      setMainImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingMainImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingMainImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove a main image
  const removeMainImage = (index) => {
    const items = formData.section?.mainImage?.images || [];
    if (items[index]) {
      setOldMainImagePaths(prev => ({
        ...prev,
        [index]: items[index]
      }));
    }
    const newImages = items.filter((_, i) => i !== index);
    updateField('section.mainImage.images', newImages);
    setMainImageChanges(prev => ({ ...prev, [index]: true }));
  };

  // ===== SDG IMAGE HANDLING FUNCTIONS =====

  // Handle SDG image drop from drag & drop
  const handleSdgImageDrop = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processSdgImageFile(file, index);
    }
  };

  // Handle SDG image selection via file input
  const handleSdgImageSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      processSdgImageFile(file, index);
    }
    e.target.value = '';
  };

  // Process and upload the SDG image file
  const processSdgImageFile = (file, index) => {
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
    const items = formData.sdgImages || [];
    if (items[index]?.src && !sdgImageChanges[index]) {
      setOldSdgImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }

    // Read and convert image to base64
    setUploadingSdgImage(prev => ({ ...prev, [index]: true }));
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateArrayItem('sdgImages', index, 'src', imageUrl);
      setSdgImageChanges(prev => ({ ...prev, [index]: true }));
      setUploadingSdgImage(prev => ({ ...prev, [index]: false }));
    };
    reader.onerror = () => {
      setUploadingSdgImage(prev => ({ ...prev, [index]: false }));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  // Remove an SDG image
  const removeSdgImage = (index) => {
    const items = formData.sdgImages || [];
    if (items[index]?.src) {
      setOldSdgImagePaths(prev => ({
        ...prev,
        [index]: items[index].src
      }));
    }
    removeArrayItem('sdgImages', index);
    setSdgImageChanges(prev => ({ ...prev, [index]: true }));
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

  const mainImages = formData.section?.mainImage?.images || [];
  const sdgImages = formData.sdgImages || [];

  // ===== MAIN RENDER =====
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Program Impact Data</h3>

      {/* <!-- ===== SECTION TITLE ===== --> */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <TextField
          label="Title"
          value={formData.section?.title || ''}
          onChange={(e) => updateField('section.title', e.target.value)}
          placeholder="Program Impact and SDGs"
        />
      </div>

      {/* <!-- ===== MAIN IMAGES ===== --> */}
      {/* Grid of main images with drag & drop upload */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          Main Images ({mainImages.length})
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mainImages.map((image, index) => (
            <div key={index} className="relative bg-gray-50 rounded-lg border border-gray-200 p-2">
              <div
                className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${uploadingMainImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleMainImageDrop(e, index)}
              >
                {image ? (
                  // Image preview with remove button
                  <div className="relative">
                    <img
                      src={image}
                      alt={`Main image ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => removeMainImage(index)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 truncate block">
                        {getDisplayPath(image)}
                      </span>
                      {mainImageChanges[index] && oldMainImagePaths[index] && (
                        <span className="text-xs text-red-400">🗑️ Will delete old</span>
                      )}
                    </div>
                  </div>
                ) : (
                  // Empty state for image upload
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <FaUpload size={20} />
                    <span className="text-xs mt-1">Drop image</span>
                  </div>
                )}
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMainImageSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingMainImage[index]}
                />
                {/* Loading spinner */}
                {uploadingMainImage[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {mainImages.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No main images added.
          </div>
        )}
      </div>

      {/* <!-- ===== SDG IMAGES ===== --> */}
      {/* Grid of SDG images with add/remove functionality */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-600">SDG Images ({sdgImages.length})</h4>
          <button
            type="button"
            onClick={() => addArrayItem('sdgImages', { id: Date.now(), src: '', alt: '' })}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus size={12} /> Add SDG Image
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sdgImages.map((sdg, index) => (
            <div key={sdg.id || index} className="bg-gray-50 rounded-lg border border-gray-200 p-3">

              {/* SDG header with index and remove button */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">SDG #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeSdgImage(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* Drag & drop image upload area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-2 transition-all ${uploadingSdgImage[index] ? 'opacity-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleSdgImageDrop(e, index)}
              >
                {sdg.src ? (
                  // Image preview with remove button
                  <div className="relative">
                    <img
                      src={sdg.src}
                      alt={sdg.alt || 'SDG Image'}
                      className="w-full h-20 object-cover rounded"
                    />
                    <div className="absolute top-1 right-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (sdg.src) {
                            setOldSdgImagePaths(prev => ({
                              ...prev,
                              [index]: sdg.src
                            }));
                          }
                          updateArrayItem('sdgImages', index, 'src', '');
                          setSdgImageChanges(prev => ({ ...prev, [index]: true }));
                        }}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 truncate block">
                        {getDisplayPath(sdg.src)}
                      </span>
                      {sdgImageChanges[index] && oldSdgImagePaths[index] && (
                        <span className="text-xs text-red-400">🗑️ Will delete old</span>
                      )}
                    </div>
                  </div>
                ) : (
                  // Empty state for image upload
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <FaUpload size={20} />
                    <span className="text-xs mt-1">Drop image</span>
                  </div>
                )}
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSdgImageSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingSdgImage[index]}
                />
                {/* Loading spinner */}
                {uploadingSdgImage[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                )}
              </div>

              {/* Alt text field for SDG image */}
              <TextField
                label="Alt Text"
                value={sdg.alt || ''}
                onChange={(e) => updateArrayItem('sdgImages', index, 'alt', e.target.value)}
                placeholder="No Poverty"
                className="mt-2"
              />
            </div>
          ))}
        </div>

        {sdgImages.length === 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            No SDG images added. Click "Add SDG Image" to create one.
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

export default ProgramImpactEditor;