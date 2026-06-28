/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/HeroFigureEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaUpload, FaTimes, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import RichTextEditor from '../../../../../../../components/RichTextEditor/RichTextEditor';

/**
 * HeroFigureEditor - Editor for HeroFigureSection data
 * Features:
 * - Select About Content from dropdown
 * - Auto-fill content from selected About Content
 * - Drag & drop image upload (shows path preview)
 * - Tracks old image for deletion
 * - Rich text content editing (disabled when using About Content)
 * - Button text and link editing
 * - Calls onDataChange when data is modified
 */
const HeroFigureEditor = ({ section, hasData, onDataChange }) => {
  // Parse the section data
  const initialData = section?.data?.data || section?.data || {};

  // Local state for form inputs
  const [formData, setFormData] = useState(initialData);

  // About Content options
  const [aboutContentOptions, setAboutContentOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [selectedAboutId, setSelectedAboutId] = useState(null);

  // Track if using About Content
  const [isUsingAboutContent, setIsUsingAboutContent] = useState(false);

  // Track if image has been changed (for deletion)
  const [imageChanged, setImageChanged] = useState(false);
  const [oldImagePath, setOldImagePath] = useState(initialData?.image?.src || '');

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Notify parent when formData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Fetch About Content options
  useEffect(() => {
    fetchAboutContentOptions();
  }, []);

  const fetchAboutContentOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await fetch('/backend/cms/sections/about-content-options');
      const data = await response.json();
      setAboutContentOptions(data);
    } catch (error) {
      console.error('Error fetching about content options:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Options',
        text: 'Could not fetch About Content options. Please refresh and try again.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setLoadingOptions(false);
    }
  };

  // Check if data matches an About Content item
  useEffect(() => {
    if (formData._about_content_id) {
      setSelectedAboutId(formData._about_content_id);
      setIsUsingAboutContent(true);
    }
  }, []);

  // Helper to update nested fields
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

  // Handle About Content selection
  const handleAboutContentSelect = (e) => {
    const id = e.target.value;
    setSelectedAboutId(id);

    if (!id) {
      setIsUsingAboutContent(false);
      // Remove the reference
      const newData = { ...formData };
      delete newData._about_content_id;
      setFormData(newData);
      return;
    }

    const selected = aboutContentOptions.find(item => item.id === parseInt(id));
    if (selected) {
      setIsUsingAboutContent(true);

      // Auto-fill the data from About Content
      const newData = {
        _about_content_id: selected.id,
        section: {
          title: selected.title || '',
        },
        content: {
          html: selected.full_content || selected.content || '',
        },
        btn: {
          text: selected.btn_text || 'Learn More',
          link: selected.btn_link || `/about/${selected.slug}`,
        },
        image: {
          src: selected.image || '',
          alt: selected.title || '',
          className: 'w-full h-auto lg:h-full object-cover rounded-2xl sm:rounded-3xl lg:rounded-4xl',
        },
      };

      setFormData(newData);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Content Loaded',
        text: `"${selected.title}" content has been loaded successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // ============================================================
  // IMAGE DRAG & DROP FUNCTIONS
  // ============================================================

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      processImageFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file (JPEG, PNG, GIF, WebP, SVG)',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Image size should be less than 5MB',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // If using About Content, break the link
    if (isUsingAboutContent) {
      const newData = { ...formData };
      delete newData._about_content_id;
      setFormData(newData);
      setIsUsingAboutContent(false);
      setSelectedAboutId(null);
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;

      if (!imageChanged && formData.image?.src) {
        setOldImagePath(formData.image.src);
      }

      updateField('image.src', imageUrl);
      setImageChanged(true);
      setUploading(false);
    };
    reader.onerror = () => {
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (!imageChanged && formData.image?.src) {
      setOldImagePath(formData.image.src);
    }
    updateField('image.src', '');
    setImageChanged(true);
  };

  // Helper to get display path
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  // Check if data exists
  if (!hasData || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Hero with Figure Data</h3>

        {/* About Content Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Load from About Content
          </label>
          <select
            value=""
            onChange={handleAboutContentSelect}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            disabled={loadingOptions}
          >
            <option value="">-- Select About Content --</option>
            {loadingOptions ? (
              <option value="" disabled>Loading...</option>
            ) : (
              aboutContentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} ({item.type})
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Select an About Content item to auto-fill this section
          </p>
        </div>

        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No data available to edit</p>
          <p className="text-xs mt-1">Data will appear here once the section has content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Hero with Figure Data</h3>

      {/* About Content Dropdown */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <FaInfoCircle className="text-blue-500" size={14} />
          <label className="text-sm font-medium text-gray-700">Load from About Content</label>
        </div>
        <select
          value={selectedAboutId || ''}
          onChange={handleAboutContentSelect}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
          disabled={loadingOptions}
        >
          <option value="">-- Select About Content --</option>
          {loadingOptions ? (
            <option value="" disabled>Loading...</option>
          ) : (
            aboutContentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.type})
              </option>
            ))
          )}
        </select>
        {isUsingAboutContent && (
          <p className="text-xs text-blue-600 mt-1">
            🔒 Content is locked from About Content. Edit in About Content Manager.
          </p>
        )}
        {isUsingAboutContent && (
          <button
            type="button"
            onClick={() => {
              window.location.href = route('backend.cms.about.index');
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <FaExternalLinkAlt size={10} />
            Go to About Content Manager
          </button>
        )}
      </div>

      {/* ============================================================
          SECTION DATA
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Content</h4>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={formData.section?.title || ''}
            onChange={(e) => {
              if (isUsingAboutContent) {
                const newData = { ...formData };
                delete newData._about_content_id;
                setFormData(newData);
                setIsUsingAboutContent(false);
                setSelectedAboutId(null);
              }
              updateField('section.title', e.target.value);
            }}
            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isUsingAboutContent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Background, Roles and Functions"
            disabled={isUsingAboutContent}
          />
        </div>
      </div>

      {/* ============================================================
          CONTENT SECTION - Rich Text Editor
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Content</h4>
        <div className={`border border-gray-300 rounded-lg overflow-hidden ${isUsingAboutContent ? 'opacity-50' : ''}`}>
          <RichTextEditor
            value={formData.content?.html || ''}
            onChange={(html) => {
              if (isUsingAboutContent) {
                const newData = { ...formData };
                delete newData._about_content_id;
                setFormData(newData);
                setIsUsingAboutContent(false);
                setSelectedAboutId(null);
              }
              updateField('content.html', html);
            }}
            placeholder="Write your content here..."
            height="300px"
            readOnly={isUsingAboutContent}
          />
        </div>
        {isUsingAboutContent && (
          <p className="text-xs text-yellow-600 mt-1">
            ⚠️ Content is locked. Edit in About Content Manager.
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Use the rich text editor to format your content. Supports headings, lists, links, and more.
        </p>
      </div>

      {/* ============================================================
          BUTTON SECTION
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Button</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button Text</label>
            <input
              type="text"
              value={formData.btn?.text || ''}
              onChange={(e) => {
                if (isUsingAboutContent) {
                  const newData = { ...formData };
                  delete newData._about_content_id;
                  setFormData(newData);
                  setIsUsingAboutContent(false);
                  setSelectedAboutId(null);
                }
                updateField('btn.text', e.target.value);
              }}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isUsingAboutContent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Learn More About Functions"
              disabled={isUsingAboutContent}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button Link</label>
            <input
              type="text"
              value={formData.btn?.link || ''}
              onChange={(e) => {
                if (isUsingAboutContent) {
                  const newData = { ...formData };
                  delete newData._about_content_id;
                  setFormData(newData);
                  setIsUsingAboutContent(false);
                  setSelectedAboutId(null);
                }
                updateField('btn.link', e.target.value);
              }}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isUsingAboutContent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="/about/functions"
              disabled={isUsingAboutContent}
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          IMAGE SECTION
          ============================================================ */}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Image</h4>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50' : ''} ${isUsingAboutContent ? 'opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={(e) => {
            if (!isUsingAboutContent) {
              handleDrop(e);
            } else {
              Swal.fire({
                icon: 'warning',
                title: 'Content Locked',
                text: 'This content is from About Content. To edit, break the link by editing any field.',
                confirmButtonColor: '#3b82f6',
              });
            }
          }}
        >
          {formData.image?.src ? (
            <div className="flex items-center gap-4">
              <img
                src={formData.image.src}
                alt={formData.image?.alt || 'Image'}
                className="w-24 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Image uploaded</p>
                <p className="text-xs text-gray-400 truncate">
                  {getDisplayPath(formData.image.src)}
                </p>
                {imageChanged && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Old image will be deleted on save
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isUsingAboutContent) {
                    removeImage();
                  } else {
                    Swal.fire({
                      icon: 'warning',
                      title: 'Content Locked',
                      text: 'This content is from About Content. To break the link, edit any field.',
                      confirmButtonColor: '#3b82f6',
                    });
                  }
                }}
                className={`p-1.5 rounded-lg transition ${isUsingAboutContent ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                disabled={isUsingAboutContent}
              >
                <FaTimes size={16} />
              </button>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center py-6 ${isUsingAboutContent ? 'text-gray-300' : 'text-gray-400'}`}>
              <FaUpload size={32} className="mb-2" />
              <p className="text-sm">{isUsingAboutContent ? 'Image from About Content' : 'Drag & drop an image here, or click to browse'}</p>
              <p className="text-xs mt-1">Supports JPEG, PNG, GIF, WebP, SVG (max 5MB)</p>
            </div>
          )}
          {!isUsingAboutContent && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading || isUsingAboutContent}
            />
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
        </div>

        {imageChanged && oldImagePath && (
          <div className="mt-2 text-xs text-gray-400">
            <span className="text-red-500">🗑️</span> Old image will be deleted: {oldImagePath}
          </div>
        )}
      </div>

      {/* ============================================================
          IMAGE ALT TEXT & CLASS NAME
          ============================================================ */}

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Image Alt Text</label>
            <input
              type="text"
              value={formData.image?.alt || ''}
              onChange={(e) => {
                if (isUsingAboutContent) {
                  const newData = { ...formData };
                  delete newData._about_content_id;
                  setFormData(newData);
                  setIsUsingAboutContent(false);
                  setSelectedAboutId(null);
                }
                updateField('image.alt', e.target.value);
              }}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isUsingAboutContent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Background"
              disabled={isUsingAboutContent}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Image Class Name</label>
            <input
              type="text"
              value={formData.image?.className || ''}
              onChange={(e) => {
                if (isUsingAboutContent) {
                  const newData = { ...formData };
                  delete newData._about_content_id;
                  setFormData(newData);
                  setIsUsingAboutContent(false);
                  setSelectedAboutId(null);
                }
                updateField('image.className', e.target.value);
              }}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isUsingAboutContent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="w-full h-auto lg:h-full object-cover rounded-2xl"
              disabled={isUsingAboutContent}
            />
            <p className="text-xs text-gray-400 mt-0.5">CSS classes for the image styling</p>
          </div>
        </div>
      </div>

      {/* ============================================================
          ADDITIONAL DATA INFO
          ============================================================ */}

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
          {isUsingAboutContent && (
            <div className="col-span-2">
              <span className="text-gray-500">Linked to:</span>
              <span className="ml-2 text-blue-600 font-medium">
                About Content #{selectedAboutId}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroFigureEditor;