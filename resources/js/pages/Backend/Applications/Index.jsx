import { useState, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFilePdf,
  FaFilter,
  FaHourglassHalf,
  FaPhone,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserCheck,
  FaUserSlash,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaCheckDouble,
  FaStar,
  FaRegBuilding,
} from 'react-icons/fa';

// SweetAlert2
import Swal from 'sweetalert2';

export default function Index({ applications: initialApplications, jobs, filters: initialFilters }) {
  const { flash } = usePage().props;

  // States
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApps, setSelectedApps] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: initialFilters.status || '',
    job_id: initialFilters.job_id || '',
    search: initialFilters.search || '',
  });

  // Statuses
  const statuses = ['pending', 'shortlisted', 'rejected', 'hired'];

  // Get applications array from paginated response
  const applicationItems = applications?.data || [];

  // Pagination info
  const pagination = applications?.data ? {
    currentPage: applications.current_page,
    lastPage: applications.last_page,
    perPage: applications.per_page,
    total: applications.total,
    from: applications.from,
    to: applications.to,
  } : null;

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    router.get(route('backend.applications.index'), {
      ...filters,
      page: 1,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setShowFilters(false);
        setSelectedApps([]);
      },
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ status: '', job_id: '', search: '' });
    router.get(route('backend.applications.index'), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setShowFilters(false);
        setSelectedApps([]);
      },
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page === pagination?.currentPage) return;
    if (page < 1 || page > pagination?.lastPage) return;

    router.get(route('backend.applications.index'), {
      ...filters,
      page: page,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setSelectedApps([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  // Handle select all applications
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApps(applicationItems.map(app => app.id));
    } else {
      setSelectedApps([]);
    }
  };

  // Handle select single application
  const handleSelectApp = (appId) => {
    if (selectedApps.includes(appId)) {
      setSelectedApps(selectedApps.filter(id => id !== appId));
    } else {
      setSelectedApps([...selectedApps, appId]);
    }
  };

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedApps.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Applications Selected',
        text: 'Please select at least one application.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const originalApplications = JSON.parse(JSON.stringify(applications));

    // Optimistically update UI
    const updatedApplications = {
      ...applications,
      data: applications.data.map(app =>
        selectedApps.includes(app.id) ? { ...app, status: newStatus } : app
      )
    };
    setApplications(updatedApplications);

    setIsUpdatingStatus(true);

    Swal.fire({
      icon: 'success',
      title: 'Updating...',
      text: `${selectedApps.length} application(s) are being updated.`,
      timer: 1500,
      showConfirmButton: false,
    });

    router.post(route('backend.applications.bulk-status'), {
      application_ids: selectedApps,
      status: newStatus,
      notes: `Bulk updated to ${newStatus}`,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedApps([]);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `${selectedApps.length} application(s) updated successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
        router.reload({ preserveScroll: true });
      },
      onError: (error) => {
        setApplications(originalApplications);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error?.message || 'Failed to update applications.',
          confirmButtonColor: '#d33',
        });
      },
      onFinish: () => setIsUpdatingStatus(false),
    });
  };

  // Handle bulk download resumes
  const handleBulkDownload = () => {
    if (selectedApps.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Applications Selected',
        text: 'Please select at least one application to download resumes.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsDownloading(true);

    router.post(route('backend.applications.bulk-download'), {
      application_ids: selectedApps,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Download Started',
          text: 'Your download will begin shortly.',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      onError: (errors) => {
        Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text: errors?.message || 'Failed to download resumes.',
          confirmButtonColor: '#d33',
        });
      },
      onFinish: () => setIsDownloading(false),
    });
  };

  // Handle single resume download
  const handleDownloadResume = (appId) => {
    window.location.href = route('backend.applications.download', appId);
  };

  // Helper functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" size={14} />,
      shortlisted: <FaUserCheck className="text-blue-500" size={14} />,
      rejected: <FaUserSlash className="text-red-500" size={14} />,
      hired: <FaCheckCircle className="text-green-500" size={14} />
    };
    return icons[status] || <FaBriefcase className="text-gray-500" size={14} />;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return texts[status] || status;
  };

  const getAtsScoreColor = (score) => {
    if (score === undefined || score === null) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAtsScoreBg = (score) => {
    if (score === undefined || score === null) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatSalary = (salary) => {
    if (!salary) return null;
    return new Intl.NumberFormat('en-US').format(salary) + ' BDT';
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return filters.status !== '' || filters.job_id !== '' || filters.search !== '';
  };

  // Show flash messages
  useEffect(() => {
    if (flash?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: flash.success,
        timer: 2000,
        showConfirmButton: false,
      });
    }
    if (flash?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: flash.error,
        confirmButtonColor: '#d33',
      });
    }
  }, [flash]);

  // Pagination component
  const Pagination = () => {
    if (!pagination || pagination.lastPage <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pagination.lastPage, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
          <span className="font-medium">{pagination.to || 0}</span> of{' '}
          <span className="font-medium">{pagination.total}</span> applications
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition ${pagination.currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            <FaChevronLeft size={12} />
            Previous
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${page === pagination.currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              {page}
            </button>
          ))}

          {endPage < pagination.lastPage && (
            <>
              {endPage < pagination.lastPage - 1 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => handlePageChange(pagination.lastPage)}
                className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
              >
                {pagination.lastPage}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.lastPage}
            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition ${pagination.currentPage === pagination.lastPage
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
          >
            Next
            <FaChevronRight size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="All Applications" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                All Applications
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and review all job applications across all listings
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 ${showFilters || hasActiveFilters()
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
            >
              <FaFilter size={14} />
              Filters
              {hasActiveFilters() && (
                <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(filters).filter(v => v !== '').length}
                </span>
              )}
              {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
              <p className="text-xs text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {applicationItems.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
              <p className="text-xs text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-blue-600">
                {applicationItems.filter(a => a.status === 'shortlisted').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {applicationItems.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
              <p className="text-xs text-gray-500">Hired</p>
              <p className="text-2xl font-bold text-green-600">
                {applicationItems.filter(a => a.status === 'hired').length}
              </p>
            </div>
          </div>

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Applications</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTimes size={12} />
                  Reset all
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
                  <select
                    name="job_id"
                    value={filters.job_id}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Jobs</option>
                    {jobs?.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Name or email..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* BULK ACTIONS BAR */}
          {selectedApps.length > 0 && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 mb-6 border border-blue-200 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FaCheckDouble className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">
                    {selectedApps.length} application(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                    disabled={isUpdatingStatus}
                    className="px-4 py-2 text-sm border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Bulk Update Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        Mark as {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkDownload}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isDownloading ? <FaSpinner className="animate-spin" size={14} /> : <FaDownload size={14} />}
                    Download Resumes
                  </button>
                  <button
                    onClick={() => setSelectedApps([])}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-all duration-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATIONS TABLE */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={applicationItems.length > 0 && selectedApps.length === applicationItems.length}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ATS Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Expected Salary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applicationItems.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaBriefcase className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {hasActiveFilters() ? 'Try adjusting your filters.' : 'No applications have been submitted yet.'}
                        </p>
                        {hasActiveFilters() && (
                          <div className="mt-6">
                            <button
                              onClick={resetFilters}
                              className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <FaTimes className="mr-2" size={16} />
                              Clear Filters
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                  {applicationItems.map((app, index) => (
                    <tr key={app.id} className={`hover:bg-gray-50 transition-all duration-200 ${selectedApps.includes(app.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedApps.includes(app.id)}
                          onChange={() => handleSelectApp(app.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                            {app.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{app.name}</p>
                            <p className="text-xs text-gray-500">
                              {app.years_of_experience ? `${app.years_of_experience} yrs exp` : 'Experience N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{app.job_listing?.title}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaRegBuilding size={10} />
                            {app.job_listing?.employer?.name || 'Company'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FaEnvelope size={12} className="text-gray-400" />
                            <a href={`mailto:${app.email}`} className="hover:text-blue-600 truncate max-w-36">
                              {app.email}
                            </a>
                          </p>
                          {app.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <FaPhone size={12} className="text-gray-400" />
                              {app.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {app.ats_score?.percentage !== undefined && app.ats_score?.percentage !== null ? (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAtsScoreBg(app.ats_score.percentage)} ${getAtsScoreColor(app.ats_score.percentage)}`}>
                            <FaChartLine size={10} />
                            {app.ats_score.percentage}%
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Not calculated</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {app.expected_salary ? (
                          <span className="text-sm font-medium text-green-600">
                            {formatSalary(app.expected_salary)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Not specified</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{formatDate(app.created_at)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className={`text-xs font-medium rounded-full px-2 py-1 ${getStatusBadge(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={route('backend.applications.show', app.id)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </Link>
                          <button
                            onClick={() => handleDownloadResume(app.id)}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                            title="Download Resume"
                          >
                            <FaFilePdf size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <Pagination />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}