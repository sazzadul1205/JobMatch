// resources/js/pages/Backend/ApplicantProfile/Edit.jsx

import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { FaArrowLeft, FaSave, FaSpinner, FaUser, FaUpload, FaFilePdf, FaFileWord, FaFileAlt, FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

export default function Edit({ profile }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    birth_date: profile?.birth_date || '',
    phone: profile?.phone || '+880',
    photo: null,
    cv: null,
  });

  const [preview, setPreview] = useState({
    photo: profile?.photo_path ? `/storage/${profile.photo_path}` : null,
    cv: profile?.cv_path ? profile.cv_path.split('/').pop() : null,
    cvType: null,
  });

  const [existingFiles, setExistingFiles] = useState({
    photo: profile?.photo_path || null,
    cv: profile?.cv_path || null,
  });

  const [dragActive, setDragActive] = useState({
    photo: false,
    cv: false,
  });

  const [removePhoto, setRemovePhoto] = useState(false);
  const [removeCV, setRemoveCV] = useState(false);

  const photoInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // File validation limits
  const PHOTO_MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const CV_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  const ALLOWED_CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return <FaFilePdf className="text-red-600" size={24} />;
    if (type === 'application/msword') return <FaFileWord className="text-blue-600" size={24} />;
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <FaFileWord className="text-blue-600" size={24} />;
    return <FaFileAlt className="text-gray-600" size={24} />;
  };

  const validatePhoto = (file) => {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      return 'Only JPG, JPEG, and PNG images are allowed.';
    }
    if (file.size > PHOTO_MAX_SIZE) {
      return `Photo size must be less than 2MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  };

  const validateCV = (file) => {
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      return 'Only PDF, DOC, and DOCX files are allowed.';
    }
    if (file.size > CV_MAX_SIZE) {
      return `CV size must be less than 5MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;

    // Ensure +880 prefix is always present
    if (!rawValue.startsWith('+880')) {
      setFormData(prev => ({ ...prev, phone: '+880' }));
      return;
    }

    // Allow only digits after +880
    const prefix = '+880';
    const remaining = rawValue.substring(4).replace(/\D/g, '');
    const limitedRemaining = remaining.slice(0, 10); // Max 10 digits after prefix

    setFormData(prev => ({ ...prev, phone: prefix + limitedRemaining }));

    // Clear phone error if any
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: null }));
    }
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return true;

    // Check if it starts with +880 and has at least 10 digits after
    if (phone.startsWith('+880')) {
      const digitsAfterPrefix = phone.substring(4);
      if (digitsAfterPrefix.length === 0) {
        return 'Please enter your phone number after +880';
      }
      if (digitsAfterPrefix.length < 10) {
        return 'Please enter a valid 10-digit phone number after +880 (e.g., 1712345678)';
      }
      if (!/^\d+$/.test(digitsAfterPrefix)) {
        return 'Please enter only numbers after +880';
      }
      return null;
    }

    return 'Phone number must start with +880';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';

    // Validate phone number
    const phoneError = validatePhoneNumber(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('_method', 'PUT');
    submitData.append('first_name', formData.first_name);
    submitData.append('last_name', formData.last_name);
    if (formData.birth_date) submitData.append('birth_date', formData.birth_date);
    submitData.append('phone', formData.phone.replace(/\s/g, ''));

    // Handle file removals
    if (removePhoto) {
      submitData.append('remove_photo', '1');
    }
    if (removeCV) {
      submitData.append('remove_cv', '1');
    }

    // Handle new file uploads
    if (formData.photo) submitData.append('photo', formData.photo);
    if (formData.cv) submitData.append('cv', formData.cv);

    router.post(route('backend.applicant.profile.update', profile.id), submitData, {
      onSuccess: () => {
        setIsSubmitting(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Your profile has been updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      onError: (err) => {
        setIsSubmitting(false);
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        }
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update profile. Please try again.',
        });
      },
    });
  };

  const processFile = (file, type) => {
    let validationError = null;

    if (type === 'photo') {
      validationError = validatePhoto(file);
      if (!validationError) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(prev => ({ ...prev, photo: reader.result }));
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, photo: file }));
        setFileErrors(prev => ({ ...prev, photo: null }));
        setRemovePhoto(false);
        setExistingFiles(prev => ({ ...prev, photo: null }));
      }
    } else if (type === 'cv') {
      validationError = validateCV(file);
      if (!validationError) {
        setPreview(prev => ({
          ...prev,
          cv: file.name,
          cvType: file.type
        }));
        setFormData(prev => ({ ...prev, cv: file }));
        setFileErrors(prev => ({ ...prev, cv: null }));
        setRemoveCV(false);
        setExistingFiles(prev => ({ ...prev, cv: null }));
      }
    }

    if (validationError) {
      setFileErrors(prev => ({ ...prev, [type]: validationError }));
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      processFile(file, name);
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0], type);
    }
  };

  const handleRemovePhoto = () => {
    if (existingFiles.photo || preview.photo) {
      setRemovePhoto(true);
      setPreview(prev => ({ ...prev, photo: null }));
      setFormData(prev => ({ ...prev, photo: null }));
      setExistingFiles(prev => ({ ...prev, photo: null }));
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleRemoveCV = () => {
    if (existingFiles.cv || preview.cv) {
      setRemoveCV(true);
      setPreview(prev => ({ ...prev, cv: null, cvType: null }));
      setFormData(prev => ({ ...prev, cv: null }));
      setExistingFiles(prev => ({ ...prev, cv: null }));
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Edit Profile" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" size={16} />
            Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Your Profile</h1>
          <p className="text-gray-600 mt-1">Update your personal information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="+8801712345678"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: +880 followed by 10 digits (e.g., +8801712345678)
                </p>
              </div>
            </div>
          </div>

          {/* Profile Photo with Drag & Drop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            {preview.photo || existingFiles.photo ? (
              <div className="relative inline-block">
                <img
                  src={preview.photo || `/storage/${existingFiles.photo}`}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border-2 border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onDragEnter={(e) => handleDrag(e, 'photo')}
                onDragLeave={(e) => handleDrag(e, 'photo')}
                onDragOver={(e) => handleDrag(e, 'photo')}
                onDrop={(e) => handleDrop(e, 'photo')}
                onClick={() => photoInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                  ${dragActive.photo
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-600">Drag and drop your photo here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG only (Max 2MB)</p>
              </div>
            )}
            {fileErrors.photo && (
              <p className="text-xs text-red-500 mt-2">{fileErrors.photo}</p>
            )}
          </div>

          {/* CV Upload with Drag & Drop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/CV <span className="text-red-500">*</span>
            </label>
            {preview.cv || existingFiles.cv ? (
              <div className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-lg">
                {getFileIcon(preview.cvType)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{preview.cv || existingFiles.cv?.split('/').pop()}</p>
                  <p className="text-xs text-gray-500">{existingFiles.cv && !preview.cv ? 'Current file' : 'Ready to upload'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCV}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ) : (
              <div
                onDragEnter={(e) => handleDrag(e, 'cv')}
                onDragLeave={(e) => handleDrag(e, 'cv')}
                onDragOver={(e) => handleDrag(e, 'cv')}
                onDrop={(e) => handleDrop(e, 'cv')}
                onClick={() => cvInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                  ${dragActive.cv
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={cvInputRef}
                  type="file"
                  name="cv"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3" />
                <p className="text-gray-600">Drag and drop your CV here, or click to browse</p>
                <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            )}
            {fileErrors.cv && (
              <p className="text-xs text-red-500 mt-2">{fileErrors.cv}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
              <FaSave size={16} />
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}