// resources/js/pages/Backend/CMS/Section/components/modals/Editors/shared/ImageUpload.jsx

// react
import React, { useState } from 'react';

// icons
import { FaUpload, FaTimes } from 'react-icons/fa';

// sweetalert
import Swal from 'sweetalert2';

/**
 * Reusable Image Upload Component with Drag & Drop
 * Features:
 * - Drag & drop image upload
 * - Image preview with remove option
 * - Tracks old image for deletion
 * - File validation (type and size)
 * - Loading state
 */
const ImageUpload = ({
  imageSrc,
  onImageChange,
  onImageRemove,
  oldImagePath = '',
  imageChanged = false,
  uploadPath = '/storage/',
  label = 'Image',
  className = 'w-24 h-20 object-cover rounded-lg',
  maxSize = 5 * 1024 * 1024,
  acceptTypes = 'image/*',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Functions to handle Drag
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Functions to handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  // Function to handle File Select
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  // Function to process the selected file
  const processFile = (file) => {

    // Check file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: `Please select an image file (JPEG, PNG, GIF, WebP, SVG)`,
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: `Image size should be less than ${maxSize / (1024 * 1024)}MB`,
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Start uploading
    setUploading(true);

    // Read the file
    const reader = new FileReader();

    // Handle file read
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      onImageChange(imageUrl);
      setUploading(false);
    };

    // Handle file read error
    reader.onerror = () => {
      setUploading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to read the image file',
        confirmButtonColor: '#3b82f6',
      });
    };
    // Start reading
    reader.readAsDataURL(file);
  };

  // Function to get display path
  const getDisplayPath = (src) => {
    if (!src) return '';
    if (src.startsWith('data:image')) {
      return 'New image (will be uploaded)';
    }
    return src;
  };

  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {imageSrc ? (
          <div className="flex items-center gap-4">
            <img
              src={imageSrc}
              alt="Uploaded image"
              className={className}
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Image uploaded</p>
              <p className="text-xs text-gray-400 truncate">
                {getDisplayPath(imageSrc)}
              </p>
              {imageChanged && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠️ Old image will be deleted on save
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onImageRemove}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <FaTimes size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <FaUpload size={32} className="mb-2" />
            <p className="text-sm">Drag & drop an image here, or click to browse</p>
            <p className="text-xs mt-1">Supports JPEG, PNG, GIF, WebP, SVG (max {maxSize / (1024 * 1024)}MB)</p>
            <p className="text-xs text-blue-500 mt-2">
              Image will be saved to {uploadPath}
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {/* Show uploading indicator */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        )}
      </div>

      {/* Show old image path */}
      {imageChanged && oldImagePath && (
        <div className="mt-2 text-xs text-gray-400">
          <span className="text-red-500">🗑️</span> Old image will be deleted: {oldImagePath}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;