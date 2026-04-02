// resources/js/pages/Backend/Applications/Show.jsx

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';

// Icons
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaFilePdf,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaStar,
  FaUserCircle,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Layouts
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function Show({ application, userRole }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [employerNotes, setEmployerNotes] = useState(application.employer_notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  console.log(application);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>
        <Icon size={14} />
        {s.label}
      </span>
    );
  };

  const getATSScoreColor = (score) => {
    if (!score) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleStatusUpdate = (newStatus) => {
    Swal.fire({
      title: 'Update Status',
      text: `Are you sure you want to change status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdatingStatus(true);

        const submitData = new FormData();
        submitData.append('status', newStatus);
        if (employerNotes !== application.employer_notes) {
          submitData.append('employer_notes', employerNotes);
        }

        router.post(route('backend.applications.update-status', application.id), submitData, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `Application status changed to ${newStatus}`,
              timer: 1500,
              showConfirmButton: false
            });
            setUpdatingStatus(false);
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to update status. Please try again.',
            });
            setUpdatingStatus(false);
          }
        });
      }
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setDeleting(true);
    setShowDeleteModal(false);

    router.delete(route('backend.applications.destroy', application.id), {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Application has been deleted successfully.',
          timer: 1500,
          showConfirmButton: false
        });

        // Redirect based on user role
        if (userRole === 'job_seeker') {
          router.get(route('backend.applications.my-applications'));
        } else if (userRole === 'employer' || userRole === 'admin') {
          router.get(route('backend.applications.job. ', application.job_listing_id));
        } else {
          router.get(route('dashboard'));
        }
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to delete application. Please try again.',
        });
        setDeleting(false);
      }
    });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const downloadResume = () => {
    // Use the CV URL from applicant_profile if available
    if (application.applicant_profile?.cv_url) {
      window.open(application.applicant_profile.cv_url, '_blank');
    } else {
      // Fallback to the download route
      window.open(route('backend.applications.download-resume', application.id), '_blank');
    }
  };

  const handleSaveNotes = () => {
    const submitData = new FormData();
    submitData.append('employer_notes', employerNotes);
    submitData.append('status', application.status);

    router.post(route('backend.applications.update-status', application.id), submitData, {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Notes saved successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        setIsEditingNotes(false);
      },
      onError: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to save notes. Please try again.',
        });
      }
    });
  };

  const handleRecalculateScore = () => {
    Swal.fire({
      title: 'Recalculate ATS Score?',
      text: 'This will analyze the resume again against the job requirements.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, recalculate',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setRecalculating(true);

        router.post(route('backend.applications.recalculate-score', application.id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Queued!',
              text: 'ATS score recalculation has been queued. Please refresh in a moment.',
              timer: 2000,
              showConfirmButton: false
            });
            setRecalculating(false);
            // Refresh the page after 2 seconds
            setTimeout(() => {
              router.reload();
            }, 2000);
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to queue recalculation. Please try again.',
            });
            setRecalculating(false);
          }
        });
      }
    });
  };

  // Parse ATS data if it exists (it might be stored as JSON)
  const atsData = application.ats_score ?
    (typeof application.ats_score === 'string' ? JSON.parse(application.ats_score) : application.ats_score) :
    null;

  const atsScore = atsData?.percentage || atsData?.total || null;
  const matchedKeywords = atsData?.matched_keywords || application.matched_keywords || [];
  const missingKeywords = atsData?.missing_keywords || application.missing_keywords || [];
  const isPending = application.status === 'pending';

  // Get applicant name from either the direct fields or the profile
  const applicantName = application.name || application.applicant_profile?.full_name || `${application.applicant_profile?.first_name || ''} ${application.applicant_profile?.last_name || ''}`.trim() || 'N/A';
  const applicantEmail = application.email || application.applicant_profile?.email || 'N/A';
  const applicantPhone = application.phone || application.applicant_profile?.phone || 'Not provided';

  return (
    <AuthenticatedLayout>
      <Head title={`Application - ${applicantName}`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Back
            </button>

            <div className="flex gap-3">
              {userRole === 'job_seeker' && isPending && (
                <Link
                  href={route('backend.applications.edit', application.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  <FaEdit size={16} />
                  Edit Application
                </Link>
              )}

              {/* Delete button for job seekers (only pending applications) */}
              {userRole === 'job_seeker' && isPending && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {deleting ? <FaSpinner className="animate-spin" size={16} /> : <FaTrash size={16} />}
                  Withdraw Application
                </button>
              )}

              {/* Delete button for employers/admins */}
              {(userRole === 'employer' || userRole === 'admin') && (
                <button
                  onClick={handleDeleteClick}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
                >
                  {deleting ? <FaSpinner className="animate-spin" size={16} /> : <FaTrash size={16} />}
                  Delete Application
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applicant Profile Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Applicant Information</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    {application.applicant_profile?.photo_url ? (
                      <img
                        src={application.applicant_profile.photo_url}
                        alt={applicantName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserCircle className="text-gray-400 text-5xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{applicantName}</h3>
                      <p className="text-gray-500">Applicant</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaEnvelope className="text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{applicantEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaPhone className="text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{applicantPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="text-blue-600" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Applied On</p>
                        <p className="text-sm font-medium text-gray-900">{formatDateTime(application.created_at)}</p>
                      </div>
                    </div>
                    {application.expected_salary && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <FaMoneyBillWave className="text-blue-600" size={18} />
                        <div>
                          <p className="text-xs text-gray-500">Expected Salary</p>
                          <p className="text-sm font-medium text-gray-900">${parseFloat(application.expected_salary).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resume Download */}
                  {(application.applicant_profile?.cv_url || application.resume_path) && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={downloadResume}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200"
                      >
                        <FaFilePdf size={18} />
                        Download Resume
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details Card */}
              {application.job_listing && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Job Details</h2>
                  </div>
                  <div className="p-6">
                    <Link
                      href={route('backend.listing.show', application.job_listing.id)}
                      className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {application.job_listing.title}
                    </Link>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-sm">
                        <FaBuilding className="text-gray-400" />
                        <span className="text-gray-600">{application.job_listing.user?.name || 'Company'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="text-gray-600">{application.job_listing.location?.name || 'Remote'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaBriefcase className="text-gray-400" />
                        <span className="text-gray-600 capitalize">{application.job_listing.job_type?.replace('-', ' ') || 'Full Time'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <FaCalendarAlt className="text-gray-400" />
                        <span className="text-gray-600">Deadline: {formatDate(application.job_listing.application_deadline)}</span>
                      </div>
                      {application.job_listing.salary && (
                        <div className="flex items-center gap-3 text-sm">
                          <FaMoneyBillWave className="text-gray-400" />
                          <span className="text-gray-600">Salary: {application.job_listing.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ATS Score Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">ATS Analysis</h2>
                  {(userRole === 'employer' || userRole === 'admin') && (
                    <button
                      onClick={handleRecalculateScore}
                      disabled={recalculating}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-200 text-sm disabled:opacity-50"
                      title="Recalculate ATS Score"
                    >
                      {recalculating ? <FaSpinner className="animate-spin" size={14} /> : <FaSync size={14} />}
                      Recalculate
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {atsScore ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="relative inline-block">
                          <div className={`text-5xl font-bold ${getATSScoreColor(atsScore)}`}>
                            {atsScore}%
                          </div>
                          <div className="text-sm text-gray-500 mt-1">Overall Match</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matchedKeywords && matchedKeywords.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                              <FaCheckCircle size={16} /> Matched Keywords ({matchedKeywords.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {matchedKeywords.map((keyword, idx) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {missingKeywords && missingKeywords.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                              <FaTimesCircle size={16} /> Missing Keywords ({missingKeywords.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {missingKeywords.map((keyword, idx) => (
                                <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <FaSpinner className="text-gray-400 text-2xl animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">ATS Score Processing</h3>
                      <p className="text-gray-500 text-sm">
                        Your application is being analyzed by our ATS system.
                        <br />
                        The score will appear here shortly.
                      </p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">
                          <strong>Note:</strong> ATS (Applicant Tracking System) analyzes your resume against job requirements.
                          Higher scores indicate better matches with job keywords and requirements.
                        </p>
                      </div>
                      {(userRole === 'employer' || userRole === 'admin') && (
                        <button
                          onClick={handleRecalculateScore}
                          disabled={recalculating}
                          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                        >
                          {recalculating ? <FaSpinner className="animate-spin" size={16} /> : <FaSync size={16} />}
                          Calculate Score Now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Application Status</h2>
                </div>
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    {getStatusBadge(application.status)}
                  </div>

                  {(userRole === 'employer' || userRole === 'admin') && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updatingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Employer Notes Card */}
              {(userRole === 'employer' || userRole === 'admin') && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Employer Notes</h2>
                  </div>
                  <div className="p-6">
                    {isEditingNotes ? (
                      <div>
                        <textarea
                          value={employerNotes}
                          onChange={(e) => setEmployerNotes(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Add notes about this candidate..."
                        />
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleSaveNotes}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingNotes(false);
                              setEmployerNotes(application.employer_notes || '');
                            }}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">
                          {application.employer_notes || 'No notes added yet.'}
                        </p>
                        <button
                          onClick={() => setIsEditingNotes(true)}
                          className="mt-3 text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <FaEdit size={12} /> {application.employer_notes ? 'Edit Notes' : 'Add Notes'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application Timeline */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-linear-to-r from-gray-700 to-gray-800 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">Timeline</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FaCheckCircle className="text-green-600" size={14} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Application Submitted</p>
                        <p className="text-xs text-gray-500">{formatDateTime(application.created_at)}</p>
                      </div>
                    </div>

                    {application.updated_at !== application.created_at && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaEye className="text-blue-600" size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Last Updated</p>
                          <p className="text-xs text-gray-500">{formatDateTime(application.updated_at)}</p>
                        </div>
                      </div>
                    )}

                    {application.status !== 'pending' && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FaStar className="text-purple-600" size={14} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Status Updated</p>
                          <p className="text-xs text-gray-500">Changed to {application.status}</p>
                          <p className="text-xs text-gray-400">{formatDateTime(application.updated_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {userRole === 'job_seeker' ? 'Withdraw Application?' : 'Delete Application?'}
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                {userRole === 'job_seeker'
                  ? 'Are you sure you want to withdraw your application? This action cannot be undone.'
                  : 'Are you sure you want to delete this application? This action cannot be undone.'}
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deleting && <FaSpinner className="animate-spin" size={16} />}
                  {userRole === 'job_seeker' ? 'Yes, Withdraw' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}