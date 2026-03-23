// pages/jobs/show.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiTag,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiAward,
  FiGlobe,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiExternalLink,
  FiEdit2,
  FiTrash2,
  FiPower,
  FiEye,
  FiEyeOff,
  FiDownload,
  FiStar,
  FiBarChart2,
  FiMail,
  FiPhone,
  FiLink,
  FiUser,
  FiPlus,
  FiSearch
} from 'react-icons/fi';

const JobShow = ({ job, hasApplied, canApply, userRole, applications }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // details, applications, analytics

  const { post, patch, delete: destroy, processing } = useForm();
  const { post: statusPost, processing: statusProcessing } = useForm();

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'green', icon: FiCheckCircle, text: 'Active' },
      inactive: { color: 'gray', icon: FiXCircle, text: 'Inactive' },
      expired: { color: 'red', icon: FiAlertCircle, text: 'Expired' },
      draft: { color: 'yellow', icon: FiAlertCircle, text: 'Draft' }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="mr-1" size={12} />
        {config.text}
      </span>
    );
  };

  // Get application status badge
  const getApplicationStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: FiClock, text: 'Pending' },
      reviewed: { color: 'blue', icon: FiEye, text: 'Reviewed' },
      shortlisted: { color: 'purple', icon: FiStar, text: 'Shortlisted' },
      rejected: { color: 'red', icon: FiXCircle, text: 'Rejected' },
      hired: { color: 'green', icon: FiCheckCircle, text: 'Hired' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="mr-1" size={12} />
        {config.text}
      </span>
    );
  };

  // Handle toggle active status
  const toggleActiveStatus = () => {
    patch(route('backend.listing.toggle-active', job.id), {
      preserveScroll: true,
      onSuccess: () => {
        setShowStatusModal(false);
      }
    });
  };

  // Handle delete job
  const deleteJob = () => {
    destroy(route('backend.listing.destroy', job.id), {
      preserveScroll: true,
      onSuccess: () => {
        setShowDeleteModal(false);
      }
    });
  };

  // Handle apply for job
  const applyForJob = () => {
    post(route('applications.store', job.id), {
      preserveScroll: true
    });
  };

  // Handle update application status
  const updateApplicationStatus = (applicationId, status) => {
    statusPost(route('backend.application.update-status', applicationId), {
      data: { status },
      preserveScroll: true,
      onSuccess: () => {
        setSelectedApplication(null);
      }
    });
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!job.application_deadline) return false;
    return new Date(job.application_deadline) < new Date();
  };

  const deadlinePassed = isDeadlinePassed();
  const isActive = job.is_active && !deadlinePassed;

  // Render job details tab
  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Job Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge(isActive ? 'active' : (deadlinePassed ? 'expired' : 'inactive'))}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <FiBriefcase className="mr-1" size={12} />
                {job.job_type?.replace('-', ' ').toUpperCase()}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <FiAward className="mr-1" size={12} />
                {job.experience_level}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 md:mt-0">
            {userRole === 'employer' || userRole === 'admin' ? (
              <>
                <Link
                  href={route('backend.listing.edit', job.id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150 flex items-center gap-2"
                >
                  <FiEdit2 size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className={`px-4 py-2 rounded-lg transition duration-150 flex items-center gap-2 ${isActive
                      ? 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                      : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                >
                  {isActive ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition duration-150 flex items-center gap-2"
                >
                  <FiTrash2 size={16} />
                  Delete
                </button>
              </>
            ) : (
              userRole === 'job_seeker' && canApply && !hasApplied && !deadlinePassed && (
                <button
                  onClick={applyForJob}
                  disabled={processing}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                >
                  {processing ? 'Applying...' : 'Apply Now'}
                </button>
              )
            )}

            {hasApplied && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                <FiCheckCircle size={16} />
                Applied
              </span>
            )}
          </div>
        </div>

        {/* Job Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">{job.location || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiDollarSign className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="text-sm font-medium text-gray-900">{job.salary_range || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiClock className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(job.application_deadline)}</p>
              {deadlinePassed && (
                <p className="text-xs text-red-600">Deadline passed</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FiCalendar className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Posted on</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(job.created_at)}</p>
            </div>
          </div>
        </div>

        {job.remote_policy && (
          <div className="flex items-center gap-3 pt-4 border-t mt-4">
            <FiGlobe className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Remote Policy</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {job.remote_policy.replace('_', ' ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Job Description */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
        </div>
      </div>

      {/* Keywords & Skills */}
      {job.keywords && job.keywords.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {(job.contact_email || job.contact_phone || job.company_website) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            {job.contact_email && (
              <div className="flex items-center gap-3">
                <FiMail className="text-gray-400" size={18} />
                <a href={`mailto:${job.contact_email}`} className="text-indigo-600 hover:text-indigo-700">
                  {job.contact_email}
                </a>
              </div>
            )}
            {job.contact_phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="text-gray-400" size={18} />
                <a href={`tel:${job.contact_phone}`} className="text-indigo-600 hover:text-indigo-700">
                  {job.contact_phone}
                </a>
              </div>
            )}
            {job.company_website && (
              <div className="flex items-center gap-3">
                <FiLink className="text-gray-400" size={18} />
                <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Company Website
                  <FiExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render applications tab (for employers/admins)
  const renderApplicationsTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {applications && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.total || 0}</p>
              </div>
              <FiUsers className="text-indigo-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{applications.pending || 0}</p>
              </div>
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-purple-600">{applications.shortlisted || 0}</p>
              </div>
              <FiStar className="text-purple-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hired</p>
                <p className="text-2xl font-bold text-green-600">{applications.hired || 0}</p>
              </div>
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
        </div>

        {applications && applications.data && applications.data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {applications.data.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {application.applicant?.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Applied on {formatDate(application.created_at)}
                        </p>
                      </div>
                    </div>

                    {application.ats_score && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <FiBarChart2 className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-600">ATS Score:</span>
                          <div className="flex-1 max-w-xs">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-indigo-600 rounded-full h-2"
                                style={{ width: `${application.ats_score.total || 0}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round(application.ats_score.total || 0)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {getApplicationStatusBadge(application.status)}
                    <div className="flex gap-2">
                      <Link
                        href={route('backend.application.show', application.id)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                      >
                        View Details
                      </Link>
                      {application.resume_path && (
                        <a
                          href={route('backend.application.download-resume', application.id)}
                          className="text-gray-600 hover:text-gray-700 text-sm flex items-center gap-1"
                        >
                          <FiDownload size={14} />
                          Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiUsers className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Applications will appear here once candidates start applying.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render analytics tab
  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">ATS Analytics</h2>
        <div className="text-center py-12">
          <FiBarChart2 className="mx-auto text-gray-400" size={48} />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</h3>
          <p className="mt-1 text-sm text-gray-500">
            Detailed analytics and ATS insights will be available soon.
          </p>
        </div>
      </div>
    </div>
  );

  // Delete confirmation modal
  const renderDeleteModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Job Listing</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete "{job.title}"? This action cannot be undone.
            {applications && applications.total > 0 && (
              <span className="block mt-2 text-red-600">
                Warning: This job has {applications.total} application(s). Deleting will also remove all applications.
              </span>
            )}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={deleteJob}
              disabled={processing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {processing ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Status toggle modal
  const renderStatusModal = () => {
    if (!showStatusModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isActive ? 'Deactivate Job' : 'Activate Job'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isActive
              ? `Are you sure you want to deactivate "${job.title}"? Deactivated jobs will not be visible to job seekers.`
              : `Are you sure you want to activate "${job.title}"? Activated jobs will be visible to job seekers.`
            }
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={toggleActiveStatus}
              disabled={statusProcessing}
              className={`px-4 py-2 rounded-lg text-white disabled:opacity-50 ${isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {statusProcessing ? 'Processing...' : (isActive ? 'Deactivate' : 'Activate')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title={`${job.title} - Job Details`} />

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={route('backend.listing.index')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Jobs
          </Link>
        </div>

        {/* Tabs Navigation */}
        {(userRole === 'employer' || userRole === 'admin') && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'details'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Job Details
              </button>
              <button
                onClick={() => setActiveTab('applications')}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'applications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Applications
                {applications && applications.total > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {applications.total}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-4 px-1 text-sm font-medium border-b-2 transition ${activeTab === 'analytics'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'details' && renderDetailsTab()}
        {(userRole === 'employer' || userRole === 'admin') && activeTab === 'applications' && renderApplicationsTab()}
        {(userRole === 'employer' || userRole === 'admin') && activeTab === 'analytics' && renderAnalyticsTab()}

        {/* For job seekers, always show details */}
        {userRole === 'job_seeker' && renderDetailsTab()}

        {/* Modals */}
        {renderDeleteModal()}
        {renderStatusModal()}
      </div>
    </AuthenticatedLayout>
  );
};

export default JobShow;
