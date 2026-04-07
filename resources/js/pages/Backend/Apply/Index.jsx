// resources/js/Pages/Backend/Apply/Index.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaBriefcase,
  FaCalendarAlt,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChartLine,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaTrashRestore,
  FaTrashAlt,
  FaArchive,
} from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

export default function ApplyIndex({ applications, stats, filters, showTrashed = false }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [minAtsScore, setMinAtsScore] = useState(filters.min_ats_score || '');
  const [showFilters, setShowFilters] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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
    const statuses = {
      'pending': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FaHourglassHalf size={12} /> },
      'shortlisted': { text: 'Shortlisted', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle size={12} /> },
      'rejected': { text: 'Rejected', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle size={12} /> },
      'hired': { text: 'Hired', color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle size={12} /> },
    };
    return statuses[status] || statuses.pending;
  };

  const getAtsScoreColor = (score) => {
    if (!score && score !== 0) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAtsScoreProgressColor = (score) => {
    if (!score && score !== 0) return '#9ca3af';
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getAtsCalculationBadge = (status) => {
    const statuses = {
      'pending': { text: 'Pending', color: 'bg-gray-100 text-gray-500', icon: <FaHourglassHalf size={10} /> },
      'processing': { text: 'Processing', color: 'bg-blue-100 text-blue-600', icon: <FaSpinner size={10} className="animate-spin" /> },
      'completed': { text: 'Completed', color: 'bg-green-100 text-green-600', icon: <FaCheckCircle size={10} /> },
      'failed': { text: 'Failed', color: 'bg-red-100 text-red-600', icon: <FaTimesCircle size={10} /> },
    };
    return statuses[status] || statuses.pending;
  };

  const handleViewApplication = (id) => {
    router.visit(route('backend.apply.show', id));
  };

  const handleEditApplication = (id) => {
    router.visit(route('backend.apply.edit', id));
  };

  const handleWithdrawApplication = (id, jobTitle) => {
    Swal.fire({
      title: 'Withdraw Application?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to withdraw your application for:</p>
          <p class="font-semibold text-red-600 mb-3">"${jobTitle}"</p>
          <p class="text-sm text-gray-500">The application will be moved to trash. You can restore it later.</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Withdraw',
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
              text: 'Your application has been moved to trash.',
              timer: 2000,
              showConfirmButton: false,
            });
            setWithdrawingId(null);
            // Refresh the page to update the list
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to withdraw application.',
              confirmButtonColor: '#2563eb',
            });
            setWithdrawingId(null);
          },
        });
      }
    });
  };

  const handleRestoreApplication = (id, jobTitle) => {
    Swal.fire({
      title: 'Restore Application?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to restore your application for:</p>
          <p class="font-semibold text-green-600 mb-3">"${jobTitle}"</p>
          <p class="text-sm text-gray-500">The application will be moved back to active applications.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Restore',
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
              text: 'Your application has been restored successfully.',
              timer: 2000,
              showConfirmButton: false,
            });
            setRestoringId(null);
            // Refresh the page to update the list
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to restore application.',
              confirmButtonColor: '#2563eb',
            });
            setRestoringId(null);
          },
        });
      }
    });
  };

  const handleForceDeleteApplication = (id, jobTitle) => {
    Swal.fire({
      title: 'Permanently Delete?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to permanently delete your application for:</p>
          <p class="font-semibold text-red-600 mb-3">"${jobTitle}"</p>
          <p class="text-sm text-red-500 font-semibold">⚠️ This action cannot be undone!</p>
          <p class="text-xs text-gray-500 mt-2">The resume file will also be deleted from storage.</p>
        </div>
      `,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete Permanently',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('backend.apply.force-delete', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Application has been permanently deleted.',
              timer: 2000,
              showConfirmButton: false,
            });
            setDeletingId(null);
            // Refresh the page to update the list
            router.reload();
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to delete application.',
              confirmButtonColor: '#2563eb',
            });
            setDeletingId(null);
          },
        });
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const routeName = showTrashed ? 'backend.apply.trashed' : 'backend.apply.index';
    const params = { search: searchTerm };

    if (!showTrashed) {
      if (statusFilter) params.status = statusFilter;
      if (minAtsScore) params.min_ats_score = minAtsScore;
    }

    router.get(route(routeName), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setMinAtsScore('');
    const routeName = showTrashed ? 'backend.apply.trashed' : 'backend.apply.index';
    router.get(route(routeName), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="text-white" size={18} />
        </div>
      </div>
    </div>
  );

  // Component for ATS Score Display
  const AtsScoreDisplay = ({ score, status }) => {
    if (status === 'completed' && score !== null && score !== undefined) {
      const roundedScore = Math.round(score);
      const progressColor = getAtsScoreProgressColor(roundedScore);
      const textColor = getAtsScoreColor(roundedScore);

      return (
        <div className="flex items-center gap-3">
          {/* Progress Circle */}
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke={progressColor}
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - roundedScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${textColor}`}>
                {roundedScore}%
              </span>
            </div>
          </div>

          {/* Score Text with Progress Bar */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${textColor}`}>
                {roundedScore}% Match
              </span>
              <span className="text-xs text-gray-400">ATS Score</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-500`}
                style={{
                  width: `${roundedScore}%`,
                  backgroundColor: progressColor
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (status === 'processing') {
      return (
        <div className="flex items-center gap-2">
          <FaSpinner className="animate-spin text-blue-500" size={16} />
          <span className="text-sm text-gray-500">Calculating...</span>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" size={16} />
          <span className="text-sm text-red-500">Failed</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <FaHourglassHalf className="text-gray-400" size={16} />
        <span className="text-sm text-gray-500">Pending</span>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title={showTrashed ? "Trashed Applications" : "My Applications"} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {showTrashed ? 'Trashed Applications' : 'My Applications'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {showTrashed
                    ? 'View and manage your withdrawn applications'
                    : 'Track and manage all your job applications in one place'}
                </p>
              </div>
              <div className="flex gap-2">
                {!showTrashed && stats.total_deleted > 0 && (
                  <button
                    onClick={() => router.visit(route('backend.apply.trashed'))}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                  >
                    <FaArchive size={16} />
                    Trash ({stats.total_deleted})
                  </button>
                )}
                {showTrashed && (
                  <button
                    onClick={() => router.visit(route('backend.apply.index'))}
                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <FaBriefcase size={16} />
                    Active Applications
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards - Only show for active applications */}
          {!showTrashed && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
              <StatCard title="Total" value={stats.total} icon={FaBriefcase} color="bg-blue-500" />
              <StatCard title="Pending" value={stats.pending} icon={FaHourglassHalf} color="bg-yellow-500" />
              <StatCard title="Shortlisted" value={stats.shortlisted} icon={FaCheckCircle} color="bg-green-500" />
              <StatCard title="Rejected" value={stats.rejected} icon={FaTimesCircle} color="bg-red-500" />
              <StatCard title="Hired" value={stats.hired} icon={FaCheckCircle} color="bg-purple-500" />
              <div className="bg-white rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Avg. ATS Score</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.average_ats_score ? Math.round(stats.average_ats_score) : 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <FaChartLine className="text-white" size={18} />
                  </div>
                </div>
              </div>
              <StatCard title="In Trash" value={stats.total_deleted || 0} icon={FaArchive} color="bg-gray-500" />
            </div>
          )}

          {showTrashed && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <StatCard title="Deleted Applications" value={stats.total_deleted || 0} icon={FaArchive} color="bg-red-500" />
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaSearch size={14} className="text-gray-500" />
                  Search & Filter
                </h2>
                {!showTrashed && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <FaFilter size={12} />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                )}
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by job title..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaSearch size={14} />
                      Search
                    </button>
                    {(searchTerm || statusFilter || minAtsScore) && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <FaTimes size={14} />
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {showFilters && !showTrashed && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum ATS Score (%)
                      </label>
                      <select
                        value={minAtsScore}
                        onChange={(e) => setMinAtsScore(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">All Scores</option>
                        <option value="80">80% and above</option>
                        <option value="60">60% and above</option>
                        <option value="40">40% and above</option>
                        <option value="20">20% and above</option>
                      </select>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {showTrashed ? 'Deleted On' : 'Applied On'}
                    </th>
                    {!showTrashed && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ATS Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.data.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                          {showTrashed ? (
                            <>
                              <FaArchive size={48} className="text-gray-300" />
                              <p>No trashed applications found</p>
                              <button
                                onClick={() => router.visit(route('backend.apply.index'))}
                                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                              >
                                View Active Applications →
                              </button>
                            </>
                          ) : (
                            <>
                              <FaBriefcase size={48} className="text-gray-300" />
                              <p>No applications found</p>
                              <a
                                href={route('public.jobs.index')}
                                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
                              >
                                Browse Jobs →
                              </a>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.data.map((application) => {
                      const status = !showTrashed && getStatusBadge(application.status);
                      const canEdit = application.status === 'pending';

                      return (
                        <tr key={application.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FaBriefcase className="text-blue-500" size={16} />
                              <div>
                                <span className="font-medium text-gray-900">{application.job_title}</span>
                                <div className="text-xs text-gray-400 mt-0.5">
                                  {application.employer_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-gray-400" size={14} />
                              <span className="text-gray-600">
                                {showTrashed
                                  ? formatDateTime(application.deleted_at)
                                  : formatDate(application.created_at)
                                }
                              </span>
                            </div>
                          </td>
                          {!showTrashed && (
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                {status.icon}
                                {status.text}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <AtsScoreDisplay
                              score={application.ats_score}
                              status={application.ats_calculation_status}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewApplication(application.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View Details"
                              >
                                <FaEye size={16} />
                              </button>

                              {showTrashed ? (
                                <>
                                  <button
                                    onClick={() => handleRestoreApplication(application.id, application.job_title)}
                                    disabled={restoringId === application.id}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                                    title="Restore Application"
                                  >
                                    {restoringId === application.id ? (
                                      <FaSpinner size={16} className="animate-spin" />
                                    ) : (
                                      <FaTrashRestore size={16} />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleForceDeleteApplication(application.id, application.job_title)}
                                    disabled={deletingId === application.id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                    title="Permanently Delete"
                                  >
                                    {deletingId === application.id ? (
                                      <FaSpinner size={16} className="animate-spin" />
                                    ) : (
                                      <FaTrashAlt size={16} />
                                    )}
                                  </button>
                                </>
                              ) : (
                                canEdit && (
                                  <>
                                    <button
                                      onClick={() => handleEditApplication(application.id)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                      title="Edit Application"
                                    >
                                      <FaEdit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleWithdrawApplication(application.id, application.job_title)}
                                      disabled={withdrawingId === application.id}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                      title="Withdraw Application"
                                    >
                                      {withdrawingId === application.id ? (
                                        <FaSpinner size={16} className="animate-spin" />
                                      ) : (
                                        <FaTrash size={16} />
                                      )}
                                    </button>
                                  </>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {applications.data.length > 0 && applications.links && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-sm text-gray-500">
                    Showing {applications.from || 0} to {applications.to || 0} of {applications.total} results
                  </p>
                  <div className="flex gap-2">
                    {applications.links.map((link, index) => {
                      if (link.url === null) {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => router.visit(link.url)}
                          className={`px-3 py-1 rounded-lg transition ${link.active
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
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
        </div>
      </div>
    </AuthenticatedLayout>
  );
}