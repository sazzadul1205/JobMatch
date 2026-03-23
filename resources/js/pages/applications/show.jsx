// pages/applications/show.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiDownload,
  FiClock,
  FiCalendar,
  FiBriefcase,
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiAlertCircle,
  FiAward,
  FiBarChart2,
  FiTag,
  FiEdit2,
  FiSave,
  FiX,
  FiRefreshCw,
  FiExternalLink
} from 'react-icons/fi';

const ApplicationShow = ({ application, userRole }) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.employer_notes || '');

  const { post, processing } = useForm();
  const { patch: statusPatch, processing: statusProcessing } = useForm();

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: FiClock,
        text: 'Pending Review',
        border: 'border-yellow-200'
      },
      reviewed: {
        color: 'bg-blue-100 text-blue-800',
        icon: FiEye,
        text: 'Reviewed',
        border: 'border-blue-200'
      },
      shortlisted: {
        color: 'bg-purple-100 text-purple-800',
        icon: FiStar,
        text: 'Shortlisted',
        border: 'border-purple-200'
      },
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: FiXCircle,
        text: 'Rejected',
        border: 'border-red-200'
      },
      hired: {
        color: 'bg-green-100 text-green-800',
        icon: FiCheckCircle,
        text: 'Hired',
        border: 'border-green-200'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon size={16} />
        {config.text}
      </span>
    );
  };

  // Get ATS score color and label
  const getScoreInfo = (score) => {
    if (!score) return { color: 'gray', label: 'Not Calculated', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };

    if (score >= 80) return { color: 'green', label: 'Excellent', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (score >= 60) return { color: 'blue', label: 'Good', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    if (score >= 40) return { color: 'yellow', label: 'Fair', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    return { color: 'red', label: 'Needs Improvement', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  };

  // Handle status update
  const handleStatusUpdate = (newStatus) => {
    statusPatch(route('backend.application.update-status', application.id), {
      data: { status: newStatus, employer_notes: notes },
      preserveScroll: true,
      onSuccess: () => {
        // Optionally show success message
      }
    });
  };

  // Handle save notes
  const handleSaveNotes = () => {
    statusPatch(route('backend.application.update-status', application.id), {
      data: { status: application.status, employer_notes: notes },
      preserveScroll: true,
      onSuccess: () => {
        setIsEditingNotes(false);
      }
    });
  };

  // Handle download resume
  const handleDownloadResume = () => {
    window.open(route('backend.application.download-resume', application.id), '_blank');
  };

  // Handle recalculate score (admin only)
  const handleRecalculateScore = () => {
    if (confirm('Are you sure you want to recalculate the ATS score for this application?')) {
      post(route('backend.application.recalculate-score', application.id), {
        preserveScroll: true
      });
    }
  };

  const scoreInfo = getScoreInfo(application.ats_score?.total);
  const ScoreIcon = scoreInfo.label === 'Excellent' ? FiAward : FiBarChart2;

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending Review', icon: FiClock, color: 'yellow' },
    { value: 'reviewed', label: 'Mark as Reviewed', icon: FiEye, color: 'blue' },
    { value: 'shortlisted', label: 'Shortlist Candidate', icon: FiStar, color: 'purple' },
    { value: 'rejected', label: 'Reject Application', icon: FiXCircle, color: 'red' },
    { value: 'hired', label: 'Mark as Hired', icon: FiCheckCircle, color: 'green' }
  ];

  return (
    <AuthenticatedLayout>
      <Head title={`Application - ${application.name}`} />

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={route('backend.application.index')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Applications
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Application from {application.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Submitted for {application.job_listing?.title}
              </p>
            </div>
            <div className="flex gap-3">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser size={20} />
                Applicant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 font-medium">{application.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <a href={`mailto:${application.email}`} className="text-indigo-600 hover:text-indigo-700">
                    {application.email}
                  </a>
                </div>
                {application.phone && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                      Phone Number
                    </label>
                    <a href={`tel:${application.phone}`} className="text-gray-900">
                      {application.phone}
                    </a>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                    Applied On
                  </label>
                  <p className="text-gray-900">{formatDate(application.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText size={20} />
                Resume / CV
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-indigo-600" size={24} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Resume Document</p>
                    <p className="text-xs text-gray-500">Uploaded on {formatDate(application.created_at)}</p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <FiDownload size={16} />
                  Download
                </button>
              </div>
            </div>

            {/* Employer Notes (for employers/admins) */}
            {(userRole === 'employer' || userRole === 'admin') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiEdit2 size={20} />
                    Employer Notes
                  </h2>
                  {!isEditingNotes && (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                    >
                      <FiEdit2 size={14} />
                      Edit Notes
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <div className="space-y-3">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add your notes about this candidate..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditingNotes(false);
                          setNotes(application.employer_notes || '');
                        }}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveNotes}
                        disabled={processing}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <FiSave size={14} />
                        Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    {application.employer_notes ? (
                      <p className="text-gray-700 whitespace-pre-wrap">{application.employer_notes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No notes added yet.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* ATS Score Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiBarChart2 size={20} />
                  ATS Score
                </h2>
                {(userRole === 'admin' || userRole === 'employer') && (
                  <button
                    onClick={handleRecalculateScore}
                    className="text-gray-500 hover:text-gray-700"
                    title="Recalculate Score"
                  >
                    <FiRefreshCw size={16} />
                  </button>
                )}
              </div>

              {application.ats_score?.total ? (
                <>
                  <div className="text-center mb-4">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={scoreInfo.color === 'green' ? '#10B981' : scoreInfo.color === 'blue' ? '#3B82F6' : scoreInfo.color === 'yellow' ? '#F59E0B' : '#EF4444'}
                            strokeWidth="3"
                            strokeDasharray={`${application.ats_score.total}, 100`}
                          />
                          <text x="18" y="22" textAnchor="middle" fontSize="8" fill="currentColor" className="text-gray-900 font-bold">
                            {Math.round(application.ats_score.total)}%
                          </text>
                        </svg>
                      </div>
                    </div>
                    <div className={`mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${scoreInfo.bgColor} ${scoreInfo.textColor}`}>
                      <ScoreIcon size={14} />
                      {scoreInfo.label}
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  {application.ats_score.analysis_details && (
                    <div className="mt-4 space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Score Breakdown</h3>
                      {application.ats_score.analysis_details.keyword_match && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Keyword Match</span>
                            <span>{Math.round(application.ats_score.analysis_details.keyword_match)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 rounded-full h-2"
                              style={{ width: `${Math.min(application.ats_score.analysis_details.keyword_match, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {application.ats_score.analysis_details.experience_match && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Experience Match</span>
                            <span>{Math.round(application.ats_score.analysis_details.experience_match)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 rounded-full h-2"
                              style={{ width: `${Math.min(application.ats_score.analysis_details.experience_match, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {application.ats_score.analysis_details.education_match && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Education Match</span>
                            <span>{Math.round(application.ats_score.analysis_details.education_match)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 rounded-full h-2"
                              style={{ width: `${Math.min(application.ats_score.analysis_details.education_match, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <FiBarChart2 className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-gray-500">ATS score not calculated yet</p>
                  <p className="text-xs text-gray-400 mt-1">Score will appear after processing</p>
                </div>
              )}
            </div>

            {/* Skills Match */}
            {application.matched_keywords && application.matched_keywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiTag size={16} />
                  Skills Match
                </h2>
                <div className="space-y-3">
                  {application.matched_keywords && application.matched_keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Matched Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {application.matched_keywords.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {application.missing_keywords && application.missing_keywords.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Missing Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {application.missing_keywords.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Position Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <FiBriefcase className="text-gray-400 mt-0.5" size={14} />
                  <div>
                    <p className="text-gray-500">Job Title</p>
                    <Link
                      href={route('backend.listing.show', application.job_listing?.id)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {application.job_listing?.title}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FiMapPin className="text-gray-400 mt-0.5" size={14} />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="text-gray-900">{application.job_listing?.location || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FiCalendar className="text-gray-400 mt-0.5" size={14} />
                  <div>
                    <p className="text-gray-500">Application Deadline</p>
                    <p className="text-gray-900">{formatDate(application.job_listing?.application_deadline)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update (for employers/admins) */}
            {(userRole === 'employer' || userRole === 'admin') && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Update Status</h2>
                <div className="space-y-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = application.status === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusUpdate(option.value)}
                        disabled={statusProcessing || isActive}
                        className={`w-full text-left px-4 py-2 rounded-lg transition flex items-center gap-3 ${isActive
                            ? `bg-${option.color}-100 text-${option.color}-700 cursor-default`
                            : `hover:bg-${option.color}-50 text-gray-700 hover:text-${option.color}-700`
                          }`}
                      >
                        <Icon size={18} />
                        <span className="flex-1">{option.label}</span>
                        {isActive && <FiCheckCircle size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Application Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiClock size={16} />
                Application Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="text-green-600" size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(application.created_at)}</p>
                  </div>
                </div>
                {application.updated_at && application.updated_at !== application.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FiRefreshCw className="text-blue-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(application.updated_at)}</p>
                    </div>
                  </div>
                )}
                {application.status === 'shortlisted' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FiStar className="text-purple-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shortlisted</p>
                      <p className="text-xs text-gray-500">Candidate has been shortlisted for interview</p>
                    </div>
                  </div>
                )}
                {application.status === 'hired' && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiCheckCircle className="text-green-600" size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Hired</p>
                      <p className="text-xs text-gray-500">Candidate has been hired for this position</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ApplicationShow;
