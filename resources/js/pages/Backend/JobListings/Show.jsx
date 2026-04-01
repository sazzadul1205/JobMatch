// resources/js/pages/Backend/JobListings/Show.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';

// Icons
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaGraduationCap,
  FaClock,
  FaTag,
  FaShareAlt,
  FaLinkedin,
  FaFacebook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaBuilding,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaFileAlt,
  FaListUl,
  FaChartLine,
  FaUsers,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function Show({ jobListing, auth }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const handleToggleActive = () => {
    if (isTogglingActive) return;

    setIsTogglingActive(true);
    router.patch(route('backend.listing.toggle-active', jobListing.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setIsTogglingActive(false);
      },
      onError: () => {
        setIsTogglingActive(false);
        alert('Failed to update status');
      },
    });
  };

  const handleDelete = () => {
    if (isDeleting) return;

    setIsDeleting(true);
    router.delete(route('backend.listing.destroy', jobListing.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleting(false);
        setShowDeleteModal(false);
      },
      onError: () => {
        setIsDeleting(false);
        alert('Failed to delete job listing');
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    try {
      return format(new Date(date), 'PPP');
    } catch {
      return date;
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return salary;
  };

  const formatJobType = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship',
      'remote': 'Remote'
    };
    return types[type] || type;
  };

  const formatExperienceLevel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'junior': 'Junior',
      'mid': 'Mid Level',
      'senior': 'Senior',
      'lead': 'Lead',
      'executive': 'Executive',
      'intern': 'Intern'
    };
    return levels[level] || level;
  };

  const formatEducation = (edu) => {
    const levels = {
      'high-school': 'High School',
      'associate': 'Associate Degree',
      'bachelor': "Bachelor's Degree",
      'master': "Master's Degree",
      'phd': 'PhD',
      'none': 'No Formal Education Required'
    };
    return levels[edu] || edu || 'Not specified';
  };

  const DeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)} />

          <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">Delete Job Listing</h3>
              </div>
            </div>

            <div className="px-6 py-4">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete <strong className="text-red-600">"{jobListing.title}"</strong>?
              </p>
              {jobListing.applications_count > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <FaExclamationTriangle size={14} />
                    This job has {jobListing.applications_count} application(s).
                    Deleting it will also remove all associated applications.
                  </p>
                </div>
              )}
              <p className="text-sm text-red-600 mt-3 flex items-center gap-2">
                <FaExclamationTriangle size={12} />
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition"
              >
                {isDeleting && <FaSpinner className="animate-spin" size={16} />}
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Parse JSON fields if they're strings
  const skills = typeof jobListing.skills === 'string' ? JSON.parse(jobListing.skills || '[]') : (jobListing.skills || []);
  const benefits = typeof jobListing.benefits === 'string' ? JSON.parse(jobListing.benefits || '[]') : (jobListing.benefits || []);
  const responsibilities = typeof jobListing.responsibilities === 'string' ? JSON.parse(jobListing.responsibilities || '[]') : (jobListing.responsibilities || []);
  const keywords = typeof jobListing.keywords === 'string' ? JSON.parse(jobListing.keywords || '[]') : (jobListing.keywords || []);

  return (
    <AuthenticatedLayout>
      <Head title={`View Job: ${jobListing.title}`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <a
                  href={route('backend.listing.index')}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
                >
                  <FaArrowLeft className="mr-2" size={16} />
                  Back to Job Listings
                </a>
                <h1 className="text-3xl font-bold text-gray-900">{jobListing.title}</h1>
                <p className="text-gray-600 mt-1">
                  Created by {jobListing.user?.name} • {formatDate(jobListing.created_at)}
                </p>
              </div>

              <div className="flex gap-3">
                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${jobListing.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                  {jobListing.is_active ? (
                    <>
                      <FaCheckCircle size={14} />
                      Active
                    </>
                  ) : (
                    <>
                      <FaEyeSlash size={14} />
                      Inactive
                    </>
                  )}
                </div>

                {/* Toggle Active Button */}
                <button
                  onClick={handleToggleActive}
                  disabled={isTogglingActive}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${jobListing.is_active
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                >
                  {isTogglingActive ? (
                    <FaSpinner className="animate-spin" size={16} />
                  ) : jobListing.is_active ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                  {jobListing.is_active ? 'Deactivate' : 'Activate'}
                </button>

                {/* Edit Button */}
                <a
                  href={route('backend.listing.edit', jobListing.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
                >
                  <FaEdit size={16} />
                  Edit
                </a>

                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
                >
                  <FaTrash size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {jobListing.description && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" />
                    Job Description
                  </h2>
                  <div className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: jobListing.description }} />
                </div>
              )}

              {/* Requirements */}
              {jobListing.requirements && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaListUl className="text-blue-600" />
                    Requirements
                  </h2>
                  <div className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: jobListing.requirements }} />
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-700">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              {keywords.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaBriefcase className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-900">{jobListing.category?.name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{jobListing.location?.name || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMoneyBillWave className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium text-gray-900">{formatSalary(jobListing.salary)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaUserTie className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium text-gray-900">{formatJobType(jobListing.job_type)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaBuilding className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Experience Level</p>
                      <p className="font-medium text-gray-900">{formatExperienceLevel(jobListing.experience_level)}</p>
                    </div>
                  </div>

                  {jobListing.education_requirement && (
                    <div className="flex items-start gap-3">
                      <FaGraduationCap className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Education Required</p>
                        <p className="font-medium text-gray-900">{formatEducation(jobListing.education_requirement)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Application Deadline</p>
                      <p className="font-medium text-gray-900">{formatDate(jobListing.application_deadline)}</p>
                    </div>
                  </div>

                  {jobListing.schedule_start_date && (
                    <div className="flex items-start gap-3">
                      <FaClock className="text-gray-400 mt-1" size={18} />
                      <div>
                        <p className="text-sm text-gray-500">Expected Start Date</p>
                        <p className="font-medium text-gray-900">{formatDate(jobListing.schedule_start_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Posted By Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Posted By</h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserTie className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{jobListing.user?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">Job Poster</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Posted on</p>
                    <p className="font-medium text-gray-900">{formatDate(jobListing.created_at)}</p>
                  </div>

                  {jobListing.updated_at !== jobListing.created_at && (
                    <div>
                      <p className="text-sm text-gray-500">Last updated</p>
                      <p className="font-medium text-gray-900">{formatDate(jobListing.updated_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Sharing Card */}
              {(jobListing.show_linkedin || jobListing.show_facebook) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaShareAlt className="text-blue-600" />
                    Social Sharing
                  </h2>

                  <div className="space-y-2">
                    {jobListing.show_linkedin && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <FaLinkedin size={18} />
                        <span>Will be shared on LinkedIn</span>
                      </div>
                    )}
                    {jobListing.show_facebook && (
                      <div className="flex items-center gap-2 text-blue-600">
                        <FaFacebook size={18} />
                        <span>Will be shared on Facebook</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FaChartLine className="text-blue-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">{jobListing.views_count || 0}</p>
                    <p className="text-xs text-gray-500">Views</p>
                  </div>
                  <a
                    href={route('backend.listing.applications', jobListing.id)}
                    className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition block"
                  >
                    <FaUsers className="text-green-600 mx-auto mb-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{jobListing.applications_count || 0}</p>
                    <p className="text-xs text-gray-500">Applications</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal />
    </AuthenticatedLayout>
  );
}