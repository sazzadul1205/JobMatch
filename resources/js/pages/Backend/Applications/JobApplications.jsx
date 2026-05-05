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
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaTrash,
  FaFileArchive,
} from 'react-icons/fa';

import Swal from 'sweetalert2';

export default function JobApplications({ job, applications: initialApplications, filters, statusCounts }) {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [pendingDeletes, setPendingDeletes] = useState({});
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    search: filters.search || '',
    min_score: filters.min_score || '',
    sort: filters.sort || 'created_at',
    direction: filters.direction || 'desc',
  });

  // Statuses
  const statuses = ['pending', 'shortlisted', 'rejected', 'hired'];

  // Get applications array from paginated response
  const applicationItems = applications?.data || [];

  // Get selected application objects
  const getSelectedApplicants = () => {
    return applicationItems.filter(app => selectedApps.includes(app.id));
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
    const filterParams = {};
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key] !== '' && localFilters[key] !== null && localFilters[key] !== undefined) {
        filterParams[key] = localFilters[key];
      }
    });

    router.get(route('backend.applications.job', job.id), {
      ...filterParams,
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
        setPendingDeletes({});
      },
    });
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({
      status: '',
      search: '',
      min_score: '',
      sort: 'created_at',
      direction: 'desc',
    });
    router.get(route('backend.applications.job', job.id), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setShowFilters(false);
        setSelectedApps([]);
        setPendingUpdates({});
        setPendingDeletes({});
      },
    });
  };

  // Handle sort change
  const handleSortChange = (field) => {
    const newDirection = localFilters.sort === field && localFilters.direction === 'asc' ? 'desc' : 'asc';
    setLocalFilters(prev => ({ ...prev, sort: field, direction: newDirection }));

    const filterParams = {};
    Object.keys(localFilters).forEach(key => {
      if (key !== 'sort' && key !== 'direction' && localFilters[key] !== '' && localFilters[key] !== null && localFilters[key] !== undefined) {
        filterParams[key] = localFilters[key];
      }
    });
    filterParams.sort = field;
    filterParams.direction = newDirection;

    router.get(route('backend.applications.job', job.id), {
      ...filterParams,
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
        setPendingDeletes({});
      },
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page === pagination?.currentPage) return;
    if (page < 1 || page > pagination?.lastPage) return;

    const filterParams = {};
    Object.keys(localFilters).forEach(key => {
      if (localFilters[key] !== '' && localFilters[key] !== null && localFilters[key] !== undefined) {
        filterParams[key] = localFilters[key];
      }
    });

    router.get(route('backend.applications.job', job.id), {
      ...filterParams,
      page: page,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setSelectedApps([]);
        setPendingUpdates({});
        setPendingDeletes({});
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
      Swal.fire('No Selection', 'Please select at least one application to send emails.', 'warning');
      return;
    }

    const selectedApplicants = getSelectedApplicants();
    openEmailModal(selectedApplicants, `Send Email to ${selectedApps.length} Applicant(s)`);
  };

  // Open email modal for single applicant
  const handleOpenSingleEmail = (applicant) => {
    openEmailModal(applicant, `Send Email to ${applicant.name}`);
  };

  // Helper function to extract filename from Content-Disposition header
  const extractFilenameFromDisposition = (contentDisposition) => {
    if (!contentDisposition) return null;

    // RFC 6266 / RFC 5987 (filename*)
    const filenameStarMatch = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
    if (filenameStarMatch?.[1]) {
      try {
        return decodeURIComponent(filenameStarMatch[1].replace(/(^\"|\"$)/g, ''));
      } catch {
        return filenameStarMatch[1].replace(/(^\"|\"$)/g, '');
      }
    }

    // Basic filename=
    const filenameMatch = contentDisposition.match(/filename\s*=\s*\"?([^\";]+)\"?/i);
    return filenameMatch?.[1] ?? null;
  };

  // Helper function to sanitize filename
  const safeFilename = (name) => {
    if (!name) return 'Resume';
    return name
      .toString()
      .replace(/[^a-zA-Z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_') || 'Resume';
  };

  // Handle bulk export
  const handleExport = (format) => {
    if (applicationItems.length === 0) {
      Swal.fire('No Data to Export', 'There are no applications to export.', 'warning');
      return;
    }

    setIsExporting(true);
    setShowExportMenu(false);

    const formData = new FormData();
    formData.append('format', format);

    Object.keys(localFilters).forEach(key => {
      if (localFilters[key] !== '' && localFilters[key] !== null && localFilters[key] !== undefined) {
        formData.append(key, localFilters[key]);
      }
    });

    fetch(route('backend.applications.export', job.id), {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Export failed');
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `applications_${job.title}_${Date.now()}.${format}`;
        if (contentDisposition) {
          const extracted = extractFilenameFromDisposition(contentDisposition);
          if (extracted) filename = extracted;
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
          title: 'Export Started!',
          text: 'Your file will download shortly.',
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
          const extracted = extractFilenameFromDisposition(contentDisposition);
          if (extracted) filename = extracted;
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

  // Handle bulk delete with optimistic update
  const handleBulkDelete = () => {
    if (selectedApps.length === 0) {
      Swal.fire('No Selection', 'Please select at least one application to delete.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Delete Applications',
      text: `Are you sure you want to delete ${selectedApps.length} application(s)? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Store original state for rollback
        const originalApplications = JSON.parse(JSON.stringify(applications));

        // Mark as deleting
        const deleteKeys = {};
        selectedApps.forEach(appId => {
          deleteKeys[appId] = true;
        });
        setPendingDeletes(prev => ({ ...prev, ...deleteKeys }));

        // Optimistically remove from UI
        const updatedApplications = {
          ...applications,
          data: applications.data.filter(app => !selectedApps.includes(app.id))
        };
        setApplications(updatedApplications);

        setIsDeleting(true);

        router.post(route('backend.applications.bulk-delete'), {
          application_ids: selectedApps,
        }, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${selectedApps.length} application(s) have been deleted.`,
              timer: 1500,
              showConfirmButton: false
            });
            setSelectedApps([]);
            setIsDeleting(false);

            // Clear pending deletes
            setPendingDeletes(prev => {
              const newPending = { ...prev };
              selectedApps.forEach(id => delete newPending[id]);
              return newPending;
            });
          },
          onError: (error) => {
            // Revert on error
            setApplications(originalApplications);
            setPendingDeletes(prev => {
              const newPending = { ...prev };
              selectedApps.forEach(id => delete newPending[id]);
              return newPending;
            });
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete applications.',
            });
            setIsDeleting(false);
          }
        });
      }
    });
  };

  // Handle single delete with optimistic update
  const handleDeleteSingle = (appId, applicantName) => {
    Swal.fire({
      title: 'Delete Application?',
      text: `Are you sure you want to delete ${applicantName}'s application? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Store original state for rollback
        const originalApplications = JSON.parse(JSON.stringify(applications));

        // Mark as deleting
        setPendingDeletes(prev => ({ ...prev, [appId]: true }));

        // Optimistically remove from UI
        const updatedApplications = {
          ...applications,
          data: applications.data.filter(app => app.id !== appId)
        };
        setApplications(updatedApplications);

        router.delete(route('backend.applications.destroy', appId), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Application deleted successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            setPendingDeletes(prev => {
              const newPending = { ...prev };
              delete newPending[appId];
              return newPending;
            });
            // Remove from selected if present
            if (selectedApps.includes(appId)) {
              setSelectedApps(prev => prev.filter(id => id !== appId));
            }
          },
          onError: (error) => {
            // Revert on error
            setApplications(originalApplications);
            setPendingDeletes(prev => {
              const newPending = { ...prev };
              delete newPending[appId];
              return newPending;
            });
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: error?.message || 'Failed to delete application.',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    });
  };

  // Handle bulk status update with optimistic update
  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedApps.length === 0) {
      Swal.fire('No Selection', 'Please select at least one application.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Update Status',
      text: `Are you sure you want to change ${selectedApps.length} application(s) status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Store original state for rollback
        const originalApplications = JSON.parse(JSON.stringify(applications));

        // Track pending updates
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

        router.post(route('backend.applications.bulk-status'), {
          application_ids: selectedApps,
          status: newStatus,
          notes: `Bulk updated to ${newStatus}`,
        }, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `${selectedApps.length} application(s) status updated to ${newStatus}.`,
              timer: 1500,
              showConfirmButton: false
            });
            setSelectedApps([]);
            setIsUpdatingStatus(false);

            // Clear pending updates
            setPendingUpdates(prev => {
              const newPending = { ...prev };
              selectedApps.forEach(id => delete newPending[id]);
              return newPending;
            });
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
              text: error?.message || 'Failed to update statuses.',
            });
            setIsUpdatingStatus(false);
          }
        });
      }
    });
  };

  // Handle bulk download resumes (MERGED PDF)
  const handleBulkDownload = async () => {
    if (selectedApps.length === 0) {
      Swal.fire('No Selection', 'Please select at least one application to download resumes.', 'warning');
      return;
    }

    setIsDownloading(true);

    // Show loading indicator
    Swal.fire({
      title: 'Preparing Resumes...',
      text: selectedApps.length === 1
        ? 'Downloading resume...'
        : `Merging ${selectedApps.length} resumes into one PDF...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(route('backend.applications.bulk-download'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
        body: JSON.stringify({
          application_ids: selectedApps,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `Download failed (${response.status})`);
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      const serverFilename = extractFilenameFromDisposition(contentDisposition);

      // Determine filename
      let filename;
      if (serverFilename) {
        filename = serverFilename;
      } else if (selectedApps.length === 1) {
        const app = applicationItems.find(a => a.id === selectedApps[0]);
        filename = `Resume_${safeFilename(app?.name || 'applicant')}.pdf`;
      } else {
        const jobTitle = safeFilename(job.title || 'job');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        filename = `Resumes_${jobTitle}_${timestamp}.pdf`;
      }

      // Download the file
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);

      // Close loading and show success
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Download Complete!',
        text: selectedApps.length === 1
          ? 'Resume downloaded successfully.'
          : `${selectedApps.length} resumes merged and downloaded.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Bulk download error:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: error?.message || 'Failed to download resumes. Please try again.',
        confirmButtonColor: '#d33',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle single resume download
  const handleDownloadResume = async (app) => {
    try {
      const url = route('backend.applications.download', app.id);
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }

      const contentDisposition = response.headers.get('content-disposition');
      const serverFilename = extractFilenameFromDisposition(contentDisposition);
      const serverExt = serverFilename?.split('.').pop();

      const ext = serverExt && serverExt.length <= 6 ? serverExt : 'pdf';
      const desiredFilename = `Resume_${safeFilename(app.name)}.${ext}`;

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = desiredFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: e?.message || 'Failed to download resume.',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Handle single status update with optimistic update
  const handleStatusUpdate = (appId, newStatus) => {
    // Store original state for rollback
    const originalApplications = JSON.parse(JSON.stringify(applications));

    // Mark this update as pending and update locally
    setPendingUpdates(prev => ({ ...prev, [appId]: newStatus }));

    // Optimistically update UI
    const updatedApplications = {
      ...applications,
      data: applications.data.map(app =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    };
    setApplications(updatedApplications);

    router.put(route('backend.applications.update-status', appId), {
      status: newStatus,
      notes: `Status updated to ${newStatus}`,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        // Clear pending update flag
        setPendingUpdates(prev => {
          const newPending = { ...prev };
          delete newPending[appId];
          return newPending;
        });

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Application status updated successfully.',
          timer: 1500,
          showConfirmButton: false,
        });
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
          text: error?.message || 'Failed to update status.',
          confirmButtonColor: '#d33',
        });
      },
    });
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
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
          <FaSpinner className="animate-spin" size={10} />
          Updating...
        </span>
      );
    }

    const statuses = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock, label: 'Pending' },
      shortlisted: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle, label: 'Shortlisted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle, label: 'Rejected' },
      hired: { bg: 'bg-purple-100', text: 'text-purple-800', icon: FaStar, label: 'Hired' }
    };
    const s = statuses[status] || statuses.pending;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        <Icon size={10} />
        {s.label}
      </span>
    );
  };

  const getAtsScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
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

  const formatSalary = (salary) => {
    if (!salary) return null;
    return new Intl.NumberFormat('en-US').format(salary) + ' BDT';
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return localFilters.status !== '' || localFilters.search !== '' || localFilters.min_score !== '';
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (localFilters.sort !== field) return null;
    return localFilters.direction === 'asc' ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />;
  };

  // Show flash messages
  useEffect(() => {
    if (flash?.success && Object.keys(pendingUpdates).length === 0 && Object.keys(pendingDeletes).length === 0) {
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

  // Filter out deleted applications from display
  const visibleApplications = applicationItems.filter(app => !pendingDeletes[app.id]);

  return (
    <AuthenticatedLayout>
      <Head title={`Applications for ${job.title}`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-6">
            <Link
              href={route('backend.listing.index')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Back to Job Listings
            </Link>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
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
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  <FaFilter size={14} />
                  Filters
                  {hasActiveFilters() && (
                    <span className="ml-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {Object.values(localFilters).filter(v => v !== '' && v !== 'created_at' && v !== 'desc').length}
                    </span>
                  )}
                  {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{visibleApplications.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {visibleApplications.filter(app => app.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-green-600">
                {visibleApplications.filter(app => app.status === 'shortlisted').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {visibleApplications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4">
              <p className="text-xs text-gray-500">Hired</p>
              <p className="text-2xl font-bold text-purple-600">
                {visibleApplications.filter(app => app.status === 'hired').length}
              </p>
            </div>
          </div>

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Applications</h3>
                <button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                  <FaTimes size={12} /> Reset all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={localFilters.status}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      name="search"
                      value={localFilters.search}
                      onChange={handleFilterChange}
                      placeholder="Name, email, or phone..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min ATS Score</label>
                  <select
                    name="min_score"
                    value={localFilters.min_score}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Score</option>
                    <option value="80">80%+ (Excellent)</option>
                    <option value="60">60%+ (Good)</option>
                    <option value="40">40%+ (Fair)</option>
                    <option value="0">Below 40%</option>
                  </select>
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
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FaCheckDouble className="text-blue-600" size={20} />
                  <span className="font-semibold text-gray-900">
                    {selectedApps.length} application(s) selected
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleOpenBulkEmail}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-700 transition-all duration-200"
                  >
                    <FaEnvelope size={14} />
                    Send Email
                  </button>
                  <select
                    onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                    disabled={isUpdatingStatus}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Update Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        Mark as {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkDownload}
                    disabled={isDownloading}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isDownloading ? (
                      <FaSpinner className="animate-spin" size={14} />
                    ) : selectedApps.length > 1 ? (
                      <FaFilePdf size={14} />
                    ) : (
                      <FaDownload size={14} />
                    )}
                    {isDownloading
                      ? 'Downloading...'
                      : selectedApps.length > 1
                        ? 'Download Merged PDF'
                        : 'Download Resume'
                    }
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isDeleting ? <FaSpinner className="animate-spin" size={14} /> : <FaTrash size={14} />}
                    Delete All
                  </button>
                  <button
                    onClick={() => setSelectedApps([])}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-all duration-200"
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
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={visibleApplications.length > 0 && selectedApps.length === visibleApplications.length}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('name')}>
                      <div className="flex items-center gap-1">
                        Applicant
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('ats_score')}>
                      <div className="flex items-center gap-1">
                        ATS Score
                        {getSortIcon('ats_score')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('expected_salary')}>
                      <div className="flex items-center gap-1">
                        Expected Salary
                        {getSortIcon('expected_salary')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('years_of_experience')}>
                      <div className="flex items-center gap-1">
                        Experience
                        {getSortIcon('years_of_experience')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('created_at')}>
                      <div className="flex items-center gap-1">
                        Applied On
                        {getSortIcon('created_at')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSortChange('status')}>
                      <div className="flex items-center gap-1">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleApplications.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <FaBriefcase className="text-4xl text-gray-300 mb-3" />
                          <p className="text-gray-500">No applications found</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {hasActiveFilters() ? 'Try adjusting your filters.' : 'No applications have been submitted yet.'}
                          </p>
                          {hasActiveFilters() && (
                            <div className="mt-4">
                              <button
                                onClick={resetFilters}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                              >
                                <FaTimes className="mr-2" size={14} />
                                Clear Filters
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {visibleApplications.map((app) => {
                    const atsScore = app.calculated_ats_score || app.ats_score?.percentage;
                    const isPending = pendingUpdates[app.id] !== undefined;
                    const isDeletingApp = pendingDeletes[app.id];
                    const displayStatus = isPending ? pendingUpdates[app.id] : app.status;

                    if (isDeletingApp) return null;

                    return (
                      <tr key={app.id} className={`hover:bg-gray-50 transition-colors ${selectedApps.includes(app.id) ? 'bg-blue-50' : ''} ${isPending ? 'opacity-70' : ''}`}>
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedApps.includes(app.id)}
                            onChange={() => handleSelectApp(app.id)}
                            disabled={isPending}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <FaUser className="text-gray-500" size={16} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {app.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: #{app.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" size={12} />
                            {app.email}
                          </div>
                          {app.phone && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <FaPhone className="text-gray-400" size={12} />
                              {app.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {atsScore ? (
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${getAtsScoreColor(atsScore)}`}>
                                {Math.round(atsScore)}%
                              </span>
                              <div className="w-20">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${atsScore >= 80 ? 'bg-green-500' :
                                      atsScore >= 60 ? 'bg-blue-500' :
                                        atsScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                    style={{ width: `${atsScore}%` }}
                                  />
                                </div>
                              </div>
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
                          {app.years_of_experience ? (
                            <span className="text-sm text-gray-700">
                              {app.years_of_experience} {app.years_of_experience === 1 ? 'year' : 'years'}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">Not specified</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatDate(app.created_at)}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(displayStatus, isPending)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <select
                              value={displayStatus}
                              onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                              disabled={isPending}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              {statuses.map(status => (
                                <option key={status} value={status}>
                                  {getStatusText(status)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleOpenSingleEmail(app)}
                              disabled={isPending}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Send Email"
                            >
                              <FaEnvelope size={16} />
                            </button>
                            <Link
                              href={route('backend.applications.show', app.id)}
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Details"
                            >
                              <FaEye size={16} />
                            </Link>
                            <button
                              onClick={() => handleDownloadResume(app)}
                              disabled={isPending}
                              className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Download Resume"
                            >
                              <FaFilePdf size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSingle(app.id, app.name)}
                              disabled={isPending}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination && pagination.lastPage > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
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

                  {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
                    let endPage = Math.min(pagination.lastPage, startPage + maxVisible - 1);

                    if (endPage - startPage + 1 < maxVisible) {
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    if (startPage > 1) {
                      pages.push(
                        <button
                          key={1}
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
                        >
                          1
                        </button>
                      );
                      if (startPage > 2) pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition ${i === pagination.currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                          {i}
                        </button>
                      );
                    }

                    if (endPage < pagination.lastPage) {
                      if (endPage < pagination.lastPage - 1) pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
                      pages.push(
                        <button
                          key={pagination.lastPage}
                          onClick={() => handlePageChange(pagination.lastPage)}
                          className="px-3 py-1.5 rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition"
                        >
                          {pagination.lastPage}
                        </button>
                      );
                    }

                    return pages;
                  })()}

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
            )}
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
          Swal.fire({
            icon: 'success',
            title: 'Email Sent!',
            text: 'The email has been sent successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        }}
      />
    </AuthenticatedLayout>
  );
}