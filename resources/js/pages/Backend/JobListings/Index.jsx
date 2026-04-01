// resources/js/pages/Backend/JobListings/Index.jsx

import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaEye,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaTrashRestore,
  FaFilter,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function JobListingsIndex({ jobListings, flash }) {
  const [deletingId, setDeletingId] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: 'all', // all, active, inactive, deleted
    jobType: 'all',
    experienceLevel: 'all',
    category: 'all',
    location: 'all',
    dateRange: 'all' // all, today, week, month
  });

  // Get unique values for filters
  const uniqueJobTypes = useMemo(() => {
    const types = new Set();
    jobListings.forEach(job => {
      if (job.job_type) types.add(job.job_type);
    });
    return Array.from(types);
  }, [jobListings]);

  const uniqueExperienceLevels = useMemo(() => {
    const levels = new Set();
    jobListings.forEach(job => {
      if (job.experience_level) levels.add(job.experience_level);
    });
    return Array.from(levels);
  }, [jobListings]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    jobListings.forEach(job => {
      if (job.category?.name) cats.add(job.category.name);
    });
    return Array.from(cats);
  }, [jobListings]);

  const uniqueLocations = useMemo(() => {
    const locs = new Set();
    jobListings.forEach(job => {
      if (job.location?.name) locs.add(job.location.name);
    });
    return Array.from(locs);
  }, [jobListings]);

  // Filter jobs based on all filters
  const filteredJobListings = useMemo(() => {
    let filtered = [...jobListings];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        (job.category?.name && job.category.name.toLowerCase().includes(searchLower)) ||
        (job.location?.name && job.location.name.toLowerCase().includes(searchLower)) ||
        (job.salary && job.salary.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(job => {
        if (filters.status === 'active') return !job.deleted_at && job.is_active;
        if (filters.status === 'inactive') return !job.deleted_at && !job.is_active;
        if (filters.status === 'deleted') return job.deleted_at !== null;
        return true;
      });
    }

    // Job type filter
    if (filters.jobType !== 'all') {
      filtered = filtered.filter(job => job.job_type === filters.jobType);
    }

    // Experience level filter
    if (filters.experienceLevel !== 'all') {
      filtered = filtered.filter(job => job.experience_level === filters.experienceLevel);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(job => job.category?.name === filters.category);
    }

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.location?.name === filters.location);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(job => {
        if (!job.application_deadline) return false;
        const deadline = new Date(job.application_deadline);

        if (filters.dateRange === 'today') {
          return deadline >= today && deadline < new Date(today.getTime() + 86400000);
        }
        if (filters.dateRange === 'week') {
          const weekFromNow = new Date(today.getTime() + 7 * 86400000);
          return deadline >= today && deadline <= weekFromNow;
        }
        if (filters.dateRange === 'month') {
          const monthFromNow = new Date(today.getTime() + 30 * 86400000);
          return deadline >= today && deadline <= monthFromNow;
        }
        return true;
      });
    }

    return filtered;
  }, [jobListings, filters]);

  // Sort jobs: Active first, then Inactive, then Deleted
  const sortedJobListings = useMemo(() => {
    return [...filteredJobListings].sort((a, b) => {
      const aIsTrashed = a.deleted_at !== null;
      const bIsTrashed = b.deleted_at !== null;

      // Deleted jobs go to the bottom
      if (aIsTrashed && !bIsTrashed) return 1;
      if (!aIsTrashed && bIsTrashed) return -1;

      // For non-deleted jobs, sort by active status
      if (!aIsTrashed && !bIsTrashed) {
        // Active jobs first
        if (a.is_active && !b.is_active) return -1;
        if (!a.is_active && b.is_active) return 1;

        // If both active or both inactive, sort by created_at (newest first)
        return new Date(b.created_at) - new Date(a.created_at);
      }

      // For deleted jobs, sort by deleted_at (newest first)
      if (aIsTrashed && bIsTrashed) {
        return new Date(b.deleted_at) - new Date(a.deleted_at);
      }

      return 0;
    });
  }, [filteredJobListings]);

  // Count jobs by status
  const activeCount = jobListings.filter(job => !job.deleted_at && job.is_active).length;
  const inactiveCount = jobListings.filter(job => !job.deleted_at && !job.is_active).length;
  const deletedCount = jobListings.filter(job => job.deleted_at).length;

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      jobType: 'all',
      experienceLevel: 'all',
      category: 'all',
      location: 'all',
      dateRange: 'all'
    });
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return filters.search !== '' ||
      filters.status !== 'all' ||
      filters.jobType !== 'all' ||
      filters.experienceLevel !== 'all' ||
      filters.category !== 'all' ||
      filters.location !== 'all' ||
      filters.dateRange !== 'all';
  };

  // Show flash messages
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
      confirmButtonColor: '#2563eb',
    });
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete job listing?',
      text: 'This will move it to trash. Applications will be preserved.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('backend.listing.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Job listing has been moved to trash.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: errors?.message || 'Failed to delete job listing. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Restore job listing?',
      text: 'This will restore the job listing from trash.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setRestoringId(id);

        router.patch(route('backend.listing.restore', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Job listing has been restored successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Restore Failed',
              text: errors?.message || 'Failed to restore job listing. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setRestoringId(null),
        });
      }
    });
  };

  const handleToggle = (job) => {
    Swal.fire({
      title: 'Change status?',
      text: `This will ${job.is_active ? 'deactivate' : 'activate'} this job listing.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        setTogglingId(job.id);

        router.patch(route('backend.listing.toggle-active', job.id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            router.reload();
            Swal.fire({
              icon: 'success',
              title: 'Status Updated!',
              text: `Job listing has been ${!job.is_active ? 'activated' : 'deactivated'}.`,
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (error) => {
            console.error('Toggle error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Failed to update job status. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setTogglingId(null),
        });
      }
    });
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeBadge = (type) => {
    const types = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-yellow-100 text-yellow-800',
      'contract': 'bg-blue-100 text-blue-800',
      'freelance': 'bg-purple-100 text-purple-800',
      'internship': 'bg-orange-100 text-orange-800',
      'remote': 'bg-indigo-100 text-indigo-800'
    };
    return types[type] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceBadge = (level) => {
    const levels = {
      'entry': 'bg-blue-100 text-blue-800',
      'junior': 'bg-cyan-100 text-cyan-800',
      'mid': 'bg-teal-100 text-teal-800',
      'senior': 'bg-purple-100 text-purple-800',
      'lead': 'bg-orange-100 text-orange-800',
      'executive': 'bg-red-100 text-red-800',
      'intern': 'bg-gray-100 text-gray-800'
    };
    return levels[level] || 'bg-gray-100 text-gray-800';
  };

  const isTrashed = (job) => {
    return job.deleted_at !== null;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Job Listings" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6 text-black">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Listings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all job postings in one place
              </p>
              {/* Status counters */}
              <div className="flex gap-3 mt-2">
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Active: {activeCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Inactive: {inactiveCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Deleted: {deletedCount}
                </span>
                {hasActiveFilters() && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Filtered: {sortedJobListings.length}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${showFilters || hasActiveFilters()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <FaFilter size={14} />
                Filters
                {hasActiveFilters() && (
                  <span className="ml-1 bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {Object.values(filters).filter(v => v !== 'all' && v !== '').length}
                  </span>
                )}
                {showFilters ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>

              <a
                href={route('backend.listing.create')}
                className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <FaPlus size={16} />
                Create Job
              </a>
            </div>
          </div>

          {/* FILTERS PANEL */}
          {showFilters && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Job Listings</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <FaTimes size={12} />
                  Reset all
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      placeholder="Search by title, category..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Types</option>
                    {uniqueJobTypes.map(type => (
                      <option key={type} value={type}>{type.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={filters.experienceLevel}
                    onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Levels</option>
                    {uniqueExperienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Any Time</option>
                    <option value="today">Today</option>
                    <option value="week">Next 7 Days</option>
                    <option value="month">Next 30 Days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type & Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deadline
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
                  {sortedJobListings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaBriefcase className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No job listings found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {hasActiveFilters() ? 'Try adjusting your filters.' : 'Get started by creating a new job posting.'}
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

                  {sortedJobListings.map((job, index) => {
                    const trashed = isTrashed(job);

                    return (
                      <tr
                        key={job.id}
                        className={`hover:bg-gray-50 transition-all duration-200 animate-fade-in ${trashed ? 'bg-gray-50 opacity-75' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* JOB DETAILS */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${trashed ? 'bg-gray-300' : job.is_active ? 'bg-green-100' : 'bg-yellow-100'}`}>
                              <FaBriefcase className={trashed ? 'text-gray-500' : job.is_active ? 'text-green-600' : 'text-yellow-600'} size={18} />
                            </div>
                            <div>
                              <div className={`font-semibold ${trashed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                {job.title}
                              </div>
                              <div className={`text-sm mt-1 ${trashed ? 'text-gray-400' : 'text-gray-500'}`}>
                                {job.category?.name || 'N/A'}
                              </div>
                              {job.salary && (
                                <div className={`text-xs mt-1 font-medium ${trashed ? 'text-gray-400' : 'text-green-600'}`}>
                                  {job.salary}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* LOCATION */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className={trashed ? 'text-gray-400' : 'text-gray-400'} size={14} />
                            <span className={`text-sm ${trashed ? 'text-gray-400' : 'text-gray-700'}`}>
                              {job.location?.name || 'N/A'}
                            </span>
                          </div>
                        </td>

                        {/* TYPE & LEVEL */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {!trashed ? (
                              <>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeBadge(job.job_type)}`}>
                                  {job.job_type?.replace('-', ' ') || 'N/A'}
                                </span>
                                <br />
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceBadge(job.experience_level)}`}>
                                  {job.experience_level || 'N/A'}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-500">
                                  {job.job_type?.replace('-', ' ') || 'N/A'}
                                </span>
                                <br />
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-500">
                                  {job.experience_level || 'N/A'}
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* DEADLINE */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className={trashed ? 'text-gray-400' : 'text-gray-400'} size={14} />
                            <span className={`text-sm ${trashed ? 'text-gray-400' : 'text-gray-700'}`}>
                              {formatDate(job.application_deadline)}
                            </span>
                          </div>
                          {!trashed && new Date(job.application_deadline) < new Date() && job.is_active && (
                            <span className="text-xs text-red-500 mt-1 block">
                              Expired
                            </span>
                          )}
                          {trashed && (
                            <span className="text-xs text-gray-400 mt-1 block">
                              Deleted: {formatDate(job.deleted_at)}
                            </span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          {!trashed ? (
                            <button
                              onClick={() => handleToggle(job)}
                              disabled={togglingId === job.id}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${job.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                } ${togglingId === job.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {togglingId === job.id ? (
                                <FaSpinner className="animate-spin" size={12} />
                              ) : job.is_active ? (
                                <FaToggleOn size={14} />
                              ) : (
                                <FaToggleOff size={14} />
                              )}
                              {job.is_active ? 'Active' : 'Inactive'}
                            </button>
                          ) : (
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-500">
                              Deleted
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            {/* VIEW APPLICATIONS - Only for non-deleted jobs */}
                            {!trashed && (
                              <a
                                href={route('backend.listing.applications', job.id)}
                                className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
                                title="View Applications"
                              >
                                <FaUsers size={18} />
                              </a>
                            )}

                            {/* VIEW DETAILS */}
                            <a
                              href={route('backend.listing.show', job.id)}
                              className={`p-2 rounded-lg transition-all duration-200 ${trashed
                                ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                              title="View Details"
                            >
                              <FaEye size={18} />
                            </a>

                            {/* EDIT BUTTON - Only for non-deleted jobs */}
                            {!trashed && (
                              <a
                                href={route('backend.listing.edit', job.id)}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit"
                              >
                                <FaEdit size={18} />
                              </a>
                            )}

                            {/* RESTORE BUTTON - Only for deleted jobs */}
                            {trashed && (
                              <button
                                onClick={() => handleRestore(job.id)}
                                disabled={restoringId === job.id}
                                className={`p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200 ${restoringId === job.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                title="Restore"
                              >
                                {restoringId === job.id ? (
                                  <FaSpinner className="animate-spin" size={18} />
                                ) : (
                                  <FaTrashRestore size={18} />
                                )}
                              </button>
                            )}

                            {/* DELETE BUTTON - Only for non-deleted jobs */}
                            {!trashed && (
                              <button
                                onClick={() => handleDelete(job.id)}
                                disabled={deletingId === job.id}
                                className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === job.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                title="Delete"
                              >
                                {deletingId === job.id ? (
                                  <FaSpinner className="animate-spin" size={18} />
                                ) : (
                                  <FaTrash size={18} />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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