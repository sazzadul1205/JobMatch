import { useState, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';
import EmailModal from '../../../components/EmailModal';
import useEmailModal from '../../../hooks/useEmailModal';

// Icons
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFilePdf,
  FaFilter,
  FaHourglassHalf,
  FaPhone,
  FaSpinner,
  FaTimes,
  FaUserCheck,
  FaUserSlash,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaCheckDouble,
  FaFileExcel,
  FaFileCsv,
} from 'react-icons/fa';

import Swal from 'sweetalert2';

export default function JobApplications({ job, applications: initialApplications, filters }) {
  const { flash } = usePage().props;

  // Use the email modal hook
  const {
    isEmailModalOpen,
    emailRecipients,
    emailModalTitle,
    openEmailModal,
    closeEmailModal,
  } = useEmailModal();

  // States
  const [applications, setApplications] = useState(initialApplications);
  const [selectedApps, setSelectedApps] = useState([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    search: filters.search || '',
  });

  // Statuses
  const statuses = ['pending', 'shortlisted', 'rejected', 'hired'];

  // Get applications array from paginated response
  const applicationItems = applications?.data || [];

  // Get selected application objects
  const getSelectedApplicants = () => {
    return applicationItems.filter(app => selectedApps.includes(app.id));
  };

  // Get single applicant object
  const getApplicantById = (id) => {
    return applicationItems.find(app => app.id === id);
  };

  // Calculate stats from current applications
  const stats = {
    total: applications?.total || 0,
    pending: applicationItems.filter(app => app.status === 'pending').length,
    shortlisted: applicationItems.filter(app => app.status === 'shortlisted').length,
    rejected: applicationItems.filter(app => app.status === 'rejected').length,
    hired: applicationItems.filter(app => app.status === 'hired').length,
  };

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
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    router.get(route('backend.applications.job', job.id), {
      ...localFilters,
      page: 1,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setShowFilters(false);
        setSelectedApps([]);
        setPendingUpdates({});
      },
    });
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({ status: '', search: '' });
    router.get(route('backend.applications.job', job.id), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setShowFilters(false);
        setSelectedApps([]);
        setPendingUpdates({});
      },
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page === pagination?.currentPage) return;
    if (page < 1 || page > pagination?.lastPage) return;

    router.get(route('backend.applications.job', job.id), {
      ...localFilters,
      page: page,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setSelectedApps([]);
        setPendingUpdates({});
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

  // Open email modal for bulk
  const handleOpenBulkEmail = () => {
    if (selectedApps.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Applications Selected',
        text: 'Please select at least one application to send emails.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    const selectedApplicants = getSelectedApplicants();
    openEmailModal(selectedApplicants, `Send Email to ${selectedApps.length} Applicant(s)`);
  };

  // Open email modal for single applicant
  const handleOpenSingleEmail = (applicant) => {
    openEmailModal(applicant, `Send Email to ${applicant.name}`);
  };

  // Handle bulk export
  const handleExport = (format) => {
    if (applicationItems.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data to Export',
        text: 'There are no applications to export.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsExporting(true);
    setShowExportMenu(false);

    // Create form data for export
    const formData = new FormData();
    formData.append('format', format);

    if (localFilters.status) {
      formData.append('status', localFilters.status);
    }
    if (localFilters.search) {
      formData.append('search', localFilters.search);
    }

    // Use fetch to handle file download
    fetch(route('backend.applications.export', job.id), {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Export failed');

        // Get filename from Content-Disposition header or create one
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `applications_${job.title}_${Date.now()}.${format}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            filename = match[1].replace(/['"]/g, '');
          }
        }

        return response.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        Swal.fire({
          icon: 'success',
          title: 'Export Started!',
          text: `Your file will download shortly.`,
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => {
        console.error('Export error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: 'Failed to export applications. Please try again.',
          confirmButtonColor: '#d33',
        });
      })
      .finally(() => setIsExporting(false));
  };

  // Handle single application export
  const handleExportSingle = (app, format) => {
    setIsExporting(true);

    fetch(route('backend.applications.export-single', app.id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: JSON.stringify({ format }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Export failed');

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `application_${app.name}_${Date.now()}.${format}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (match && match[1]) {
            filename = match[1].replace(/['"]/g, '');
          }
        }

        return response.blob().then(blob => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        Swal.fire({
          icon: 'success',
          title: 'Exported!',
          text: 'Application data downloaded successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: 'Failed to export application data.',
          confirmButtonColor: '#d33',
        });
      })
      .finally(() => setIsExporting(false));
  };

  // Handle bulk status update with optimistic update
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

    // Store original applications state for rollback
    const originalApplications = JSON.parse(JSON.stringify(applications));

    // Track which applications are being updated
    const updateKeys = {};
    selectedApps.forEach(appId => {
      updateKeys[appId] = newStatus;
    });
    setPendingUpdates(prev => ({ ...prev, ...updateKeys }));

    // Optimistically update UI
    const updatedApplications = {
      ...applications,
      data: applications.data.map(app =>
        selectedApps.includes(app.id) ? { ...app, status: newStatus } : app
      )
    };
    setApplications(updatedApplications);

    setIsUpdatingStatus(true);

    // Show optimistic success message
    Swal.fire({
      icon: 'success',
      title: 'Updating...',
      text: `${selectedApps.length} application(s) are being updated to ${newStatus}.`,
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
        setPendingUpdates(prev => {
          const newPending = { ...prev };
          selectedApps.forEach(id => delete newPending[id]);
          return newPending;
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated Successfully!',
          text: `${selectedApps.length} application(s) updated to ${newStatus}.`,
          timer: 2000,
          showConfirmButton: false,
        });
        // Refresh to get fresh data from server
        router.reload({ preserveScroll: true });
      },
      onError: (error) => {
        // Revert on error
        setApplications(originalApplications);
        setPendingUpdates(prev => {
          const newPending = { ...prev };
          selectedApps.forEach(id => delete newPending[id]);
          return newPending;
        });
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error?.message || 'Failed to update applications. Please try again.',
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
      onSuccess: (response) => {
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

  // Handle single status update with optimistic update
  const handleStatusUpdate = (appId, newStatus) => {
    // Find the original application
    const originalApp = applicationItems.find(app => app.id === appId);
    if (!originalApp) return;

    // Store original applications state for rollback
    const originalApplications = JSON.parse(JSON.stringify(applications));

    // Mark this update as pending
    setPendingUpdates(prev => ({ ...prev, [appId]: newStatus }));

    // Optimistically update UI
    const updatedApplications = {
      ...applications,
      data: applications.data.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    };
    setApplications(updatedApplications);

    // Show optimistic success message
    Swal.fire({
      icon: 'success',
      title: 'Updating...',
      text: `Status changing to ${newStatus}`,
      timer: 1000,
      showConfirmButton: false,
    });

    router.put(route('backend.applications.update-status', appId), {
      status: newStatus,
      notes: `Status updated to ${newStatus}`,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setPendingUpdates(prev => {
          const newPending = { ...prev };
          delete newPending[appId];
          return newPending;
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Application status updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
        // Refresh to get fresh data from server
        router.reload({ preserveScroll: true });
      },
      onError: (error) => {
        // Revert on error
        setApplications(originalApplications);
        setPendingUpdates(prev => {
          const newPending = { ...prev };
          delete newPending[appId];
          return newPending;
        });
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: error?.message || 'Failed to update status. Please try again.',
          confirmButtonColor: '#d33',
        });
      },
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

  const getStatusBadge = (status, isPending = false) => {
    if (isPending) {
      return 'bg-gray-300 text-gray-600 animate-pulse';
    }
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status, isPending = false) => {
    if (isPending) {
      return <FaSpinner className="text-gray-500 animate-spin" size={14} />;
    }
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" size={14} />,
      shortlisted: <FaUserCheck className="text-blue-500" size={14} />,
      rejected: <FaUserSlash className="text-red-500" size={14} />,
      hired: <FaCheck className="text-green-500" size={14} />
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
    return localFilters.status !== '' || localFilters.search !== '';
  };

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: <FaUsers size={20} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <FaHourglassHalf size={20} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: <FaUserCheck size={20} />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: <FaUserSlash size={20} />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Hired',
      value: stats.hired,
      icon: <FaCheck size={20} />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  // Show flash messages
  useEffect(() => {
    if (flash?.success && !pendingUpdates) {
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
      <Head title={`Applications for ${job.title}`} />

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <Link
                href={route('backend.listing.index')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
              >
                <FaArrowLeft size={14} />
                <span className="text-sm">Back to Job List</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FaBuilding size={12} />
                  {job.employer?.name || 'Company'}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  Posted: {formatDate(job.created_at)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Export Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting || applicationItems.length === 0}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {isExporting ? (
                    <FaSpinner className="animate-spin" size={14} />
                  ) : (
                    <FaFileExcel size={14} />
                  )}
                  Export Data
                  <FaChevronDown size={12} />
                </button>

                {showExportMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowExportMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => handleExport('xlsx')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FaFileExcel className="text-green-600" size={16} />
                        Export as Excel (.xlsx)
                      </button>
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                      >
                        <FaFileCsv className="text-blue-600" size={16} />
                        Export as CSV (.csv)
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${showFilters || hasActiveFilters()
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                <FaFilter size={14} />
                Filters
                {hasActiveFilters() && (
                  <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {Object.values(localFilters).filter(v => v !== '').length}
                  </span>
                )}
                {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statsCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`}
                onClick={() => {
                  if (card.title !== 'Total Applications') {
                    const statusValue = card.title.toLowerCase();
                    setLocalFilters(prev => ({ ...prev, status: statusValue }));
                    router.get(route('backend.applications.job', job.id), {
                      status: statusValue,
                    }, {
                      preserveState: true,
                      onSuccess: (page) => {
                        setApplications(page.props.applications);
                        setPendingUpdates({});
                      },
                    });
                  }
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${card.textColor}`}>
                    {card.icon}
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value}
                  </span>
                </div>
                <p className={`text-xs font-medium mt-2 ${card.textColor} opacity-75`}>
                  {card.title}
                </p>
              </div>
            ))}
          </div>

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={localFilters.status}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    name="search"
                    value={localFilters.search}
                    onChange={handleFilterChange}
                    placeholder="Name, email, or phone..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
            <div className="bg-blue-50 rounded-xl shadow-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FaCheckDouble className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">
                    {selectedApps.length} application(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenBulkEmail}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-700 transition-all duration-200"
                  >
                    <FaEnvelope size={14} />
                    Send Email
                  </button>
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
                <thead className="bg-gray-50">
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
                      <td colSpan="8" className="text-center py-16">
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
                  {applicationItems.map((app) => {
                    const isPending = pendingUpdates[app.id] !== undefined;
                    const displayStatus = isPending ? pendingUpdates[app.id] : app.status;

                    return (
                      <tr key={app.id} className={`hover:bg-gray-50 transition-all duration-200 ${selectedApps.includes(app.id) ? 'bg-blue-50' : ''} ${isPending ? 'opacity-70' : ''}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={() => handleSelectApp(app.id)}
                            disabled={isPending}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
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
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <FaEnvelope size={12} className="text-gray-400" />
                              <a href={`mailto:${app.email}`} className="hover:text-blue-600 truncate max-w-45">
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
                            {getStatusIcon(displayStatus, isPending)}
                            <select
                              value={displayStatus}
                              onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                              disabled={isPending}
                              className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 ${getStatusBadge(displayStatus, isPending)} ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              {statuses.map(status => (
                                <option key={status} value={status} className="text-gray-900">
                                  {getStatusText(status)}
                                </option>
                              ))}
                            </select>
                            {isPending && (
                              <span className="text-xs text-gray-400 animate-pulse ml-1">
                                (Updating...)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenSingleEmail(app)}
                              disabled={isPending}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Send Email"
                            >
                              <FaEnvelope size={18} />
                            </button>
                            <Link
                              href={route('backend.applications.show', app.id)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </Link>
                            <button
                              onClick={() => handleDownloadResume(app.id)}
                              disabled={isPending}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Download Resume"
                            >
                              <FaFilePdf size={18} />
                            </button>
                            {/* Single Export Dropdown */}
                            <div className="relative group">
                              <button
                                disabled={isPending}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                                title="Export Data"
                              >
                                <FaFileExcel size={18} />
                              </button>
                              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg hidden group-hover:block z-10 border border-gray-200">
                                <button
                                  onClick={() => handleExportSingle(app, 'xlsx')}
                                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FaFileExcel className="text-green-600" size={12} />
                                  Excel (.xlsx)
                                </button>
                                <button
                                  onClick={() => handleExportSingle(app, 'csv')}
                                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                                >
                                  <FaFileCsv className="text-blue-600" size={12} />
                                  CSV (.csv)
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <Pagination />
          </div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        recipients={emailRecipients}
        title={emailModalTitle}
        jobTitle={job.title}
        onSuccess={() => {
          console.log('Email sent successfully');
        }}
      />
    </AuthenticatedLayout>
  );
}