// resources/js/pages/Backend/PublicJobListing/Index.jsx

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function PublicJobsIndex({
  jobListings,
  categories,
  locations,
  jobTypes,
  experienceLevels,
  filters
}) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    search: filters.search || '',
    category: filters.category || '',
    location: filters.location || '',
    job_type: filters.job_type || '',
    experience_level: filters.experience_level || '',
    sort: filters.sort || 'latest'
  });


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
      'intern': 'Intern (0-6 months)',
      'entry': 'Entry Level (0-1 years)',
      'junior': 'Junior (1-3 years)',
      'mid': 'Mid Level (3-5 years)',
      'senior': 'Senior (5-8 years)',
      'lead': 'Lead (8-10 years)',
      'executive': 'Executive (10+ years)'
    };
    return levels[level] || level;
  };

  const daysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const applyFilters = () => {
    router.get(route('public.jobs.index'), localFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const resetFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      location: '',
      job_type: '',
      experience_level: '',
      sort: 'latest'
    };
    setLocalFilters(resetFilters);
    router.get(route('public.jobs.index'), resetFilters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const hasActiveFilters = () => {
    return localFilters.search !== '' ||
      localFilters.category !== '' ||
      localFilters.location !== '' ||
      localFilters.job_type !== '' ||
      localFilters.experience_level !== '' ||
      localFilters.sort !== 'latest';
  };

  return (
    <AuthenticatedLayout>
      <Head title="Find Jobs" />

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600">
            Discover opportunities that match your skills and experience
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <span>Filters</span>
              {hasActiveFilters() && (
                <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {Object.values(localFilters).filter(v => v !== '' && v !== 'latest').length}
                </span>
              )}
            </div>
            {showMobileFilters ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters() && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTimes size={12} />
                    Reset all
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      name="search"
                      value={localFilters.search}
                      onChange={handleInputChange}
                      placeholder="Job title, category, location..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </form>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={localFilters.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name} ({cat.job_listings_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  name="location"
                  value={localFilters.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.slug}>
                      {loc.name} ({loc.job_listings_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  name="job_type"
                  value={localFilters.job_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>
                      {type?.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Level Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  name="experience_level"
                  value={localFilters.experience_level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  {experienceLevels.map(level => (
                    <option key={level} value={level}>
                      {getExperienceBadge(level)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  name="sort"
                  value={localFilters.sort}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="deadline_soon">Deadline: Soonest First</option>
                  <option value="deadline_later">Deadline: Latest First</option>
                </select>
              </div>

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Found {jobListings.total} job{jobListings.total !== 1 ? 's' : ''}
              </p>
            </div>

            {jobListings.data.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBriefcase className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {hasActiveFilters() ? 'Try adjusting your filters.' : 'Check back later for new opportunities.'}
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
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {jobListings.data.map((job) => {
                  const daysLeft = daysUntilDeadline(job.application_deadline);
                  const isUrgent = daysLeft <= 7 && daysLeft > 0;

                  return (
                    <Link
                      key={job.id}
                      href={route('backend.public-jobs.show', job.slug)}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group block"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {job.category?.name || 'General'}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <FaMapMarkerAlt size={14} />
                                <span>{job.location?.name || 'Remote'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeBadge(job.job_type)}`}>
                                  {job.job_type?.replace('-', ' ') || 'N/A'}
                                </span>
                                {job.salary && (
                                  <span className="text-sm text-green-600 font-medium">
                                    {job.salary}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {job.description?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <FaCalendarAlt size={14} />
                              <span>{formatDate(job.application_deadline)}</span>
                            </div>
                            {isUrgent && (
                              <div className="flex items-center gap-1 text-xs text-red-600">
                                <FaClock size={12} />
                                <span className="font-medium">{daysLeft} days left</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {jobListings.links && jobListings.links.length > 3 && (
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  {jobListings.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url || '#'}
                      className={`px-3 py-2 rounded-lg transition-all duration-200 ${link.active
                        ? 'bg-blue-600 text-white'
                        : link.url
                          ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}