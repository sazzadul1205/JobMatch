// resources/js/pages/Backend/JobListings/Index.jsx

import { useState } from 'react';
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
  FaUsers
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function JobListingsIndex({ jobListings, flash }) {
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  return (
    <AuthenticatedLayout>
      <Head title="Job Listings" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Listings
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all job postings in one place
              </p>
            </div>

            <a
              href={route('backend.listing.create')}
              className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <FaPlus size={16} />
              Create Job
            </a>
          </div>

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
                  {jobListings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaBriefcase className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No job listings found</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                        <div className="mt-6">
                          <a
                            href={route('backend.listing.create')}
                            className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                          >
                            <FaPlus className="mr-2" size={16} />
                            Create Job
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}

                  {jobListings.map((job, index) => (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* JOB DETAILS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                            <FaBriefcase className="text-blue-600" size={18} />
                          </div>
                          <div>
                            <div className={`font-semibold ${job.deleted_at ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {job.category?.name || 'N/A'}
                            </div>
                            {job.salary && (
                              <div className="text-xs text-green-600 mt-1 font-medium">
                                {job.salary}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-700">
                            {job.location?.name || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* TYPE & LEVEL */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeBadge(job.job_type)}`}>
                            {job.job_type?.replace('-', ' ') || 'N/A'}
                          </span>
                          <br />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceBadge(job.experience_level)}`}>
                            {job.experience_level || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* DEADLINE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-700">
                            {formatDate(job.application_deadline)}
                          </span>
                        </div>
                        {new Date(job.application_deadline) < new Date() && job.is_active && (
                          <span className="text-xs text-red-500 mt-1 block">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(job)}
                          disabled={togglingId === job.id || job.deleted_at}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${job.is_active && !job.deleted_at
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } ${(togglingId === job.id || job.deleted_at) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        {job.deleted_at && (
                          <span className="text-xs text-gray-500 mt-1 block">
                            Trashed
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          {/* VIEW APPLICATIONS */}
                          <a
                            href={route('backend.listing.applications', job.id)}
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200"
                            title="View Applications"
                          >
                            <FaUsers size={18} />
                          </a>

                          {/* VIEW DETAILS */}
                          <a
                            href={route('backend.listing.show', job.id)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <FaEye size={18} />
                          </a>

                          {/* EDIT BUTTON */}
                          {!job.deleted_at && (
                            <a
                              href={route('backend.listing.edit', job.id)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </a>
                          )}

                          {/* DELETE BUTTON */}
                          {!job.deleted_at && (
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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