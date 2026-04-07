// resources/js/Pages/Backend/Apply/Show.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaArrowLeft,
  FaFilePdf,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaLinkedin,
  FaFacebook,
  FaExternalLinkAlt,
  FaChartLine,
  FaStar,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaDownload,
  FaEye,
  FaRedoAlt,
  FaSpinner,
  FaLock,
  FaCrown,
  FaTrashRestore,
  FaTrashAlt,
  FaArchive,
} from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

export default function ApplyShow({ application, jobListing, applicantProfile, statusTimeline, atsDetails, atsStatus, isPremium = false, isDeleted = false }) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isForceDeleting, setIsForceDeleting] = useState(false);
  const [isRecalculatingAts, setIsRecalculatingAts] = useState(false);

  // Debug logging to see what's being passed
  console.log('ATS Details:', atsDetails);
  console.log('ATS Status:', atsStatus);
  console.log('Application:', application);
  console.log('Is Premium:', isPremium);
  console.log('Is Deleted:', isDeleted);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    const statuses = {
      'pending': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <FaHourglassHalf size={14} /> },
      'shortlisted': { text: 'Shortlisted', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle size={14} /> },
      'rejected': { text: 'Rejected', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle size={14} /> },
      'hired': { text: 'Hired', color: 'bg-blue-100 text-blue-800', icon: <FaCheckCircle size={14} /> },
    };
    return statuses[application?.status] || statuses.pending;
  };

  const getJobTypeLabel = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'internship': 'Internship',
      'remote': 'Remote',
      'hybrid': 'Hybrid',
    };
    return types[type] || type;
  };

  const getAtsScoreColor = (score) => {
    if (!score && score !== 0) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getAtsStatusBadge = () => {
    const statuses = {
      'pending': { text: 'Pending', color: 'bg-gray-100 text-gray-600', icon: <FaHourglassHalf size={12} /> },
      'processing': { text: 'Processing', color: 'bg-blue-100 text-blue-600', icon: <FaSpinner size={12} className="animate-spin" /> },
      'completed': { text: 'Completed', color: 'bg-green-100 text-green-600', icon: <FaCheckCircle size={12} /> },
      'failed': { text: 'Failed', color: 'bg-red-100 text-red-600', icon: <FaTimesCircle size={12} /> },
    };
    return statuses[atsStatus?.status] || statuses.pending;
  };

  const status = getStatusBadge();
  const atsStatusBadge = getAtsStatusBadge();
  const canEdit = application?.status === 'pending' && !isDeleted;

  const handleEdit = () => {
    router.visit(route('backend.apply.edit', application.id));
  };

  const handleWithdraw = () => {
    Swal.fire({
      title: 'Withdraw Application?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to withdraw your application for:</p>
          <p class="font-semibold text-red-600 mb-3">"${jobListing?.title}"</p>
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
        setIsWithdrawing(true);

        router.delete(route('backend.apply.destroy', application.id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Withdrawn!',
              text: 'Your application has been moved to trash.',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.apply.index'));
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to withdraw application.',
              confirmButtonColor: '#2563eb',
            });
            setIsWithdrawing(false);
          },
        });
      }
    });
  };

  const handleRestore = () => {
    Swal.fire({
      title: 'Restore Application?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to restore your application for:</p>
          <p class="font-semibold text-green-600 mb-3">"${jobListing?.title}"</p>
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
        setIsRestoring(true);

        router.post(route('backend.apply.restore', application.id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Your application has been restored successfully.',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.apply.show', application.id));
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to restore application.',
              confirmButtonColor: '#2563eb',
            });
            setIsRestoring(false);
          },
        });
      }
    });
  };

  const handleForceDelete = () => {
    Swal.fire({
      title: 'Permanently Delete?',
      html: `
        <div class="text-center">
          <p class="mb-2">Are you sure you want to permanently delete your application for:</p>
          <p class="font-semibold text-red-600 mb-3">"${jobListing?.title}"</p>
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
        setIsForceDeleting(true);

        router.delete(route('backend.apply.force-delete', application.id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Application has been permanently deleted.',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.apply.index'));
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: error?.response?.data?.message || 'Failed to delete application.',
              confirmButtonColor: '#2563eb',
            });
            setIsForceDeleting(false);
          },
        });
      }
    });
  };

  const handleRecalculateAts = () => {
    Swal.fire({
      title: 'Recalculate ATS Score?',
      text: 'This will analyze your CV again against the job requirements.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Recalculate',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsRecalculatingAts(true);

        Swal.fire({
          title: 'Processing...',
          text: 'Analyzing your CV against job requirements...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        router.post(route('backend.apply.recalculate-ats', application.id), {}, {
          preserveScroll: true,
          onSuccess: (response) => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'ATS Score Updated!',
              text: response?.props?.flash?.success || 'ATS score has been recalculated successfully.',
              confirmButtonColor: '#10b981',
              timer: 3000,
            }).then(() => {
              window.location.reload();
            });
          },
          onError: (error) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Recalculation Failed',
              text: error?.response?.data?.message || 'Failed to recalculate ATS score. Please try again.',
              confirmButtonColor: '#2563eb',
            });
            setIsRecalculatingAts(false);
          },
        });
      }
    });
  };

  const handleDownloadCV = () => {
    if (application?.resume_url) {
      window.open(application.resume_url, '_blank');
    }
  };

  const handleUpgradeToPremium = () => {
    Swal.fire({
      title: 'Unlock Detailed ATS Analysis',
      html: `
        <div class="text-center">
          <div class="text-5xl mb-3">🔒</div>
          <p class="text-gray-700 mb-4">Get access to:</p>
          <ul class="text-left text-sm text-gray-600 mb-4 space-y-2">
            <li>✓ <span class="font-medium">Full keyword matching analysis</span> - See exactly which keywords you matched</li>
            <li>✓ <span class="font-medium">Missing keywords list</span> - Know what keywords to add to your CV</li>
            <li>✓ <span class="font-medium">Personalized improvement suggestions</span> - Tailored recommendations</li>
            <li>✓ <span class="font-medium">Competitor comparison</span> - See how you rank against others</li>
            <li>✓ <span class="font-medium">Unlimited ATS recalculation</span> - Test different CV versions</li>
          </ul>
          <div class="bg-linear-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-lg mb-3">
            <p class="text-sm font-bold">✨ Special Offer: 30% Off First Month ✨</p>
            <p class="text-xs">Just $9.99/month after trial</p>
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '<span class="flex items-center gap-2"><FaCrown /> Upgrade to Premium</span>',
      cancelButtonText: 'Maybe Later',
      didOpen: () => {
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
          confirmBtn.style.background = 'linear-gradient(135deg, #f59e0b, #ea580c)';
          confirmBtn.style.border = 'none';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.visit(route('subscription.plans'));
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

  const InfoSection = ({ title, icon: Icon, children, bgGradient = false }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg">
      <div className={`flex items-center gap-2 px-6 py-4 ${bgGradient ? 'bg-linear-to-r from-gray-50 to-white' : 'bg-white'} border-b border-gray-200`}>
        <Icon className="text-blue-600" size={18} />
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, isLink = false }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-gray-900">
        {isLink && value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
            {value}
            <FaExternalLinkAlt size={12} />
          </a>
        ) : (
          value || <span className="text-gray-400 italic">Not provided</span>
        )}
      </dd>
    </div>
  );

  // Premium Blur Overlay Component
  const PremiumBlurOverlay = ({ children, height = "auto" }) => (
    <div className="relative">
      <div className="filter blur-[3px] pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLock className="text-white text-2xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-4 max-w-xs">
            Upgrade to Premium to see detailed keyword matching, personalized suggestions, and full ATS analysis
          </p>
          <button
            onClick={handleUpgradeToPremium}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md"
          >
            <FaCrown size={16} />
            Become a Premium Member
          </button>
          <p className="text-xs text-gray-400 mt-3">
            Starts from $9.99/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );

  // Show raw ATS data for debugging
  const showRawAtsData = () => {
    if (!atsDetails && application?.ats_score) {
      console.log('Raw ATS Score from application:', application.ats_score);
      return (
        <div className="bg-yellow-50 p-3 rounded-lg mb-3">
          <p className="text-xs text-yellow-700">Raw ATS Data Available:</p>
          <pre className="text-xs mt-1 overflow-auto">
            {JSON.stringify(application.ats_score, null, 2)}
          </pre>
        </div>
      );
    }
    return null;
  };

  // Deleted Application Banner
  if (isDeleted) {
    return (
      <AuthenticatedLayout>
        <Head title={`Deleted Application - ${jobListing?.title || 'Job'}`} />

        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-red-50 p-6 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <FaArchive className="text-red-600 text-2xl" />
                  <div>
                    <h1 className="text-xl font-bold text-red-800">Application in Trash</h1>
                    <p className="text-sm text-red-600">This application has been withdrawn and is in the trash.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center py-8">
                  <FaArchive className="text-gray-300 text-6xl mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">{jobListing?.title}</h2>
                  <p className="text-gray-500 mb-6">Deleted on {formatDateTime(application?.deleted_at)}</p>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleRestore}
                      disabled={isRestoring}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isRestoring ? (
                        <FaSpinner className="animate-spin" size={16} />
                      ) : (
                        <FaTrashRestore size={16} />
                      )}
                      Restore Application
                    </button>
                    <button
                      onClick={handleForceDelete}
                      disabled={isForceDeleting}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isForceDeleting ? (
                        <FaSpinner className="animate-spin" size={16} />
                      ) : (
                        <FaTrashAlt size={16} />
                      )}
                      Permanently Delete
                    </button>
                  </div>
                </div>

                {/* Show application info even when deleted */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Application Information</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Application ID:</dt>
                      <dd className="text-gray-900">#{application?.id}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Submitted On:</dt>
                      <dd className="text-gray-900">{formatDateTime(application?.created_at)}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="text-gray-500">Status:</dt>
                      <dd className="text-gray-900 capitalize">{application?.status}</dd>
                    </div>
                    <div className="flex justify-between py-2">
                      <dt className="text-gray-500">Expected Salary:</dt>
                      <dd className="text-gray-900">{formatCurrency(application?.expected_salary) || 'Not specified'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => router.visit(route('backend.apply.trashed'))}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                  >
                    <FaArrowLeft size={14} />
                    Back to Trash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Application for ${jobListing?.title || 'Job'}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <button
                onClick={() => router.visit(route('backend.apply.index'))}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                <span className="text-sm">Back to Applications</span>
              </button>

              <div className="flex gap-2">
                {canEdit && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaEdit size={14} />
                      Edit Application
                    </button>
                    <button
                      onClick={handleWithdraw}
                      disabled={isWithdrawing}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {isWithdrawing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaTrash size={14} />
                      )}
                      Withdraw
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                <h1 className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Application Details
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.icon}
                  {status.text}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Applied for {jobListing?.title} • Submitted on {formatDate(application?.created_at)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Details */}
              <InfoSection title="Job Details" icon={FaBriefcase}>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{jobListing?.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaBuilding size={14} />
                        <span>{jobListing?.employer?.name || 'Company'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt size={14} />
                        <span>Multiple Locations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt size={14} />
                        <span>{getJobTypeLabel(jobListing?.job_type)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStar size={14} />
                        <span>{jobListing?.experience_level}</span>
                      </div>
                    </div>
                  </div>
                  {jobListing?.description && (
                    <div className="mt-3">
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: jobListing.description }} />
                    </div>
                  )}
                </div>
              </InfoSection>

              {/* ATS Score Section */}
              <InfoSection title="ATS Score Analysis" icon={FaChartLine} bgGradient={true}>
                <div className="space-y-4">
                  {/* ATS Status Badge */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${atsStatusBadge.color}`}>
                      {atsStatusBadge.icon}
                      ATS Status: {atsStatusBadge.text}
                    </div>
                    {atsStatus?.can_recalculate && (
                      <button
                        onClick={handleRecalculateAts}
                        disabled={isRecalculatingAts}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                      >
                        {isRecalculatingAts ? (
                          <FaSpinner className="animate-spin" size={14} />
                        ) : (
                          <FaRedoAlt size={14} />
                        )}
                        Recalculate Score
                      </button>
                    )}
                  </div>

                  {showRawAtsData()}

                  {/* Show ATS Score when completed */}
                  {atsStatus?.status === 'completed' && atsDetails && atsDetails.percentage !== undefined ? (
                    <>
                      {/* Score Circle - Always visible */}
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-3" style={{
                          background: `conic-gradient(${atsDetails.percentage >= 80 ? '#10b981' : atsDetails.percentage >= 60 ? '#3b82f6' : atsDetails.percentage >= 40 ? '#f59e0b' : '#ef4444'} ${atsDetails.percentage * 3.6}deg, #e5e7eb ${atsDetails.percentage * 3.6}deg)`
                        }}>
                          <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center flex-col">
                            <span className={`text-3xl font-bold ${getAtsScoreColor(atsDetails.percentage)}`}>
                              {Math.round(atsDetails.percentage)}%
                            </span>
                            <span className="text-xs text-gray-500">Match</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Overall Compatibility Score</p>
                        {atsDetails.analysis && (
                          <p className={`text-sm mt-2 font-medium ${atsDetails.analysis.color === 'green' ? 'text-green-600' :
                            atsDetails.analysis.color === 'blue' ? 'text-blue-600' :
                              atsDetails.analysis.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {atsDetails.analysis.message}
                          </p>
                        )}
                      </div>

                      {/* Premium Content with Blur */}
                      <PremiumBlurOverlay>
                        {/* Keywords Match Count */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-green-600 font-medium">✓ Matched Keywords</p>
                            <p className="text-2xl font-bold text-green-700">{atsDetails.matched_count || atsDetails.matched_keywords?.length || 0}</p>
                            <p className="text-xs text-gray-500">keywords found in your CV</p>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-red-600 font-medium">✗ Missing Keywords</p>
                            <p className="text-2xl font-bold text-red-700">{atsDetails.missing_keywords?.length || 0}</p>
                            <p className="text-xs text-gray-500">keywords to add</p>
                          </div>
                        </div>

                        {/* Top Matched Keywords */}
                        {atsDetails.matched_keywords && atsDetails.matched_keywords.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-green-600 mb-2 flex items-center gap-1">
                              <FaCheckCircle size={12} />
                              Keywords Found in Your Resume ({atsDetails.matched_keywords.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                              {atsDetails.matched_keywords.slice(0, 15).map((keyword, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing Keywords */}
                        {atsDetails.missing_keywords && atsDetails.missing_keywords.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-2 flex items-center gap-1">
                              <FaTimesCircle size={12} />
                              Keywords Missing from Your Resume ({atsDetails.missing_keywords.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                              {atsDetails.missing_keywords.slice(0, 15).map((keyword, idx) => (
                                <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {atsDetails.analysis?.suggestions && atsDetails.analysis.suggestions.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-800 mb-2">💡 Suggestions to Improve Your Score</p>
                            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                              {atsDetails.analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                                <li key={idx}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </PremiumBlurOverlay>
                    </>
                  ) : atsStatus?.status === 'processing' ? (
                    <div className="text-center py-8">
                      <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600">Analyzing your CV against job requirements...</p>
                      <p className="text-xs text-gray-400 mt-2">This may take a few moments</p>
                    </div>
                  ) : atsStatus?.status === 'failed' ? (
                    <div className="text-center py-6">
                      <div className="text-red-500 mb-2">
                        <FaTimesCircle size={32} className="mx-auto" />
                      </div>
                      <p className="text-gray-700">ATS score calculation failed</p>
                      <p className="text-xs text-gray-500 mt-1">This may be due to file format or temporary issues</p>
                      <button
                        onClick={handleRecalculateAts}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mx-auto"
                      >
                        <FaRedoAlt size={12} />
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaHourglassHalf className="text-gray-400 text-3xl mx-auto mb-3" />
                      <p className="text-gray-600">ATS score not yet calculated</p>
                      <p className="text-xs text-gray-400 mt-1">Click the button below to analyze your CV</p>
                      {atsStatus?.can_recalculate !== false && (
                        <button
                          onClick={handleRecalculateAts}
                          className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
                        >
                          Calculate ATS Score
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </InfoSection>

              {/* Status Timeline */}
              {statusTimeline && statusTimeline.length > 0 && (
                <InfoSection title="Application Timeline" icon={FaClock}>
                  <div className="relative">
                    {statusTimeline.map((timeline, idx) => (
                      <div key={idx} className="flex gap-3 mb-4 last:mb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full mt-1 ${timeline.status === 'pending' ? 'bg-yellow-500' :
                            timeline.status === 'shortlisted' ? 'bg-green-500' :
                              timeline.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                          {idx < statusTimeline.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${timeline.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              timeline.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                timeline.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                              }`}>
                              {timeline.status.charAt(0).toUpperCase() + timeline.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400">{formatDateTime(timeline.created_at)}</span>
                          </div>
                          {timeline.notes && (
                            <p className="text-sm text-gray-600">{timeline.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoSection>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Application Info Card */}
              <InfoSection title="Application Info" icon={FaInfoCircle}>
                <dl className="space-y-3">
                  <InfoRow label="Application ID" value={`#${application?.id}`} />
                  <InfoRow label="Submitted On" value={formatDateTime(application?.created_at)} />
                  <InfoRow label="Last Updated" value={formatDateTime(application?.updated_at)} />
                  {application?.employer_notes && (
                    <InfoRow label="Employer Notes" value={application.employer_notes} />
                  )}
                </dl>
              </InfoSection>

              {/* Personal Information */}
              <InfoSection title="Personal Information" icon={FaUser}>
                <dl className="space-y-3">
                  <InfoRow label="Full Name" value={application?.name} />
                  <InfoRow label="Email Address" value={application?.email} isLink={true} />
                  <InfoRow label="Phone Number" value={application?.phone} />
                  {application?.expected_salary && (
                    <InfoRow label="Expected Salary" value={formatCurrency(application.expected_salary)} />
                  )}
                </dl>
              </InfoSection>

              {/* Applicant Profile */}
              {applicantProfile && (
                <InfoSection title="Professional Profile" icon={FaBriefcase}>
                  <dl className="space-y-3">
                    {applicantProfile.first_name && (
                      <InfoRow label="Name" value={`${applicantProfile.first_name} ${applicantProfile.last_name}`} />
                    )}
                    {applicantProfile.current_job_title && (
                      <InfoRow label="Current Position" value={applicantProfile.current_job_title} />
                    )}
                    {applicantProfile.experience_years && (
                      <InfoRow label="Experience" value={`${applicantProfile.experience_years} years`} />
                    )}
                    {applicantProfile.phone && (
                      <InfoRow label="Phone" value={applicantProfile.phone} />
                    )}
                  </dl>
                </InfoSection>
              )}

              {/* Social Links */}
              {(application?.linkedin_link || application?.facebook_link) && (
                <InfoSection title="Social Profiles" icon={FaExternalLinkAlt}>
                  <div className="space-y-2">
                    {application.linkedin_link && (
                      <a
                        href={application.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FaLinkedin size={16} />
                        LinkedIn Profile
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                    {application.facebook_link && (
                      <a
                        href={application.facebook_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm p-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FaFacebook size={16} />
                        Facebook Profile
                        <FaExternalLinkAlt size={12} />
                      </a>
                    )}
                  </div>
                </InfoSection>
              )}

              {/* CV/Resume Card */}
              <InfoSection title="CV / Resume" icon={FaFilePdf}>
                {application?.resume_url ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FaFilePdf className="text-red-500" size={24} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {application.resume_name || 'Resume/CV'}
                        </p>
                        <p className="text-xs text-gray-500">Uploaded on {formatDate(application.created_at)}</p>
                      </div>
                      <button
                        onClick={handleDownloadCV}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="View Resume"
                      >
                        <FaEye size={16} />
                      </button>
                      <a
                        href={application.resume_url}
                        download
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Download"
                      >
                        <FaDownload size={16} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No resume uploaded</p>
                )}
              </InfoSection>

              {/* Upgrade Banner */}
              {!isPremium && (
                <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                      <FaCrown className="text-white text-lg" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-sm">Unlock Full ATS Analysis</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        See all matched/missing keywords, get personalized suggestions, and improve your chances!
                      </p>
                      <button
                        onClick={handleUpgradeToPremium}
                        className="mt-3 w-full py-2 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md"
                      >
                        Upgrade to Premium →
                      </button>
                      <p className="text-[10px] text-gray-400 text-center mt-2">
                        Starts at $9.99/month • Cancel anytime
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips Card */}
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 mt-0.5 shrink-0" size={16} />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Application Status Guide</p>
                    <ul className="list-disc list-inside text-xs space-y-1">
                      <li><span className="font-medium">Pending:</span> Your application is being reviewed</li>
                      <li><span className="font-medium">Shortlisted:</span> You've been selected for next steps</li>
                      <li><span className="font-medium">Rejected:</span> Application not selected this time</li>
                      <li><span className="font-medium">Hired:</span> Congratulations! You got the job</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}