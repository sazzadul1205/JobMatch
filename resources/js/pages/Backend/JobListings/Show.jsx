// resources/js/Pages/Backend/Applications/Show.jsx

import { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaDownload,
  FaEnvelope,
  FaEye,
  FaFacebook,
  FaFilePdf,
  FaHourglassHalf,
  FaInfoCircle,
  FaLightbulb,
  FaLinkedin,
  FaPhone,
  FaSpinner,
  FaStar,
  FaThumbsUp,
  FaTimesCircle,
  FaTrash,
  FaUser,
  FaUserCheck,
  FaUserSlash,
  FaUsers,
} from 'react-icons/fa';

// SweetAlert2
import Swal from 'sweetalert2';

export default function ApplicationsShow({ application, atsAnalysis, timelineData, similarApplications, statuses }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [recalculating, setRecalculating] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaHourglassHalf className="text-yellow-500" size={24} />,
      shortlisted: <FaUserCheck className="text-blue-500" size={24} />,
      rejected: <FaUserSlash className="text-red-500" size={24} />,
      hired: <FaCheckCircle className="text-green-500" size={24} />
    };
    return icons[status] || <FaBriefcase className="text-gray-500" size={24} />;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pending Review',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired'
    };
    return texts[status] || status;
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

  const getAtsScoreMessage = (score) => {
    if (!score) return 'Not calculated yet';
    if (score >= 80) return 'Excellent match! This candidate\'s CV aligns very well with the position.';
    if (score >= 60) return 'Good match! The candidate meets most requirements.';
    if (score >= 40) return 'Fair match. Consider reviewing the CV for relevant keywords.';
    return 'Low match. The candidate may need to customize their CV for this position.';
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US').format(salary) + ' BDT';
  };

  const handleStatusUpdate = () => {
    Swal.fire({
      title: 'Update Application Status',
      html: `
        <div class="text-left">
          <p class="mb-3">Change status for <strong>${application.name}</strong></p>
          <select id="status-select" class="swal2-select w-full px-3 py-2 border rounded-lg">
            ${statuses.map(status => `
              <option value="${status}" ${status === application.status ? 'selected' : ''}>
                ${getStatusText(status)}
              </option>
            `).join('')}
          </select>
          <textarea id="notes-input" class="swal2-textarea mt-3 w-full px-3 py-2 border rounded-lg" 
            placeholder="Optional: Add notes for this status change..." rows="3"></textarea>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Update Status',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const status = document.getElementById('status-select').value;
        const notes = document.getElementById('notes-input').value;
        return { status, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setUpdatingStatus(true);

        router.post(route('backend.applications.update-status', application.id), {
          status: result.value.status,
          notes: result.value.notes || null,
        }, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: 'Application status updated successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.reload();
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: errors?.message || 'Failed to update status.',
              confirmButtonColor: '#d33',
            });
          },
          onFinish: () => setUpdatingStatus(false),
        });
      }
    });
  };

  const handleRecalculateAts = () => {
    Swal.fire({
      title: 'Recalculate ATS Score?',
      text: 'This will re-analyze the candidate\'s CV against the job requirements.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, recalculate',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setRecalculating(true);

        router.post(route('backend.applications.recalculate-ats', application.id), {}, {
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
          onFinish: () => setRecalculating(false),
        });
      }
    });
  };

  const handleDownloadCv = () => {
    window.location.href = route('backend.applications.download-cv', application.id);
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Application?',
      html: `Are you sure you want to delete the application from <strong>${application.name}</strong>?<br><br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route('backend.applications.destroy', application.id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Application has been deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
            router.get(route('backend.applications.index'));
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

  // Get timeline for display
  const statusTimeline = application.status_timelines || [];

  return (
    <AuthenticatedLayout>
      <Head title={`Application: ${application.name} - ${application.job_listing?.title}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.get(route('backend.applications.index'))}
              className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={14} />
              <span className="text-sm font-medium">Back to Applications</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleDownloadCv}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-all duration-200"
              >
                <FaDownload size={14} />
                Download CV
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 transition-all duration-200"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>

          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fade-in">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 px-6 py-5">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-white">Application Details</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {application.job_listing?.title} at {application.job_listing?.employer?.name || 'Company'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(application.status)}
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(application.status)}`}>
                    {getStatusText(application.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Applicant Information Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Applicant Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                      {application.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{application.name}</h3>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaEnvelope size={12} />
                          {application.email}
                        </span>
                        {application.phone && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <FaPhone size={12} />
                            {application.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Applied on</p>
                      <p className="font-medium text-gray-900">{formatShortDate(application.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">{formatShortDate(application.updated_at)}</p>
                    </div>
                    {application.years_of_experience && (
                      <div>
                        <p className="text-sm text-gray-500">Years of Experience</p>
                        <p className="font-medium text-gray-900">{application.years_of_experience} years</p>
                      </div>
                    )}
                    {application.expected_salary && (
                      <div>
                        <p className="text-sm text-gray-500">Expected Salary</p>
                        <p className="font-medium text-green-600">{formatSalary(application.expected_salary)}</p>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(application.linkedin_link || application.facebook_link) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Social Profiles</p>
                      <div className="flex gap-4">
                        {application.linkedin_link && (
                          <a
                            href={application.linkedin_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaLinkedin size={18} />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                        {application.facebook_link && (
                          <a
                            href={application.facebook_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <FaFacebook size={18} />
                            <span className="text-sm">Facebook</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CV/Resume */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleDownloadCv}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-all duration-200"
                    >
                      <FaFilePdf size={16} />
                      <span className="text-sm font-medium">Download Resume/CV</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Details Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-blue-600" />
                    Job Details
                  </h2>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{application.job_listing?.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaBuilding size={14} />
                      <span>{application.job_listing?.employer?.name || 'Company'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendarAlt size={14} />
                      <span>{application.job_listing?.job_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStar size={14} />
                      <span>{application.job_listing?.experience_level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock size={14} />
                      <span>Deadline: {formatShortDate(application.job_listing?.application_deadline)}</span>
                    </div>
                  </div>

                  {application.job_listing?.description && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Job Description</p>
                      <div
                        className="text-sm text-gray-600 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: application.job_listing.description.length > 500
                            ? application.job_listing.description.substring(0, 500) + '...'
                            : application.job_listing.description
                        }}
                      />
                      {application.job_listing.description.length > 500 && (
                        <Link
                          href={route('backend.jobs.show', application.job_listing.id)}
                          className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                        >
                          View full job description →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              {statusTimeline.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FaClock className="text-blue-600" />
                      Status Timeline
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {statusTimeline.map((timeline, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            {index < statusTimeline.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-200"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(timeline.status)}`}>
                                {getStatusText(timeline.status)}
                              </span>
                              <span className="text-xs text-gray-500">{formatDate(timeline.created_at)}</span>
                            </div>
                            {timeline.notes && (
                              <p className="text-sm text-gray-600 mt-1">{timeline.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - ATS Score & Actions */}
            <div className="space-y-6">
              {/* ATS Score Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 sticky top-24">
                <div className="px-6 py-4 bg-linear-to-r from-purple-600 to-indigo-600">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FaChartLine size={18} />
                    ATS Compatibility Score
                  </h3>
                </div>
                <div className="p-6">
                  {atsAnalysis ? (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" style={{
                        background: `conic-gradient(${atsAnalysis.percentage >= 80 ? '#10b981' : atsAnalysis.percentage >= 60 ? '#3b82f6' : atsAnalysis.percentage >= 40 ? '#f59e0b' : '#ef4444'} ${atsAnalysis.percentage * 3.6}deg, #e5e7eb ${atsAnalysis.percentage * 3.6}deg)`
                      }}>
                        <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                          <div className="text-center">
                            <span className={`text-3xl font-bold ${getAtsScoreColor(atsAnalysis.percentage)}`}>
                              {atsAnalysis.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className={`text-sm font-medium mb-3 ${getAtsScoreColor(atsAnalysis.percentage)}`}>
                        {getAtsScoreMessage(atsAnalysis.percentage)}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-green-600 font-medium text-sm">Matched Keywords</p>
                          <p className="text-2xl font-bold text-green-700">{atsAnalysis.matched_keywords?.length || 0}</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-red-600 font-medium text-sm">Missing Keywords</p>
                          <p className="text-2xl font-bold text-red-700">{atsAnalysis.missing_keywords?.length || 0}</p>
                        </div>
                      </div>

                      {atsAnalysis.matched_keywords && atsAnalysis.matched_keywords.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-green-600 mb-2 text-left">✓ Matched Keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {atsAnalysis.matched_keywords.slice(0, 8).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                {keyword}
                              </span>
                            ))}
                            {atsAnalysis.matched_keywords.length > 8 && (
                              <span className="px-2 py-0.5 text-xs text-gray-500">+{atsAnalysis.matched_keywords.length - 8} more</span>
                            )}
                          </div>
                        </div>
                      )}

                      {atsAnalysis.missing_keywords && atsAnalysis.missing_keywords.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-red-600 mb-2 text-left">⚠ Missing Keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {atsAnalysis.missing_keywords.slice(0, 8).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {atsAnalysis.analysis?.suggestions && atsAnalysis.analysis.suggestions.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <FaLightbulb className="text-blue-600" size={14} />
                            <p className="text-xs font-medium text-blue-800">Suggestions for Candidate</p>
                          </div>
                          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            {atsAnalysis.analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={handleRecalculateAts}
                        disabled={recalculating}
                        className="w-full mt-4 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {recalculating ? (
                          <>
                            <FaSpinner className="animate-spin" size={14} />
                            Recalculating...
                          </>
                        ) : (
                          <>
                            <FaChartLine size={14} />
                            Recalculate ATS Score
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      {application.ats_calculation_status === 'pending' || application.ats_calculation_status === 'processing' ? (
                        <>
                          <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
                          <p className="text-gray-600">ATS score is being calculated...</p>
                          <p className="text-xs text-gray-400 mt-2">This may take a few moments</p>
                        </>
                      ) : application.ats_calculation_status === 'failed' ? (
                        <>
                          <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-3" />
                          <p className="text-gray-600">ATS calculation failed</p>
                          <button
                            onClick={handleRecalculateAts}
                            className="mt-3 text-sm text-purple-600 hover:text-purple-700"
                          >
                            Try recalculating
                          </button>
                        </>
                      ) : (
                        <>
                          <FaChartLine className="text-gray-400 text-3xl mx-auto mb-3" />
                          <p className="text-gray-600">ATS score not available</p>
                          <button
                            onClick={handleRecalculateAts}
                            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
                          >
                            Calculate ATS Score
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Update Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-linear-to-r from-gray-700 to-gray-800">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FaThumbsUp size={16} />
                    Update Status
                  </h3>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updatingStatus ? (
                      <>
                        <FaSpinner className="animate-spin" size={14} />
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaCheck size={14} />
                        Change Status
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-linear-to-r from-indigo-600 to-purple-600">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <FaInfoCircle size={16} />
                    Quick Actions
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <Link
                    href={route('backend.applications.job', application.job_listing_id)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <FaUsers className="text-gray-600" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">View All Applications</p>
                      <p className="text-xs text-gray-500">See all applicants for this job</p>
                    </div>
                  </Link>

                  <Link
                    href={route('backend.jobs.show', application.job_listing_id)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <FaBriefcase className="text-gray-600" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">View Job Posting</p>
                      <p className="text-xs text-gray-500">Review the job details</p>
                    </div>
                  </Link>

                  <a
                    href={`mailto:${application.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <FaEnvelope className="text-gray-600" size={16} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Send Email</p>
                      <p className="text-xs text-gray-500">Contact the candidate</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Employer Notes */}
              {application.employer_notes && (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-yellow-600 mt-0.5 shrink-0" size={16} />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 mb-1">Previous Note</p>
                      <p className="text-sm text-yellow-700">{application.employer_notes}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Similar Applications */}
              {similarApplications && similarApplications.length > 0 && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="px-6 py-4 bg-linear-to-r from-teal-600 to-green-600">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <FaUsers size={16} />
                      Other Applicants
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {similarApplications.map((similar, idx) => (
                      <Link
                        key={idx}
                        href={route('backend.applications.show', similar.id)}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{similar.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs ${getStatusBadge(similar.status)}`}>
                              {getStatusText(similar.status)}
                            </span>
                            {similar.ats_score && (
                              <span className={`text-xs ${getAtsScoreColor(similar.ats_score)}`}>
                                ATS: {similar.ats_score}%
                              </span>
                            )}
                          </div>
                        </div>
                        <FaEye className="text-gray-400" size={14} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
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