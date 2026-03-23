import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUsers,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiX,
  FiClock,
  FiMapPin,
  FiBriefcase,
  FiTag,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const JobListingsIndex = ({ jobs, filters, userRole }) => {
  // Initialize state from props (which come from URL query parameters)
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedFilters, setSelectedFilters] = useState({
    job_type: filters.job_type || '',
    category: filters.category || '',
    experience_level: filters.experience_level || '',
    location: filters.location || '',
    status: filters.status || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Update local state when filters prop changes (from URL)
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setSelectedFilters({
      job_type: filters.job_type || '',
      category: filters.category || '',
      experience_level: filters.experience_level || '',
      location: filters.location || '',
      status: filters.status || ''
    });
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters - updates URL and triggers new request
  const applyFilters = () => {
    // Build query parameters object, removing empty values
    const queryParams = {};

    if (searchTerm) queryParams.search = searchTerm;
    if (selectedFilters.job_type) queryParams.job_type = selectedFilters.job_type;
    if (selectedFilters.category) queryParams.category = selectedFilters.category;
    if (selectedFilters.experience_level) queryParams.experience_level = selectedFilters.experience_level;
    if (selectedFilters.location) queryParams.location = selectedFilters.location;
    if (selectedFilters.status) queryParams.status = selectedFilters.status;

    router.get(route('backend.listing.index'), queryParams, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Quick status filter buttons
  const handleStatusFilter = (status) => {
    const newFilters = {
      ...selectedFilters,
      status: status === selectedFilters.status ? '' : status
    };

    setSelectedFilters(newFilters);

    const queryParams = {};
    if (searchTerm) queryParams.search = searchTerm;
    if (newFilters.job_type) queryParams.job_type = newFilters.job_type;
    if (newFilters.category) queryParams.category = newFilters.category;
    if (newFilters.experience_level) queryParams.experience_level = newFilters.experience_level;
    if (newFilters.location) queryParams.location = newFilters.location;
    if (newFilters.status) queryParams.status = newFilters.status;

    router.get(route('backend.listing.index'), queryParams, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedFilters({
      job_type: '',
      category: '',
      experience_level: '',
      location: '',
      status: ''
    });
    router.get(route('backend.listing.index'), {}, {
      preserveState: true,
      preserveScroll: true
    });
  };

  // Handle job deletion
  const handleDelete = (job) => {
    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      router.delete(route('backend.listing.destroy', job.id));
    }
  };

  // Handle status toggle
  const handleToggleStatus = (job) => {
    router.patch(route('backend.listing.toggle-active', job.id));
  };

  // Handle Enter key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Get status badge color
  const getStatusBadge = (isActive, deadline) => {
    const isExpired = new Date(deadline) < new Date();

    if (!isActive || isExpired) {
      return {
        color: 'bg-red-100 text-red-800',
        text: 'Inactive',
        icon: FiXCircle
      };
    }
    return {
      color: 'bg-green-100 text-green-800',
      text: 'Active',
      icon: FiCheckCircle
    };
  };

  // Get job type badge color
  const getJobTypeBadge = (jobType) => {
    const types = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-purple-100 text-purple-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'remote': 'bg-teal-100 text-teal-800'
    };
    return types[jobType] || 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedFilters.job_type) count++;
    if (selectedFilters.category) count++;
    if (selectedFilters.experience_level) count++;
    if (selectedFilters.location) count++;
    if (selectedFilters.status) count++;
    return count;
  };

  return (
    <AuthenticatedLayout>
      <Head title="All Jobs" />

      <div className="py-2 text-black">
        {/* Header with Post Job Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Job Listings</h1>
          {(userRole === 'employer' || userRole === 'admin') && (
            <Link
              href={route('backend.listing.create')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              <FiPlus className="mr-2" size={16} />
              Post New Job
            </Link>
          )}
        </div>

        {/* Status Filter Quick Buttons */}
        {(userRole === 'employer' || userRole === 'admin') && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => handleStatusFilter('active')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150 ${selectedFilters.status === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FiCheckCircle size={16} />
              Active Jobs
            </button>
            <button
              onClick={() => handleStatusFilter('inactive')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150 ${selectedFilters.status === 'inactive'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FiXCircle size={16} />
              Inactive Jobs
            </button>
            {selectedFilters.status && (
              <button
                onClick={() => handleStatusFilter('')}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition duration-150"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by title, description, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                  Search
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 flex items-center gap-2 relative"
                >
                  <FiFilter size={18} />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  )}
                  {showFilters ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition duration-150"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedFilters.job_type && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                    Type: {selectedFilters.job_type}
                    <button
                      onClick={() => handleFilterChange('job_type', '')}
                      className="ml-1 hover:text-blue-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">
                    Category: {selectedFilters.category}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 hover:text-green-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.experience_level && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                    Experience: {selectedFilters.experience_level}
                    <button
                      onClick={() => handleFilterChange('experience_level', '')}
                      className="ml-1 hover:text-purple-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.location && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800">
                    Location: {selectedFilters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="ml-1 hover:text-orange-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                {selectedFilters.status && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-red-100 text-red-800">
                    Status: {selectedFilters.status}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1 hover:text-red-600"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {/* Job Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiBriefcase className="inline mr-1" size={14} />
                      Job Type
                    </label>
                    <select
                      value={selectedFilters.job_type}
                      onChange={(e) => handleFilterChange('job_type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiTag className="inline mr-1" size={14} />
                      Category
                    </label>
                    <select
                      value={selectedFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Categories</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                      <option value="human_resources">Human Resources</option>
                      <option value="customer_service">Customer Service</option>
                    </select>
                  </div>

                  {/* Experience Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                      value={selectedFilters.experience_level}
                      onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid-level">Mid Level (3-5 years)</option>
                      <option value="senior">Senior Level (6-9 years)</option>
                      <option value="executive">Executive (10+ years)</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiMapPin className="inline mr-1" size={14} />
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location..."
                      value={selectedFilters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Status Filter (for admin/employer) */}
                  {(userRole === 'employer' || userRole === 'admin') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FiClock className="inline mr-1" size={14} />
                        Status
                      </label>
                      <select
                        value={selectedFilters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.data && jobs.data.length > 0 ? (
                  jobs.data.map((job) => {
                    const statusBadge = getStatusBadge(job.is_active, job.application_deadline);
                    const StatusIcon = statusBadge.icon;
                    const jobTypeBadge = getJobTypeBadge(job.job_type);

                    return (
                      <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4">
                          <div>
                            <Link
                              href={route('backend.listing.show', job.id)}
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                            >
                              {job.title}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                              {job.category} • {job.experience_level}
                            </div>
                            {job.salary_range && (
                              <div className="text-xs text-gray-400 mt-1">
                                {job.salary_range}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiMapPin className="mr-1" size={14} />
                            {job.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${jobTypeBadge}`}>
                            {job.job_type.replace('-', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(job.application_deadline)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${statusBadge.color}`}>
                            <StatusIcon size={12} />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {/* View Details Button */}
                            <Link
                              href={route('backend.listing.show', job.id)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <FiEye size={18} />
                            </Link>

                            {/* View Applicants Button (for employer/admin) */}
                            {(userRole === 'employer' || userRole === 'admin') && (
                              <Link
                                href={route('backend.listing.applications', job.id)}
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="View Applicants"
                              >
                                <FiUsers size={18} />
                              </Link>
                            )}

                            {/* Edit Button (for owner or admin) */}
                            {(userRole === 'employer' || userRole === 'admin') && (
                              <Link
                                href={route('backend.listing.edit', job.id)}
                                className="text-yellow-600 hover:text-yellow-900 p-1"
                                title="Edit Job"
                              >
                                <FiEdit2 size={18} />
                              </Link>
                            )}

                            {/* Delete Button (for owner or admin) */}
                            {(userRole === 'employer' || userRole === 'admin') && (
                              <button
                                onClick={() => handleDelete(job)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Job"
                              >
                                <FiTrash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FiSearch className="mx-auto mb-2" size={48} />
                        <p className="text-lg">No jobs found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {jobs.links && jobs.links.length > 3 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {jobs.from || 0} to {jobs.to || 0} of {jobs.total || 0} results
                </div>
                <div className="flex gap-2">
                  {jobs.links.map((link, index) => {
                    if (link.url === null) return null;
                    return (
                      <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-1 rounded ${link.active
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    </AuthenticatedLayout>
  );
};

export default JobListingsIndex;