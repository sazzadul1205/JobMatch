// resources/js/Pages/Backend/Apply/Create.jsx

import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaArrowLeft,
  FaFilePdf,
  FaCheckCircle,
  FaInfoCircle,
  FaLinkedin,
  FaFacebook,
  FaDollarSign,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaExternalLinkAlt,
  FaStar,
  FaBuilding,
  FaMapMarkerAlt,
  FaChartLine,
  FaTimesCircle,
  FaSpinner,
  FaRedoAlt,
} from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

export default function ApplyCreate({ jobListing, applicantProfile, cvs }) {
  const [formData, setFormData] = useState({
    cv_id: cvs.find(cv => cv.is_primary)?.id || cvs[0]?.id || '',
    name: (applicantProfile.first_name + ' ' + applicantProfile.last_name).trim() || '',
    email: applicantProfile.email || '',
    phone: applicantProfile.phone || '',
    expected_salary: '',
    linkedin_link: '',
    facebook_link: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAtsPreview, setShowAtsPreview] = useState(false);
  const [atsPreview, setAtsPreview] = useState(null);
  const [isLoadingAts, setIsLoadingAts] = useState(false);

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

  const getDaysLeft = () => {
    const daysLeft = Math.ceil((new Date(jobListing.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
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

  const getAtsScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
    // Reset ATS preview when CV changes
    setAtsPreview(null);
    setShowAtsPreview(false);
  };

  // Preview ATS score before submission
  const handlePreviewAts = async () => {
    if (!formData.cv_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Select CV First',
        text: 'Please select a CV to analyze.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    setIsLoadingAts(true);
    setShowAtsPreview(true);

    try {
      // Get the selected CV URL
      const selectedCv = cvs.find(cv => cv.id === parseInt(formData.cv_id));
      if (!selectedCv) {
        throw new Error('CV not found');
      }

      // Call preview endpoint (you'll need to add this to your controller)
      const response = await fetch(route('backend.apply.preview-ats', {
        job_slug: jobListing.slug,
        cv_id: formData.cv_id,
      }), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAtsPreview(data.ats_preview);
      } else {
        setAtsPreview({ error: data.message || 'Failed to analyze CV' });
      }
    } catch (error) {
      console.error('ATS preview error:', error);
      setAtsPreview({ error: 'Unable to analyze CV. Please proceed with submission.' });
    } finally {
      setIsLoadingAts(false);
    }
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
        text: 'Please fix the errors before submitting.',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    const submissionData = { ...formData };
    if (!submissionData.expected_salary) {
      delete submissionData.expected_salary;
    }

    Swal.fire({
      title: 'Submit Application?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you ready to submit your application for:</p>
          <p class="font-semibold text-blue-600 mb-3">"${jobListing.title}"</p>
          <ul class="list-disc list-inside text-sm text-gray-600">
            <li>Your ATS score will be calculated automatically</li>
            <li>You can track your application status from dashboard</li>
            <li>You will receive updates via email</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit Application',
      cancelButtonText: 'Review Again',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        router.post(route('backend.apply.store', jobListing.slug), submissionData, {
          preserveScroll: true,
          onSuccess: (response) => {
            // Show success with ATS score if available
            const atsScore = response?.props?.flash?.ats_score;
            if (atsScore) {
              Swal.fire({
                icon: 'success',
                title: 'Application Submitted!',
                html: `
                  <div class="text-center">
                    <p>Your application has been submitted successfully.</p>
                    <div class="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p class="text-sm font-medium text-blue-800">ATS Compatibility Score</p>
                      <p class="text-2xl font-bold ${getAtsScoreColor(atsScore)}">${atsScore}%</p>
                      <p class="text-xs text-gray-500 mt-1">View full analysis in your dashboard</p>
                    </div>
                  </div>
                `,
                timer: 4000,
                showConfirmButton: true,
                confirmButtonColor: '#10b981',
              });
            } else {
              Swal.fire({
                icon: 'success',
                title: 'Application Submitted!',
                text: 'Your application has been submitted successfully. ATS score is being calculated...',
                timer: 3000,
                showConfirmButton: false,
              });
            }
          },
          onError: (errors) => {
            console.error('Submission error:', errors);
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
                title: 'Submission Failed',
                text: errors.response?.data?.message || 'Failed to submit application. Please try again.',
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

  const isExpired = new Date(jobListing.application_deadline) < new Date();

  // ATS Preview Component
  const AtsPreviewCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300">
      <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaChartLine className="text-white" size={18} />
            <h3 className="font-semibold text-white">ATS Score Preview</h3>
          </div>
          <button
            onClick={() => setShowAtsPreview(false)}
            className="text-white/80 hover:text-white"
          >
            <FaTimesCircle size={16} />
          </button>
        </div>
      </div>
      <div className="p-6">
        {isLoadingAts ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
            <p className="text-gray-600">Analyzing your CV against job requirements...</p>
          </div>
        ) : atsPreview?.error ? (
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">
              <FaTimesCircle size={32} className="mx-auto" />
            </div>
            <p className="text-gray-700">{atsPreview.error}</p>
            <button
              onClick={handlePreviewAts}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : atsPreview ? (
          <div className="space-y-4">
            {/* Score Circle */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-3" style={{
                background: `conic-gradient(${atsPreview.percentage >= 80 ? '#10b981' : atsPreview.percentage >= 60 ? '#3b82f6' : atsPreview.percentage >= 40 ? '#f59e0b' : '#ef4444'} ${atsPreview.percentage * 3.6}deg, #e5e7eb ${atsPreview.percentage * 3.6}deg)`
              }}>
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getAtsScoreColor(atsPreview.percentage)}`}>
                    {atsPreview.percentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Compatibility Score</p>
              {atsPreview.analysis && (
                <p className={`text-xs mt-1 ${atsPreview.analysis.color === 'green' ? 'text-green-600' :
                  atsPreview.analysis.color === 'blue' ? 'text-blue-600' :
                    atsPreview.analysis.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {atsPreview.analysis.message}
                </p>
              )}
            </div>

            {/* Keywords Match */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-green-600 font-medium">Matched</p>
                <p className="text-xl font-bold text-green-700">{atsPreview.matched_count || 0}</p>
                <p className="text-xs text-gray-500">keywords</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded-lg">
                <p className="text-red-600 font-medium">Missing</p>
                <p className="text-xl font-bold text-red-700">{atsPreview.missing_count || 0}</p>
                <p className="text-xs text-gray-500">keywords</p>
              </div>
            </div>

            {/* Top Matched Keywords */}
            {atsPreview.top_matched?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600 mb-2">✓ Top Matched Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {atsPreview.top_matched.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Missing Keywords */}
            {atsPreview.top_missing?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-2">⚠ Missing Keywords to Add</p>
                <div className="flex flex-wrap gap-1">
                  {atsPreview.top_missing.slice(0, 5).map((keyword, idx) => (
                    <span key={idx} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {atsPreview.analysis?.suggestions?.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-800 mb-2">💡 Suggestions to Improve</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  {atsPreview.analysis.suggestions.slice(0, 2).map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-2">
              * This is a preview. Final score will be calculated after submission.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <Head title={`Apply for ${jobListing.title}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
            <span className="text-sm">Back to Job</span>
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-4">
              <h1 className="text-xl font-bold text-white">Apply for Position</h1>
              <p className="text-blue-100 text-sm mt-1">Complete the form below to submit your application</p>
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
                      <FaBuilding size={14} />
                      <span>{jobListing.employer?.name || 'Company'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt size={14} />
                      <span>Multiple Locations</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt size={14} />
                      <span>{getJobTypeLabel(jobListing.job_type)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStar size={14} />
                      <span>{jobListing.experience_level}</span>
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaDollarSign size={14} />
                      <span>Salary: {getSalaryDisplay()}</span>
                    </div>
                  </div>

                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <FaClock size={12} />
                    <span>Deadline: {formatDate(jobListing.application_deadline)} ({getDaysLeft()})</span>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900">Application Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Please fill in all required fields</p>
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
                        {cvs.map((cv) => (
                          <label
                            key={cv.id}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${formData.cv_id === cv.id
                              ? 'border-blue-500 bg-blue-50'
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
                                {cv.is_primary && (
                                  <span className="text-xs text-green-600">Primary CV</span>
                                )}
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
                        ))}
                      </div>
                    )}
                    {errors.cv_id && <p className="text-red-500 text-xs mt-1">{errors.cv_id}</p>}
                  </div>

                  {/* ATS Preview Button */}
                  {cvs.length > 0 && formData.cv_id && !showAtsPreview && (
                    <div>
                      <button
                        type="button"
                        onClick={handlePreviewAts}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        <FaChartLine size={14} />
                        Preview ATS Score Before Submitting
                      </button>
                    </div>
                  )}

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

                  {/* Info Note */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-0.5 shrink-0" size={16} />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Application Information</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Your application will be reviewed by the employer</li>
                        <li>ATS score will be calculated automatically using your CV</li>
                        <li>You can view detailed ATS analysis in your dashboard</li>
                        <li>You can edit your application until it's reviewed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || cvs.length === 0}
                    className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle size={16} />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* ATS Preview Card (shown when toggled) */}
              {showAtsPreview && <AtsPreviewCard />}

              {/* Application Tips */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
                  <h3 className="font-semibold text-white">Application Tips</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Choose the right CV</p>
                      <p className="text-xs text-gray-500">Select the CV that best matches this job for higher ATS score</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Preview ATS score</p>
                      <p className="text-xs text-gray-500">Check how well your CV matches before submitting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Track your application</p>
                      <p className="text-xs text-gray-500">Monitor status and ATS score from your dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Application */}
              {jobListing.is_external_apply && jobListing.external_apply_links?.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-linear-to-r from-orange-600 to-red-600">
                    <h3 className="font-semibold text-white">External Application</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-3">
                      This employer accepts applications through external sites:
                    </p>
                    {jobListing.external_apply_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mb-2"
                      >
                        <FaExternalLinkAlt size={12} />
                        Apply on External Site
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements Note */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-yellow-600 mt-0.5 shrink-0" size={16} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Before You Apply</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      <li>Make sure your CV is up to date</li>
                      <li>Check that you meet the requirements</li>
                      <li>Ensure your expected salary is within the range</li>
                      <li>Use the ATS preview to optimize your CV</li>
                    </ul>
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