// resources/js/Pages/Backend/Apply/Index.jsx

import { useState, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaEye,
  FaBriefcase,
  FaCalendarAlt,
  FaChartLine,
  FaBuilding,
  FaDollarSign,
  FaFilePdf,
  FaClock,
  FaCheck,
  FaHourglassHalf,
  FaUserCheck,
  FaUserSlash,
  FaTrashRestore,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';

// SweetAlert2
import Swal from 'sweetalert2';

export default function ApplyIndex({ applications: initialApplications, stats: initialStats }) {
  const { flash } = usePage().props;

  // States
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [recalculatingId, setRecalculatingId] = useState(null);
  const [showTrashed, setShowTrashed] = useState(false);

  // Pagination state
  const [applications, setApplications] = useState(initialApplications);
  const [stats, setStats] = useState(initialStats || {
    total: 0,
    total_deleted: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
    average_ats_score: 0,
  });

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

  // Toggle between active and trashed view
  const toggleShowTrashed = () => {
    const newValue = !showTrashed;
    setShowTrashed(newValue);

    router.get(route('backend.apply.index'), {
      show_trashed: newValue ? 'true' : 'false'
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setStats(page.props.stats);
      },
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page === pagination?.currentPage) return;
    if (page < 1 || page > pagination?.lastPage) return;

    router.get(route('backend.apply.index'), {
      page: page,
      show_trashed: showTrashed ? 'true' : 'false'
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onSuccess: (page) => {
        setApplications(page.props.applications);
        setStats(page.props.stats);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  // Single application actions
  const handleWithdraw = (id) => {
    Swal.fire({
      title: 'Withdraw Application?',
      text: 'This will move your application to trash. You can restore it later.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, withdraw',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setWithdrawingId(id);

        router.delete(route('backend.apply.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Withdrawn!',
              text: 'Application has been withdrawn.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Withdraw Failed',
              text: errors?.message || 'Failed to withdraw application.',
              confirmButtonColor: '#d33',
            });
          },
          onFinish: () => setWithdrawingId(null),
        });
      }
    });
  };

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Restore Application?',
      text: 'This will restore your application from trash.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setRestoringId(id);

        router.post(route('backend.apply.restore', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Application has been restored successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Restore Failed',
              text: errors?.message || 'Failed to restore application.',
              confirmButtonColor: '#d33',
            });
          },
          onFinish: () => setRestoringId(null),
        });
      }
    });
  };

  const handleForceDelete = (id, jobTitle) => {
    Swal.fire({
      title: 'Permanently Delete?',
      html: `Are you sure you want to permanently delete application for <strong>${jobTitle}</strong>?<br><br>This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete permanently',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('backend.apply.force-delete', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Application has been permanently deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: errors?.message || 'Failed to delete application.',
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    });
  };

  const handleRecalculateAts = (id) => {
    Swal.fire({
      title: 'Recalculate ATS Score?',
      text: 'This will re-analyze your CV against the job requirements.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, recalculate',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setRecalculatingId(id);

        router.post(route('backend.apply.recalculate-ats', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Recalculated!',
              text: 'ATS score has been updated.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Recalculation Failed',
              text: errors?.message || 'Failed to recalculate ATS score.',
              confirmButtonColor: '#d33',
            });
          },
          onFinish: () => setRecalculatingId(null),
        });
      }
    });
  };

  // Helper functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return texts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" size={20} />,
      shortlisted: <FaUserCheck className="text-blue-500" size={20} />,
      rejected: <FaUserSlash className="text-red-500" size={20} />,
      hired: <FaCheck className="text-green-500" size={20} />
    };
    return icons[status] || <FaBriefcase className="text-gray-500" size={20} />;
  };

  const getAtsScoreColor = (score) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAtsScoreBg = (score) => {
    if (!score) return 'bg-gray-100';
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatSalary = (salary) => {
    if (!salary) return null;
    return new Intl.NumberFormat('en-US').format(salary) + ' BDT';
  };

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Applications',
      value: stats.total,
      icon: <FaBriefcase size={24} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: <FaHourglassHalf size={24} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Shortlisted',
      value: stats.shortlisted,
      icon: <FaUserCheck size={24} />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: <FaUserSlash size={24} />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Hired',
      value: stats.hired,
      icon: <FaCheck size={24} />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      title: 'Withdrawn',
      value: stats.total_deleted,
      icon: <FaTrash size={24} />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
    },
    {
      title: 'Avg. ATS Score',
      value: stats.average_ats_score ? `${Math.round(stats.average_ats_score)}%` : 'N/A',
      icon: <FaChartLine size={24} />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

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
      <Head title={showTrashed ? "Withdrawn Applications" : "My Applications"} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {showTrashed ? 'Withdrawn Applications' : 'My Applications'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {showTrashed
                  ? 'View and manage your withdrawn applications'
                  : 'Track and manage all your active job applications'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={toggleShowTrashed}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${showTrashed
                  ? 'bg-gray-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
              >
                {showTrashed ? <FaBriefcase size={14} /> : <FaTrash size={14} />}
                {showTrashed ? 'Show Active' : 'Show Withdrawn'}
              </button>

              {!showTrashed && (
                <Link
                  href={route('public.jobs.index')}
                  className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <FaPlus size={16} />
                  Browse Jobs
                </Link>
              )}
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6 animate-fade-in">
            {statsCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-100`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  if (card.title === 'Withdrawn') {
                    setShowTrashed(true);
                    router.get(route('backend.apply.index'), { show_trashed: 'true' });
                  } else if (card.title !== 'Avg. ATS Score') {
                    setShowTrashed(false);
                    router.get(route('backend.apply.index'), { show_trashed: 'false' });
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${card.textColor}`}>
                    {card.icon}
                  </div>
                  <span className={`text-xs font-medium ${card.textColor} bg-white bg-opacity-50 px-2 py-1 rounded-full`}>
                    {card.title === 'Avg. ATS Score' ? 'Average' : 'Count'}
                  </span>
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

          {/* APPLICATIONS GRID/CARDS VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {applicationItems.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBriefcase className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {showTrashed ? 'No withdrawn applications' : 'No applications found'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {showTrashed
                    ? 'Withdrawn applications will appear here.'
                    : 'Start applying for jobs to see them here.'}
                </p>
                {!showTrashed && (
                  <Link
                    href={route('public.jobs.index')}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 mt-6"
                  >
                    <FaPlus className="mr-2" size={16} />
                    Browse Jobs
                  </Link>
                )}
              </div>
            )}

            {applicationItems.map((app, index) => {
              const trashed = app.deleted_at !== null;
              const canEdit = !trashed && app.status === 'pending';
              const canWithdraw = !trashed && app.status === 'pending';
              const canRestore = trashed;
              const canForceDelete = trashed;
              const canRecalculate = !trashed && app.ats_calculation_status !== 'processing';

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden border ${trashed ? 'opacity-75 border-gray-200 bg-gray-50' : 'border-gray-100'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="p-5">
                    {/* Header: Job Title */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link
                          href={route('backend.apply.show', app.id)}
                          className={`font-semibold text-lg hover:text-blue-600 transition line-clamp-2 ${trashed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                        >
                          {app.job_title}
                        </Link>
                        <div className={`text-sm mt-1 flex items-center gap-1 ${trashed ? 'text-gray-400' : 'text-gray-500'}`}>
                          <FaBuilding size={12} />
                          {app.employer_name}
                        </div>
                      </div>
                    </div>

                    {/* ATS Score Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {app.ats_score !== null && app.ats_score !== undefined && app.ats_score > 0 ? (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getAtsScoreBg(app.ats_score)} ${getAtsScoreColor(app.ats_score)}`}>
                            <FaChartLine size={10} />
                            {app.ats_score}%
                          </div>
                        ) : app.ats_calculation_status === 'processing' ? (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <FaSpinner className="animate-spin" size={10} />
                            Calculating...
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">ATS not calculated</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FaCalendarAlt size={10} />
                        {formatDate(app.created_at)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      {!trashed ? (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                            {getStatusText(app.status)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FaTrash size={16} className="text-gray-400" />
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                            Withdrawn
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expected Salary */}
                    {app.expected_salary && !trashed && (
                      <div className="mb-3 flex items-center gap-2 text-sm">
                        <FaDollarSign className="text-green-600" size={12} />
                        <span className="font-medium text-green-600">{formatSalary(app.expected_salary)}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Link
                          href={route('backend.apply.show', app.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${trashed
                            ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </Link>

                        {canEdit && (
                          <Link
                            href={route('backend.apply.edit', app.id)}
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Application"
                          >
                            <FaEdit size={16} />
                          </Link>
                        )}

                        {canWithdraw && (
                          <button
                            onClick={() => handleWithdraw(app.id)}
                            disabled={withdrawingId === app.id}
                            className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${withdrawingId === app.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Withdraw Application"
                          >
                            {withdrawingId === app.id ? (
                              <FaSpinner className="animate-spin" size={16} />
                            ) : (
                              <FaTrash size={16} />
                            )}
                          </button>
                        )}

                        {canRestore && (
                          <button
                            onClick={() => handleRestore(app.id)}
                            disabled={restoringId === app.id}
                            className={`p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 ${restoringId === app.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Restore Application"
                          >
                            {restoringId === app.id ? (
                              <FaSpinner className="animate-spin" size={16} />
                            ) : (
                              <FaTrashRestore size={16} />
                            )}
                          </button>
                        )}

                        {canForceDelete && (
                          <button
                            onClick={() => handleForceDelete(app.id, app.job_title)}
                            className="p-2 text-red-700 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all duration-200"
                            title="Permanently Delete"
                          >
                            <FaTrash size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {app.resume_url && (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
                            title="View Resume"
                          >
                            <FaFilePdf size={16} />
                          </a>
                        )}

                        {canRecalculate && (
                          <button
                            onClick={() => handleRecalculateAts(app.id)}
                            disabled={recalculatingId === app.id}
                            className={`p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-all duration-200 ${recalculatingId === app.id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="Recalculate ATS Score"
                          >
                            {recalculatingId === app.id ? (
                              <FaSpinner className="animate-spin" size={16} />
                            ) : (
                              <FaChartLine size={16} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {pagination && pagination.lastPage > 1 && (
            <div className="mt-6">
              <Pagination />
            </div>
          )}
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}