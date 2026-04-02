// resources/js/pages/Backend/Applications/MyApplications.jsx

import { useState } from 'react';
import { Head, Link, router } from "@inertiajs/react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaChartLine,
  FaSpinner,
} from 'react-icons/fa';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function MyApplications({ applications, filters }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock, label: 'Pending' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaEye, label: 'Reviewed' },
      shortlisted: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle, label: 'Shortlisted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimesCircle, label: 'Rejected' },
      hired: { bg: 'bg-purple-100', text: 'text-purple-800', icon: FaStar, label: 'Hired' }
    };
    const s = statuses[status] || statuses.pending;
    const Icon = s.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
        <Icon size={12} />
        {s.label}
      </span>
    );
  };

  const getATSScoreColor = (score) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getATSScore = (application) => {
    // Check if ATS score exists in various possible locations
    if (application.ats_score) {
      if (typeof application.ats_score === 'object') {
        return application.ats_score.percentage || application.ats_score.total || null;
      }
      if (typeof application.ats_score === 'number') {
        return application.ats_score;
      }
    }
    return null;
  };

  const handleSearch = () => {
    router.get(route('backend.applications.my-applications'), {
      search: searchTerm,
      status: statusFilter,
    }, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    router.get(route('backend.applications.my-applications'), {}, {
      preserveState: true,
      preserveScroll: true
    });
  };

  const handleViewApplication = (id) => {
    router.get(route('backend.applications.show', id));
  };

  return (
    <AuthenticatedLayout>
      <Head title="My Applications" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">View all your job applications and ATS scores</p>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-62.5">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by job title..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  router.get(route('backend.applications.my-applications'), {
                    search: searchTerm,
                    status: e.target.value,
                  }, { preserveState: true });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>

              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>

              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ATS Score
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.data.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaBriefcase className="text-4xl text-gray-300 mb-3" />
                          <p>No applications found</p>
                          <Link
                            href={route('public.jobs.index')}
                            className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Browse Jobs
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.data.map((application) => {
                      const atsScore = getATSScore(application);
                      const isProcessing = application.ats_calculation_status === 'processing';

                      return (
                        <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {application.job_listing?.title || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {application.job_listing?.job_type && (
                                <span className="capitalize">{application.job_listing.job_type}</span>
                              )}
                              {application.job_listing?.location && (
                                <span className="ml-2 flex items-center gap-1">
                                  <FaMapMarkerAlt size={10} /> {application.job_listing.location.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FaBuilding className="text-gray-400" />
                              <span className="text-gray-900">{application.job_listing?.user?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">{formatDate(application.created_at)}</div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(application.status)}
                          </td>
                          <td className="px-6 py-4">
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <FaSpinner className="animate-spin text-gray-400" size={14} />
                                <span className="text-xs text-gray-500">Calculating...</span>
                              </div>
                            ) : atsScore ? (
                              <div className="flex items-center gap-2">
                                <span className={`text-lg font-bold ${getATSScoreColor(atsScore)}`}>
                                  {Math.round(atsScore)}%
                                </span>
                                <div className="w-16">
                                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
                              <div className="flex items-center gap-1">
                                <FaChartLine className="text-gray-400" size={14} />
                                <span className="text-xs text-gray-500">Not available</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleViewApplication(application.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                              title="View Details"
                            >
                              <FaEye size={18} />
                              <span className="text-sm">View</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {applications.data.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {applications.from} to {applications.to} of {applications.total} results
                  </div>
                  <div className="flex gap-2">
                    {applications.links.map((link, index) => {
                      if (link.url === null) {
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-400 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      }
                      return (
                        <button
                          key={index}
                          onClick={() => router.get(link.url)}
                          className={`px-3 py-1 rounded-lg transition-colors ${link.active
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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