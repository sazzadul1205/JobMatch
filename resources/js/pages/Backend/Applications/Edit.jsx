// resources/js/pages/Backend/Applications/Edit.jsx

import { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaCloudUploadAlt,
  FaUserCircle,
  FaCheckCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaCamera,
  FaTrash,
  FaEye,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEdit,
  FaUndo
} from 'react-icons/fa';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';
import Swal from 'sweetalert2';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Edit({ application, job, profile, hasProfile }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  // Mode: 'profile' or 'custom' - determine based on if we're using profile data
  const [mode, setMode] = useState(() => {
    // If the application has custom data (name/email not matching profile), use custom mode
    if (hasProfile && profile) {
      const isUsingProfileData =
        application.name === `${profile.first_name} ${profile.last_name}` &&
        application.email === profile.email;
      return isUsingProfileData ? 'profile' : 'custom';
    }
    return 'custom';
  });

  const [formData, setFormData] = useState({
    name: application.name || '',
    email: application.email || '',
    phone: application.phone || '',
    expected_salary: application.expected_salary || '',
    resume: null,
    photo: null,
  });

  const [preview, setPreview] = useState({
    resume: null,
    resumeType: null,
    resumeFile: null,
    photo: null,
    // Track if we're using existing files
    useExistingResume: true,
    useExistingPhoto: true,
    existingResumeUrl: application.resume_path || application.applicant_profile?.cv_url || null,
    existingPhotoUrl: application.applicant_profile?.photo_url || null,
  });

  // Education criteria state
  const [educationConfirmed, setEducationConfirmed] = useState(false);

  // PDF preview state
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfError, setPdfError] = useState(null);

  const [dragActive, setDragActive] = useState({
    resume: false,
    photo: false,
  });

  const resumeInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Get education requirement display text
  const getEducationDisplay = (education) => {
    const educationLevels = {
      'ssc': 'SSC / Equivalent',
      'hsc': 'HSC / Equivalent',
      'diploma': 'Diploma in Engineering',
      'bachelor': "Bachelor's Degree",
      'masters': "Master's Degree",
      'masters-engineering': "Master's in Engineering",
      'phd': 'PhD / Doctorate',
      'professional': 'Professional Certification (CA / ACCA / CIMA / ICSB)',
      'vocational': 'Vocational Training',
      'none': 'No Formal Education Required'
    };
    return educationLevels[education] || education || 'Not specified';
  };

  // Reset form when mode changes
  useEffect(() => {
    if (mode === 'profile' && profile) {
      setFormData({
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || '',
        expected_salary: application.expected_salary || '',
        resume: null,
        photo: null,
      });
      setPreview(prev => ({
        ...prev,
        resume: null,
        resumeType: null,
        resumeFile: null,
        photo: null,
        useExistingResume: true,
        useExistingPhoto: true,
        existingResumeUrl: application.resume_path || profile.cv_url || null,
        existingPhotoUrl: profile.photo_url || null,
      }));
      // Clear file inputs
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      if (photoInputRef.current) photoInputRef.current.value = '';
      setPdfFile(null);
    } else if (mode === 'custom') {
      setFormData({
        name: application.name || '',
        email: application.email || '',
        phone: application.phone || '',
        expected_salary: application.expected_salary || '',
        resume: null,
        photo: null,
      });
      setPreview(prev => ({
        ...prev,
        resume: null,
        resumeType: null,
        resumeFile: null,
        photo: null,
        useExistingResume: true,
        useExistingPhoto: true,
      }));
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      if (photoInputRef.current) photoInputRef.current.value = '';
      setPdfFile(null);
    }
  }, [mode, profile, application]);

  // File validation limits
  const RESUME_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const PHOTO_MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const ALLOWED_RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return <FaFilePdf className="text-red-600" size={24} />;
    if (type === 'application/msword') return <FaFileWord className="text-blue-600" size={24} />;
    if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <FaFileWord className="text-blue-600" size={24} />;
    return <FaFileAlt className="text-gray-600" size={24} />;
  };

  const validateResume = (file) => {
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      return 'Only PDF, DOC, and DOCX files are allowed.';
    }
    if (file.size > RESUME_MAX_SIZE) {
      return `Resume size must be less than 5MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      let validationError;
      if (type === 'resume') {
        validationError = validateResume(file);
      } else {
        validationError = validatePhoto(file);
      }

      if (validationError) {
        setFileErrors(prev => ({ ...prev, [type]: validationError }));
        e.target.value = '';
        return;
      }

      if (type === 'resume') {
        setPreview(prev => ({
          ...prev,
          resume: file.name,
          resumeType: file.type,
          resumeFile: file,
          useExistingResume: false,
        }));
        setFormData(prev => ({ ...prev, resume: file }));

        // Reset PDF preview and load new one
        setPdfFile(null);
        setNumPages(null);
        setPageNumber(1);
        setPdfError(null);

        // Create object URL for PDF preview
        if (file.type === 'application/pdf') {
          const objectUrl = URL.createObjectURL(file);
          setPdfFile(objectUrl);
        }
      } else if (type === 'photo') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(prev => ({
            ...prev,
            photo: reader.result,
            useExistingPhoto: false,
          }));
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, photo: file }));
      }
      setFileErrors(prev => ({ ...prev, [type]: null }));
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

    const file = e.dataTransfer.files[0];
    if (file) {
      let validationError;
      if (type === 'resume') {
        validationError = validateResume(file);
      } else {
        validationError = validatePhoto(file);
      }

      if (validationError) {
        setFileErrors(prev => ({ ...prev, [type]: validationError }));
        return;
      }

      if (type === 'resume') {
        setPreview(prev => ({
          ...prev,
          resume: file.name,
          resumeType: file.type,
          resumeFile: file,
          useExistingResume: false,
        }));
        setFormData(prev => ({ ...prev, resume: file }));

        // Reset PDF preview and load new one
        setPdfFile(null);
        setNumPages(null);
        setPageNumber(1);
        setPdfError(null);

        // Create object URL for PDF preview
        if (file.type === 'application/pdf') {
          const objectUrl = URL.createObjectURL(file);
          setPdfFile(objectUrl);
        }
      } else if (type === 'photo') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(prev => ({
            ...prev,
            photo: reader.result,
            useExistingPhoto: false,
          }));
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({ ...prev, photo: file }));
      }
      setFileErrors(prev => ({ ...prev, [type]: null }));
    }
  };

  const removeFile = (type) => {
    if (type === 'resume') {
      setFormData(prev => ({ ...prev, resume: null }));
      setPreview(prev => ({
        ...prev,
        resume: null,
        resumeType: null,
        resumeFile: null,
        useExistingResume: true,
      }));
      setFileErrors(prev => ({ ...prev, resume: null }));
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      // Clean up PDF object URL
      if (pdfFile && typeof pdfFile === 'string' && pdfFile.startsWith('blob:')) {
        URL.revokeObjectURL(pdfFile);
      }
      setPdfFile(null);
      setNumPages(null);
      setPageNumber(1);
      setPdfError(null);
    } else if (type === 'photo') {
      setFormData(prev => ({ ...prev, photo: null }));
      setPreview(prev => ({
        ...prev,
        photo: null,
        useExistingPhoto: true,
      }));
      setFileErrors(prev => ({ ...prev, photo: null }));
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const resetToOriginal = (type) => {
    if (type === 'resume') {
      removeFile('resume');
    } else if (type === 'photo') {
      removeFile('photo');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
    setPdfError('Failed to load PDF preview. The file may be corrupted or password protected.');
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const newErrors = {};

    // Validate based on mode
    if (mode === 'custom') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
    }

    // Check if we have a resume (either existing or new)
    const hasResume = preview.useExistingResume || formData.resume;
    if (!hasResume) {
      newErrors.resume = 'Resume/CV is required';
    }

    // Check if education criteria is acknowledged (if education requirement exists)
    const hasEducationRequirement = job.education_requirement && job.education_requirement !== 'none';
    if (hasEducationRequirement && !educationConfirmed) {
      newErrors.education = 'You must confirm that you meet the education requirements';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('_method', 'PUT'); // For Laravel to recognize as PUT request
    submitData.append('mode', mode);

    // Add form data
    if (mode === 'custom') {
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      if (formData.phone) submitData.append('phone', formData.phone);
    } else {
      // In profile mode, we use profile data
      submitData.append('use_profile_data', '1');
    }

    if (formData.expected_salary) submitData.append('expected_salary', formData.expected_salary);

    // Handle resume upload - only send if new file is uploaded
    if (formData.resume) {
      submitData.append('resume', formData.resume);
      submitData.append('replace_resume', '1');
    } else if (!preview.useExistingResume) {
      // User removed the resume
      submitData.append('remove_resume', '1');
    }

    // Handle photo upload
    if (formData.photo) {
      submitData.append('photo', formData.photo);
      submitData.append('replace_photo', '1');
    } else if (!preview.useExistingPhoto) {
      // User removed the photo
      submitData.append('remove_photo', '1');
    }

    Swal.fire({
      title: 'Update Application?',
      text: 'Are you sure you want to update this application?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        router.post(route('backend.applications.update', application.id), submitData, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: 'Application has been updated successfully.',
              timer: 1500,
              showConfirmButton: false
            });
            router.get(route('backend.applications.show', application.id));
          },
          onError: (err) => {
            setIsSubmitting(false);
            if (err.response?.data?.errors) {
              setErrors(err.response.data.errors);
            }
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to update application. Please try again.',
            });
          },
        });
      } else {
        setIsSubmitting(false);
      }
    });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if job has education requirement
  const hasEducationRequirement = job.education_requirement && job.education_requirement !== 'none';

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Application - ${application.name}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" size={16} />
            Back to Application
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Application</h1>
          <p className="text-gray-600 mt-1">Update your application for {job.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaBriefcase className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.category?.name || 'General'}</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3 text-sm">
                  <FaBuilding className="text-gray-400" />
                  <span className="text-gray-600">{job.user?.name || 'Company'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span className="text-gray-600">{job.location?.name || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-gray-600">Deadline: {formatDate(job.application_deadline)}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-3 text-sm">
                    <FaMoneyBillWave className="text-gray-400" />
                    <span className="text-gray-600 font-medium">{job.salary}</span>
                  </div>
                )}
                {hasEducationRequirement && (
                  <div className="flex items-center gap-3 text-sm bg-yellow-50 p-2 rounded-lg">
                    <FaGraduationCap className="text-yellow-600" />
                    <span className="text-yellow-800 font-medium">
                      Education: {getEducationDisplay(job.education_requirement)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  Applications are reviewed within 5-7 business days
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* Mode Selection Toggle */}
              {hasProfile && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaUserCircle className="text-blue-600 text-2xl" />
                      <div>
                        <p className="font-medium text-gray-900">Application Mode</p>
                        <p className="text-xs text-gray-600">
                          {mode === 'profile'
                            ? 'Using your saved profile information'
                            : 'Using custom information for this application'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setMode('profile')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${mode === 'profile'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        Use Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('custom')}
                        className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${mode === 'custom'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Photo Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h2>

                {/* Existing Photo Display */}
                {preview.useExistingPhoto && preview.existingPhotoUrl && !preview.photo && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={preview.existingPhotoUrl}
                        alt="Current"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Photo</p>
                        <p className="text-xs text-gray-500">This will be used unless you upload a new one</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => resetToOriginal('photo')}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <FaTrash size={14} /> Remove
                    </button>
                  </div>
                )}

                {/* New Photo Preview */}
                {preview.photo && (
                  <div className="relative inline-block">
                    <img
                      src={preview.photo}
                      alt="New"
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('photo')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Upload New Photo */}
                {!preview.photo && (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'photo')}
                    onDragLeave={(e) => handleDrag(e, 'photo')}
                    onDragOver={(e) => handleDrag(e, 'photo')}
                    onDrop={(e) => handleDrop(e, 'photo')}
                    onClick={() => photoInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
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
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="hidden"
                    />
                    <FaCamera className="mx-auto text-gray-400 text-3xl mb-2" />
                    <p className="text-sm text-gray-600">
                      {preview.useExistingPhoto && preview.existingPhotoUrl
                        ? 'Upload a new photo to replace the current one'
                        : 'Upload your profile photo (optional)'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 2MB)</p>
                  </div>
                )}
                {fileErrors.photo && (
                  <p className="text-xs text-red-500 mt-2">{fileErrors.photo}</p>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name {mode === 'custom' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={mode === 'profile'}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${mode === 'profile' ? 'bg-gray-100 text-gray-500' : 'bg-white'
                          } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address {mode === 'custom' && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={mode === 'profile'}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${mode === 'profile' ? 'bg-gray-100 text-gray-500' : 'bg-white'
                          } ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={mode === 'profile'}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${mode === 'profile' ? 'bg-gray-100 text-gray-500' : 'bg-white'
                          } border-gray-300`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Salary (Optional)
                    </label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        name="expected_salary"
                        value={formData.expected_salary}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your expected salary"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume/CV Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV <span className="text-red-500">*</span>
                </label>

                {/* Existing Resume Display */}
                {preview.useExistingResume && preview.existingResumeUrl && !preview.resume && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFilePdf className="text-green-600" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Current Resume/CV</p>
                        <p className="text-xs text-gray-500">This will be used unless you upload a new one</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {preview.existingResumeUrl && (
                        <a
                          href={preview.existingResumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <FaEye size={14} /> View
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => resetToOriginal('resume')}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <FaTrash size={14} /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* New Resume Preview */}
                {preview.resume && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg">
                      {getFileIcon(preview.resumeType)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{preview.resume}</p>
                        <p className="text-xs text-gray-500">New resume - will replace current</p>
                      </div>
                      <div className="flex gap-2">
                        {preview.resumeType === 'application/pdf' && (
                          <button
                            type="button"
                            onClick={() => setShowPdfPreview(true)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Preview PDF"
                          >
                            <FaEye size={18} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile('resume')}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload New Resume */}
                {!preview.resume && (
                  <div
                    onDragEnter={(e) => handleDrag(e, 'resume')}
                    onDragLeave={(e) => handleDrag(e, 'resume')}
                    onDragOver={(e) => handleDrag(e, 'resume')}
                    onDrop={(e) => handleDrop(e, 'resume')}
                    onClick={() => resumeInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
                      ${dragActive.resume
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }
                    `}
                  >
                    <input
                      ref={resumeInputRef}
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'resume')}
                      className="hidden"
                    />
                    <FaCloudUploadAlt className="mx-auto text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-600">
                      {preview.useExistingResume && preview.existingResumeUrl
                        ? 'Upload a new resume to replace the current one'
                        : 'Drag and drop your resume here, or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                )}

                {fileErrors.resume && (
                  <p className="text-xs text-red-500 mt-2">{fileErrors.resume}</p>
                )}
                {errors.resume && (
                  <p className="text-xs text-red-500 mt-2">{errors.resume}</p>
                )}
              </div>

              {/* Education Confirmation Checkbox */}
              {hasEducationRequirement && (
                <div className="border-t pt-4">
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="education-confirmation"
                        checked={educationConfirmed}
                        onChange={(e) => {
                          setEducationConfirmed(e.target.checked);
                          if (errors.education) {
                            setErrors(prev => ({ ...prev, education: null }));
                          }
                        }}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <label htmlFor="education-confirmation" className="text-sm font-medium text-gray-700">
                          I confirm that I meet the education requirement: <strong>{getEducationDisplay(job.education_requirement)}</strong>
                        </label>
                        <div className="mt-2 p-3 bg-yellow-100 rounded-lg">
                          <div className="flex items-start gap-2">
                            <FaInfoCircle className="text-yellow-700 mt-0.5" size={14} />
                            <p className="text-xs text-yellow-800">
                              <strong>Important:</strong> If you are shortlisted for an interview, you will be required to provide
                              your educational certificates (original or attested copies) for verification. Please ensure you have
                              these documents available.
                            </p>
                          </div>
                        </div>
                        {errors.education && (
                          <p className="mt-2 text-sm text-red-500">{errors.education}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all duration-200"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  <FaSave size={16} />
                  Update Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && pdfFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                className="flex justify-center"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.2}
                />
              </Document>

              {pdfError && (
                <div className="text-center text-red-500 p-8">
                  <FaFilePdf className="mx-auto text-4xl mb-2" />
                  <p>{pdfError}</p>
                  <p className="text-sm mt-2">The file can still be uploaded and will be visible to employers.</p>
                </div>
              )}

              {!pdfFile && !pdfError && (
                <div className="text-center text-gray-500 p-8">
                  <FaFileAlt className="mx-auto text-4xl mb-2" />
                  <p>No PDF file selected</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {numPages > 1 && !pdfError && (
              <div className="flex justify-between items-center p-4 border-t bg-white">
                <button
                  onClick={() => changePage(-1)}
                  disabled={pageNumber <= 1}
                  className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  <FaChevronLeft size={16} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {pageNumber} of {numPages}
                </span>
                <button
                  onClick={() => changePage(1)}
                  disabled={pageNumber >= numPages}
                  className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  <FaChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}