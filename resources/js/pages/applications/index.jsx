// pages/applications/index.jsx

import { useState, useEffect } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import {
  FiX,
  FiDownload,
  FiEye,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiInbox,
  FiUserCheck,
  FiUserX,
  FiAward
} from 'react-icons/fi';

const ApplicationsIndex = ({ applications, filters, userRole }) => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('pending');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState(filters.status || 'all');

  const { get } = useForm();
  const { delete: destroy, processing: deleteProcessing } = useForm();

  // Update active filter when URL changes
  useEffect(() => {
    setActiveStatusFilter(filters.status || 'all');
  }, [filters.status]);

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: FiClock, text: 'Pending', bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
      reviewed: { color: 'blue', icon: FiEye, text: 'Reviewed', bg: 'bg-blue-100', textColor: 'text-blue-800' },
      shortlisted: { color: 'purple', icon: FiStar, text: 'Shortlisted', bg: 'bg-purple-100', textColor: 'text-purple-800' },
      rejected: { color: 'red', icon: FiX, text: 'Rejected', bg: 'bg-red-100', textColor: 'text-red-800' },
      hired: { color: 'green', icon: FiCheckCircle, text: 'Hired', bg: 'bg-green-100', textColor: 'text-green-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.textColor}`}>
        <Icon className="mr-1" size={12} />
        {config.text}
      </span>
    );
  };

  // Get status filter button styling
  const getStatusFilterClass = (status) => {
    const baseClass = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2";
    const isActive = activeStatusFilter === status;

    if (status === 'all') {
      return `${baseClass} ${isActive
        ? 'bg-gray-900 text-white shadow-md'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;
    }

    const statusColors = {
      pending: isActive ? 'bg-yellow-500 text-white shadow-md' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
      reviewed: isActive ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      shortlisted: isActive ? 'bg-purple-500 text-white shadow-md' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      rejected: isActive ? 'bg-red-500 text-white shadow-md' : 'bg-red-100 text-red-700 hover:bg-red-200',
      hired: isActive ? 'bg-green-500 text-white shadow-md' : 'bg-green-100 text-green-700 hover:bg-green-200'
    };

    return `${baseClass} ${statusColors[status]}`;
  };

  // Get status icon for filter buttons
  const getStatusIcon = (status) => {
    const icons = {
      all: FiInbox,
      pending: FiClock,
      reviewed: FiEye,
      shortlisted: FiStar,
      rejected: FiUserX,
      hired: FiUserCheck
    };
    const Icon = icons[status] || FiInbox;
    return <Icon className="mr-2" size={16} />;
  };

  // Get status counts
  const getStatusCount = (status) => {
    if (!applications.data) return 0;

    if (status === 'all') {
      return applications.total || applications.data.length;
    }

    return applications.data.filter(app => app.status === status).length;
  };

  const toggleSelectAll = () => {
    if (!applications.data) return;
    if (selectedIds.length === applications.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.data.map((app) => app.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyBulkStatus = () => {
    if (selectedIds.length === 0) return;
    router.patch(route('backend.application.bulk-status'), {
      application_ids: selectedIds,
      status: bulkStatus,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedIds([]);
        router.reload({ only: ['applications'] });
      },
    });
  };

  const mergeSelectedResumes = () => {
    if (selectedIds.length === 0) return;
    const url = route('backend.application.merge-resumes') + `?ids=${selectedIds.join(',')}`;
    window.open(url, '_blank');
  };

  // Get ATS score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get ATS score badge
  const getScoreBadge = (score) => {
    if (!score && score !== 0) {
      return <span className="text-xs text-gray-400">Not scored yet</span>;
    }
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[80px]">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`rounded-full h-2 ${score >= 80 ? 'bg-green-600' :
                score >= 60 ? 'bg-blue-600' :
                  score >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
        </div>
        <span className={`text-xs font-medium ${getScoreColor(score)}`}>
          {Math.round(score)}%
        </span>
      </div>
    );
  };

  // Handle filter by status
  const handleStatusFilter = (status) => {
    const queryParams = new URLSearchParams(window.location.search);

    if (status === 'all') {
      queryParams.delete('status');
    } else {
      queryParams.set('status', status);
    }

    // Preserve other filters
    if (filters.min_score) {
      queryParams.set('min_score', filters.min_score);
    }
    if (filters.job_listing_id) {
      queryParams.set('job_listing_id', filters.job_listing_id);
    }

    const newUrl = `${window.location.pathname}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    get(newUrl);
  };

  // Handle filter by min score
  const handleMinScoreFilter = (score) => {
    const queryParams = new URLSearchParams(window.location.search);

    if (score) {
      queryParams.set('min_score', score);
    } else {
      queryParams.delete('min_score');
    }

    if (activeStatusFilter !== 'all') {
      queryParams.set('status', activeStatusFilter);
    }

    const newUrl = `${window.location.pathname}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    get(newUrl);
  };

  // Clear all filters
  const clearFilters = () => {
    get(window.location.pathname);
    setActiveStatusFilter('all');
  };

  // Handle update status
  const handleUpdateStatus = (applicationId, newStatus) => {
    router.patch(route('backend.application.update-status', applicationId), { status: newStatus }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowStatusModal(false);
        setSelectedApplication(null);
        router.reload({ only: ['applications'] });
      },
      onError: () => {
        // Keep modal open so user can retry
      }
    });
  };

  // Handle delete application
  const handleDelete = (applicationId) => {
    destroy(route('backend.application.destroy', applicationId), {
      preserveScroll: true,
      onSuccess: () => {
        setShowDeleteModal(false);
        setSelectedApplication(null);
        // Refresh the page
        window.location.reload();
      }
    });
  };

  // Handle download resume
  const downloadResume = (applicationId) => {
    window.open(route('backend.application.download-resume', applicationId), '_blank');
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'reviewed', label: 'Reviewed', color: 'blue' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
    { value: 'rejected', label: 'Rejected', color: 'red' },
    { value: 'hired', label: 'Hired', color: 'green' }
  ];

  // Render status filter chips
  const renderStatusFilters = () => (
    <div className="mb-6">
      <div className="flex w-full gap-3">
        <button
          onClick={() => handleStatusFilter('all')}
          className={getStatusFilterClass('all')}
        >
          {getStatusIcon('all')}
          All Applications
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('all')}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilter('pending')}
          className={getStatusFilterClass('pending')}
        >
          {getStatusIcon('pending')}
          Pending
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('pending')}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilter('reviewed')}
          className={getStatusFilterClass('reviewed')}
        >
          {getStatusIcon('reviewed')}
          Reviewed
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('reviewed')}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilter('shortlisted')}
          className={getStatusFilterClass('shortlisted')}
        >
          {getStatusIcon('shortlisted')}
          Shortlisted
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('shortlisted')}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilter('rejected')}
          className={getStatusFilterClass('rejected')}
        >
          {getStatusIcon('rejected')}
          Rejected
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('rejected')}
          </span>
        </button>

        <button
          onClick={() => handleStatusFilter('hired')}
          className={getStatusFilterClass('hired')}
        >
          {getStatusIcon('hired')}
          Hired
          <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs text-black">
            {getStatusCount('hired')}
          </span>
        </button>
      </div>
    </div>
  );

  // Render score filter
  const renderScoreFilter = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FiAward size={16} />
          Filter by ATS Score
        </h3>
        {filters.min_score && (
          <button
            onClick={() => handleMinScoreFilter('')}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Clear score filter
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: '', label: 'All Scores', color: 'gray' },
          { value: '80', label: '80%+ (Excellent)', color: 'green' },
          { value: '60', label: '60%+ (Good)', color: 'blue' },
          { value: '40', label: '40%+ (Fair)', color: 'yellow' },
          { value: '20', label: '20%+ (Poor)', color: 'red' }
        ].map(option => (
          <button
            key={option.value}
            onClick={() => handleMinScoreFilter(option.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${(filters.min_score === option.value) || (!filters.min_score && !option.value)
              ? `bg-${option.color}-600 text-black shadow-md`
              : `bg-${option.color}-100 text-${option.color}-700 hover:bg-${option.color}-200`
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Status change modal
  const renderStatusModal = () => {
    if (!showStatusModal || !selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Update Application Status
          </h3>
          <p className="text-gray-600 mb-4">
            Change status for {selectedApplication.name}'s application to {selectedApplication.job_listing?.title}
          </p>

          <div className="space-y-2 mb-6">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleUpdateStatus(selectedApplication.id, option.value)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${selectedApplication.status === option.value
                  ? `bg-${option.color}-100 border-2 border-${option.color}-500`
                  : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {getStatusIcon(option.value)}
                    <span className="font-medium">{option.label}</span>
                  </span>
                  {selectedApplication.status === option.value && (
                    <FiCheckCircle className="text-green-600" size={18} />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedApplication(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete confirmation modal
  const renderDeleteModal = () => {
    if (!showDeleteModal || !selectedApplication) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Withdraw Application
          </h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to withdraw your application for "{selectedApplication.job_listing?.title || 'this job'}"? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedApplication(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedApplication.id)}
              disabled={deleteProcessing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleteProcessing ? 'Withdrawing...' : 'Withdraw Application'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      {activeStatusFilter !== 'all' ? (
        <>
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {getStatusIcon(activeStatusFilter)}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeStatusFilter} applications
          </h3>
          <p className="text-gray-500">
            {userRole === 'employer'
              ? `You don't have any ${activeStatusFilter} applications at the moment.`
              : `You don't have any ${activeStatusFilter} applications.`}
          </p>
          <button
            onClick={() => handleStatusFilter('all')}
            className="mt-4 text-indigo-600 hover:text-indigo-700"
          >
            View all applications
          </button>
        </>
      ) : (
        <>
          <FiUser className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {userRole === 'employer'
              ? "You haven't received any applications yet. Applications will appear here when candidates apply."
              : "You haven't submitted any applications yet. Browse jobs and start applying!"}
          </p>
          {userRole === 'job_seeker' && (
            <Link
              href={route('backend.listing.index')}
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Browse Jobs
            </Link>
          )}
        </>
      )}
    </div>
  );

  return (
    <AuthenticatedLayout>
      <Head title="Applications" />

      <div className="py-6 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">
                {userRole === 'employer'
                  ? 'Manage and review all job applications'
                  : 'Track and manage your job applications'}
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href={route('backend.listing.index')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <FiBriefcase size={18} />
                View Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Status Filter Buttons */}
        {renderStatusFilters()}

        {/* Score Filter (for employers) */}
        {userRole === 'employer' && renderScoreFilter()}

        {/* Active Filters Info */}
        {(filters.min_score || (activeStatusFilter !== 'all')) && (
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {activeStatusFilter !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                Status: {activeStatusFilter}
                <button
                  onClick={() => handleStatusFilter('all')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {filters.min_score && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded">
                Min Score: {filters.min_score}%+
                <button
                  onClick={() => handleMinScoreFilter('')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Bulk Actions (Employers/Admins) */}
        {(userRole === 'employer' || userRole === 'admin') && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-black">
            <button
              onClick={toggleSelectAll}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
            >
              {selectedIds.length === (applications.data?.length || 0) ? 'Clear Selection' : 'Select All'}
            </button>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <button
              onClick={applyBulkStatus}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm disabled:opacity-50"
            >
              Update Status ({selectedIds.length})
            </button>
            <button
              onClick={mergeSelectedResumes}
              disabled={selectedIds.length === 0}
              className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50"
            >
              Merge Resumes ({selectedIds.length})
            </button>
          </div>
        )}

        {/* Applications Table */}
        {applications.data && applications.data.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {(userRole === 'employer' || userRole === 'admin') && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={applications.data && selectedIds.length === applications.data.length}
                          onChange={toggleSelectAll}
                        />
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    {userRole === 'employer' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ATS Score
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.data.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition">
                      {(userRole === 'employer' || userRole === 'admin') && (
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(application.id)}
                            onChange={() => toggleSelectOne(application.id)}
                          />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FiUser className="text-indigo-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                              <FiMail size={12} />
                              <span className="text-xs">{application.email}</span>
                            </div>
                            {application.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <FiPhone size={12} />
                                <span className="text-xs">{application.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {application.job_listing?.title || 'N/A'}
                        </div>
                        {application.job_listing?.location && (
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <FiMapPin size={12} />
                            <span className="text-xs">{application.job_listing.location}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.created_at)}
                      </td>
                      {userRole === 'employer' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getScoreBadge(application.ats_score?.total)}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details */}
                          <Link
                            href={route('backend.application.show', application.id)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </Link>

                          {/* Download Resume */}
                          {application.resume_path && (
                            <button
                              onClick={() => downloadResume(application.id)}
                              className="text-gray-600 hover:text-gray-900 p-1"
                              title="Download Resume"
                            >
                              <FiDownload size={18} />
                            </button>
                          )}

                          {/* Update Status (Employers only) */}
                          {userRole === 'employer' && (
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowStatusModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Update Status"
                            >
                              <FiRefreshCw size={18} />
                            </button>
                          )}

                          {/* Withdraw/Delete (Job Seekers only) */}
                          {userRole === 'job_seeker' && (
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Withdraw Application"
                            >
                              <FiX size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {applications.links && applications.links.length > 3 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-gray-500">
                    Showing {applications.from || 0} to {applications.to || 0} of {applications.total || 0} results
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {applications.links.map((link, index) => {
                      if (link.url === null) {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 border border-gray-300 rounded text-gray-400 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      }
                      return (
                        <Link
                          key={index}
                          href={link.url}
                          className={`px-3 py-1 border rounded transition ${link.active
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          renderEmptyState()
        )}

        {/* Modals */}
        {renderStatusModal()}
        {renderDeleteModal()}
      </div>
    </AuthenticatedLayout>
  );
};

export default ApplicationsIndex;
