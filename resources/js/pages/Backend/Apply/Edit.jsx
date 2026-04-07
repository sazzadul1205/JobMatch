// resources/js/Pages/Backend/Apply/Edit.jsx

import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaArrowLeft,
  FaFilePdf,
  FaInfoCircle,
  FaLinkedin,
  FaFacebook,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaClock,
  FaStar,
  FaBuilding,
  FaMapMarkerAlt,
  FaSave,
  FaTrash,
  FaSpinner,
  FaCheckCircle,
} from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

export default function ApplyEdit({ application, jobListing, cvs, currentCvId }) {
  const [formData, setFormData] = useState({
    cv_id: currentCvId || cvs.find(cv => cv.is_primary)?.id || cvs[0]?.id || '',
    name: application.name || '',
    email: application.email || '',
    phone: application.phone || '',
    expected_salary: application.expected_salary || '',
    linkedin_link: application.linkedin_link || '',
    facebook_link: application.facebook_link || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if salary input should be shown
  const showSalaryInput = () => {
    if (jobListing.as_per_companies_policy) return false;
    if (jobListing.is_salary_negotiable) return false;
    return (jobListing.salary_min || jobListing.salary_max);
  };

  // Get salary placeholder text
  const getSalaryPlaceholder = () => {
    if (jobListing.salary_min && jobListing.salary_max) {
      return `Between ${jobListing.salary_min.toLocaleString()} - ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    if (jobListing.salary_min) {
      return `Minimum ${jobListing.salary_min.toLocaleString()} BDT`;
    }
    if (jobListing.salary_max) {
      return `Maximum ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    return 'Enter your expected salary';
  };

  // Validate salary against range
  const validateSalary = (salary) => {
    if (!salary) return true;
    const numSalary = parseFloat(salary);
    if (isNaN(numSalary)) return false;

    if (jobListing.salary_min && numSalary < jobListing.salary_min) return false;
    if (jobListing.salary_max && numSalary > jobListing.salary_max) return false;
    return true;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getJobTypeLabel = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'remote': 'Remote',
      'hybrid': 'Hybrid',
    };
    return types[type] || type;
  };

  const getSalaryDisplay = () => {
    if (jobListing.as_per_companies_policy) return 'As per company policy';
    if (jobListing.is_salary_negotiable) return 'Negotiable';
    if (jobListing.salary_min && jobListing.salary_max) {
      return `${jobListing.salary_min.toLocaleString()} - ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    if (jobListing.salary_min) return `From ${jobListing.salary_min.toLocaleString()} BDT`;
    if (jobListing.salary_max) return `Up to ${jobListing.salary_max.toLocaleString()} BDT`;
    return 'Not specified';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCvSelect = (cvId) => {
    setFormData(prev => ({ ...prev, cv_id: cvId }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cv_id) newErrors.cv_id = 'Please select a CV';
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (showSalaryInput() && formData.expected_salary) {
      if (!validateSalary(formData.expected_salary)) {
        if (jobListing.salary_min && jobListing.salary_max) {
          newErrors.expected_salary = `Expected salary must be between ${jobListing.salary_min.toLocaleString()} and ${jobListing.salary_max.toLocaleString()} BDT`;
        } else if (jobListing.salary_min) {
          newErrors.expected_salary = `Expected salary must be at least ${jobListing.salary_min.toLocaleString()} BDT`;
        } else if (jobListing.salary_max) {
          newErrors.expected_salary = `Expected salary must not exceed ${jobListing.salary_max.toLocaleString()} BDT`;
        }
      }
    }

    if (jobListing.required_linkedin_link && !formData.linkedin_link) {
      newErrors.linkedin_link = 'LinkedIn profile is required for this application';
    }
    if (jobListing.required_facebook_link && !formData.facebook_link) {
      newErrors.facebook_link = 'Facebook profile is required for this application';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before saving.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const submissionData = { ...formData };
    if (!submissionData.expected_salary) {
      delete submissionData.expected_salary;
    }

    // Check if CV has changed
    const cvChanged = formData.cv_id !== currentCvId;

    Swal.fire({
      title: 'Save Changes?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to update your application for:</p>
          <p class="font-semibold text-blue-600 mb-3">"${jobListing.title}"</p>
          <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
            ${cvChanged ? '<li class="text-orange-600">⚠️ Changing your CV will trigger an ATS score recalculation</li>' : ''}
            <li>You can only edit while application is pending</li>
            <li>Changes will be reflected immediately</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save Changes',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        router.put(route('backend.apply.update', application.id), submissionData, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: cvChanged ? 'Application Updated! ATS Score Recalculated' : 'Application Updated!',
              text: cvChanged
                ? 'Your application has been updated and your ATS score has been recalculated.'
                : 'Your application has been updated successfully.',
              timer: 2500,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.apply.show', application.id));
            });
          },
          onError: (errors) => {
            console.error('Update error:', errors);
            if (errors.response?.data?.errors) {
              setErrors(errors.response.data.errors);
              Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the form for errors.',
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: errors.response?.data?.message || 'Failed to update application. Please try again.',
                confirmButtonColor: '#2563eb',
              });
            }
            setIsSubmitting(false);
          },
          onFinish: () => {
            setIsSubmitting(false);
          },
        });
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Application for ${jobListing.title}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <button
                onClick={() => router.visit(route('backend.apply.show', application.id))}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                <span className="text-sm">Back to Application</span>
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Edit Application
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update your application for {jobListing.title}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <FaInfoCircle size={12} />
                You can only edit while application is pending
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Summary Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" />
                    Job Summary
                  </h2>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{jobListing.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt size={14} />
                      <span>Multiple Locations</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock size={14} />
                      <span>{getJobTypeLabel(jobListing.job_type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStar size={14} />
                      <span className="capitalize">{jobListing.experience_level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign size={14} />
                      <span>Salary: {getSalaryDisplay()}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <FaClock size={12} />
                    <span>Deadline: {formatDate(jobListing.application_deadline)}</span>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Edit Application Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your application details below</p>
                </div>

                <div className="p-6 space-y-5">
                  {/* CV Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select CV / Resume <span className="text-red-500">*</span>
                    </label>
                    {cvs.length === 0 ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-yellow-800 text-sm mb-2">No CV found in your profile</p>
                        <a
                          href={route('profile.index')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Upload a CV first →
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {cvs.map((cv) => {
                          const isCurrentCv = currentCvId === cv.id;
                          const isSelected = formData.cv_id === cv.id;
                          const willChangeCv = isSelected && !isCurrentCv;

                          return (
                            <label
                              key={cv.id}
                              className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                ? willChangeCv
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="cv_id"
                                  value={cv.id}
                                  checked={formData.cv_id === cv.id}
                                  onChange={() => handleCvSelect(cv.id)}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <FaFilePdf className="text-red-500" size={20} />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{cv.original_name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {cv.is_primary && (
                                      <span className="text-xs text-green-600 flex items-center gap-1">
                                        <FaCheckCircle size={10} /> Primary
                                      </span>
                                    )}
                                    {isCurrentCv && (
                                      <span className="text-xs text-blue-600">(Currently used)</span>
                                    )}
                                    {willChangeCv && (
                                      <span className="text-xs text-orange-600">(Will recalculate ATS)</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={cv.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View
                              </a>
                            </label>
                          );
                        })}
                      </div>
                    )}
                    {errors.cv_id && <p className="text-red-500 text-xs mt-1">{errors.cv_id}</p>}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <FaInfoCircle size={10} />
                      Changing your CV will trigger a recalculation of your ATS score
                    </p>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+880 1234 567890"
                        />
                      </div>
                    </div>

                    {/* Expected Salary */}
                    {showSalaryInput() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Salary (BDT)
                        </label>
                        <div className="relative">
                          <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                          <input
                            type="number"
                            name="expected_salary"
                            value={formData.expected_salary}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expected_salary ? 'border-red-500' : 'border-gray-300'
                              }`}
                            placeholder={getSalaryPlaceholder()}
                          />
                        </div>
                        {errors.expected_salary && (
                          <p className="text-red-500 text-xs mt-1">{errors.expected_salary}</p>
                        )}
                        {application.expected_salary && (
                          <p className="text-xs text-gray-400 mt-1">
                            Current: {formatCurrency(application.expected_salary)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {jobListing.required_linkedin_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-700" size={16} />
                        <input
                          type="url"
                          name="linkedin_link"
                          value={formData.linkedin_link}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.linkedin_link ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      {errors.linkedin_link && <p className="text-red-500 text-xs mt-1">{errors.linkedin_link}</p>}
                    </div>
                  )}

                  {jobListing.required_facebook_link && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook Profile <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaFacebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" size={16} />
                        <input
                          type="url"
                          name="facebook_link"
                          value={formData.facebook_link}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.facebook_link ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      {errors.facebook_link && <p className="text-red-500 text-xs mt-1">{errors.facebook_link}</p>}
                    </div>
                  )}

                  {/* Current ATS Score Info */}
                  {application.ats_score && application.ats_calculation_status === 'completed' && (
                    <div className={`rounded-lg p-4 flex items-start gap-3 ${application.ats_score >= 70 ? 'bg-green-50' :
                      application.ats_score >= 50 ? 'bg-yellow-50' : 'bg-red-50'
                      }`}>
                      <FaStar className={`mt-0.5 shrink-0 ${application.ats_score >= 70 ? 'text-green-600' :
                        application.ats_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`} size={16} />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Current ATS Score: {Math.round(application.ats_score)}%</p>
                        <p className="text-xs">
                          {application.ats_score >= 70 ? 'Great match! Your resume aligns well with this job.' :
                            application.ats_score >= 50 ? 'Good match. Consider optimizing your resume for better results.' :
                              'Low match. We recommend updating your resume with relevant keywords.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Info Note */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-0.5 shrink-0" size={16} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Important Notes</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Changing your CV will trigger an ATS score recalculation</li>
                        <li>Your application status will remain as "Pending"</li>
                        <li>Employer will see the updated information</li>
                        <li>You cannot edit after the application is reviewed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.visit(route('backend.apply.show', application.id))}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || cvs.length === 0}
                    className="px-6 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Tips */}
            <div className="space-y-6">
              {/* Current Application Info */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="px-6 py-4 bg-linear-to-r from-blue-600 to-indigo-600">
                  <h3 className="font-semibold text-white">Current Application Info</h3>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Application ID</span>
                    <span className="text-sm font-medium text-gray-900">#{application.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Submitted On</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(application.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <FaClock size={10} />
                      Pending
                    </span>
                  </div>
                  {application.ats_score && application.ats_calculation_status === 'completed' && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Current ATS Score</span>
                      <span className={`text-sm font-bold ${application.ats_score >= 70 ? 'text-green-600' :
                        application.ats_score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {Math.round(application.ats_score)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Tips */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
                  <h3 className="font-semibold text-white">Edit Tips</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Update your CV if needed</p>
                      <p className="text-xs text-gray-500">Choose a more relevant CV for better ATS score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Double-check information</p>
                      <p className="text-xs text-gray-500">Ensure all details are correct before saving</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">ATS score will recalculate</p>
                      <p className="text-xs text-gray-500">If you change your CV, ATS score will update automatically</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning Card */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-600 mt-0.5 shrink-0" size={16} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important</p>
                    <p className="text-xs">
                      Once your application is reviewed by the employer, you will no longer be able to edit it.
                      Make sure all information is accurate before saving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}