// resources/js/Pages/Public/JobListings/Show.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import {
  FaArrowLeft,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaBuilding,
  FaGraduationCap,
  FaCheckCircle,
  FaEye,
  FaUsers,
  FaShare,
  FaBookmark,
  FaPrint,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaExternalLinkAlt,
  FaStar,
  FaChartLine,
  FaRocket,
  FaInfoCircle,
} from 'react-icons/fa';
import { FaListUl, FaListCheck } from "react-icons/fa6";


// SweetAlert
import Swal from 'sweetalert2';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function PublicJobListingShow({
  jobListing,
  userData,
  hasApplied,
  relatedJobs,
  applicationStats,
  averageAtsScore,
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Format currency in BDT
  const formatCurrency = (amount) => {
    if (!amount) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('BDT', '৳');
  };

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

  const getDaysLeft = (deadline) => {
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
  };

  const getDeadlineColor = () => {
    const daysLeft = Math.ceil((new Date(jobListing.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return 'text-red-600 bg-red-50 border-red-200';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
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

  const getJobTypeBadge = (type) => {
    const types = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-yellow-100 text-yellow-800',
      'contract': 'bg-blue-100 text-blue-800',
      'internship': 'bg-purple-100 text-purple-800',
      'remote': 'bg-indigo-100 text-indigo-800',
      'hybrid': 'bg-pink-100 text-pink-800',
    };
    return types[type] || 'bg-gray-100 text-gray-800';
  };

  const getExperienceLabel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'junior': 'Junior',
      'mid-level': 'Mid Level',
      'senior': 'Senior',
      'lead': 'Lead',
      'executive': 'Executive',
    };
    return levels[level] || level;
  };

  const getSalaryDisplay = () => {
    if (jobListing.as_per_companies_policy) {
      return 'As per company policy';
    }
    if (jobListing.is_salary_negotiable) {
      return 'Negotiable';
    }
    if (jobListing.salary_min && jobListing.salary_max) {
      return `${formatCurrency(jobListing.salary_min)} - ${formatCurrency(jobListing.salary_max)}`;
    }
    if (jobListing.salary_min) {
      return `From ${formatCurrency(jobListing.salary_min)}`;
    }
    if (jobListing.salary_max) {
      return `Up to ${formatCurrency(jobListing.salary_max)}`;
    }
    return 'Not specified';
  };

  const getFormattedSalaryRange = () => {
    if (jobListing.as_per_companies_policy) {
      return 'As per company policy';
    }
    if (jobListing.is_salary_negotiable) {
      return 'Negotiable';
    }
    if (jobListing.salary_min && jobListing.salary_max) {
      return `${formatCurrency(jobListing.salary_min)} - ${formatCurrency(jobListing.salary_max)}`;
    }
    if (jobListing.salary_min) {
      return `From ${formatCurrency(jobListing.salary_min)}`;
    }
    if (jobListing.salary_max) {
      return `Up to ${formatCurrency(jobListing.salary_max)}`;
    }
    return 'Not specified';
  };

  const getAtsScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleApply = () => {
    if (!userData) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login or create an account to apply for this job.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(route('login'));
        }
      });
      return;
    }

    router.visit(route('backend.apply.create', jobListing.slug));
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    Swal.fire({
      icon: 'success',
      title: 'Link Copied!',
      text: 'Job link has been copied to clipboard.',
      timer: 2000,
      showConfirmButton: false,
    });
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Swal.fire({
      icon: 'success',
      title: isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks',
      text: isBookmarked ? 'Job removed from your bookmarks.' : 'Job saved to your bookmarks.',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const InfoSection = ({ title, icon: Icon, children, badge }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="text-blue-600" size={18} />
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>
        {badge && badge}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, isHtml = false }) => (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-gray-900">
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: value }} className="prose prose-sm max-w-none" />
        ) : (
          value || <span className="text-gray-400 italic">Not provided</span>
        )}
      </dd>
    </div>
  );

  const TagList = ({ items, color = 'blue' }) => (
    <div className="flex flex-wrap gap-2">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <span
            key={index}
            className={`inline-flex px-3 py-1 text-sm font-medium rounded-full bg-${color}-100 text-${color}-800`}
          >
            {item}
          </span>
        ))
      ) : (
        <span className="text-gray-400 italic text-sm">None provided</span>
      )}
    </div>
  );

  const StatCard = ({ title, value, color, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md p-4 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-${color}-100 mb-2`}>
        <Icon className={`text-${color}-600`} size={18} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      <p className="text-xs text-gray-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  const deadlineColor = getDeadlineColor();
  const isExpired = new Date(jobListing.application_deadline) < new Date();

  return (
    <AuthenticatedLayout>
      <Head title={`${jobListing.title} - Job Details`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-8">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
              <span className="text-sm">Back to Jobs</span>
            </button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold">{jobListing.title}</h1>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getJobTypeBadge(jobListing.job_type)}`}>
                    {getJobTypeLabel(jobListing.job_type)}
                  </span>
                  {jobListing.experience_level && (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                      {getExperienceLabel(jobListing.experience_level)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <FaBuilding size={14} />
                    <span>{jobListing.employer?.name || 'Company'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt size={14} />
                    <span>
                      {jobListing.locations?.length > 0
                        ? jobListing.locations.map(l => l.name).join(', ')
                        : 'Location not specified'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign size={14} />
                    <span className="font-medium">{getSalaryDisplay()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleBookmark}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                  title="Bookmark"
                >
                  <FaBookmark className={isBookmarked ? 'text-yellow-400' : 'text-white'} size={18} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                    title="Share"
                  >
                    <FaShare size={18} />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <button
                        onClick={handleShare}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-t-lg"
                      >
                        <FaExternalLinkAlt size={14} />
                        Copy Link
                      </button>
                      <button
                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                      >
                        <FaFacebook size={14} className="text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`)}
                        className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-b-lg"
                      >
                        <FaLinkedin size={14} className="text-blue-700" />
                        LinkedIn
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handlePrint}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                  title="Print"
                >
                  <FaPrint size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Deadline Alert */}
              {!isExpired && (
                <div className={`rounded-xl border-2 p-4 flex items-center justify-between ${deadlineColor}`}>
                  <div className="flex items-center gap-3">
                    <FaClock size={20} />
                    <div>
                      <p className="font-semibold">Application Deadline</p>
                      <p className="text-sm">{formatDate(jobListing.application_deadline)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{getDaysLeft(jobListing.application_deadline)}</span>
                  </div>
                </div>
              )}

              {/* Apply Button */}
              {!isExpired && !hasApplied && (
                <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="font-semibold text-green-800">Ready to apply?</h3>
                      <p className="text-sm text-green-600">Submit your application before the deadline</p>
                    </div>
                    <button
                      onClick={handleApply}
                      className="px-6 py-2 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition shadow-md font-medium"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              )}

              {hasApplied && (
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-blue-600" size={24} />
                    <div>
                      <p className="font-semibold text-blue-800">You have already applied for this position</p>
                      <p className="text-sm text-blue-600">Your application is being reviewed by the employer</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Description */}
              <InfoSection title="Job Description" icon={FaBriefcase}>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: jobListing.description }} />
              </InfoSection>

              {/* Requirements */}
              <InfoSection title="Requirements & Qualifications" icon={FaListCheck}>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: jobListing.requirements }} />
              </InfoSection>

              {/* Responsibilities */}
              {jobListing.responsibilities?.length > 0 && (
                <InfoSection title="Key Responsibilities" icon={FaListUl}>
                  <ul className="space-y-2">
                    {jobListing.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </InfoSection>
              )}

              {/* Benefits */}
              {jobListing.benefits?.length > 0 && (
                <InfoSection title="Benefits & Perks" icon={FaCheckCircle}>
                  <TagList items={jobListing.benefits} color="green" />
                </InfoSection>
              )}

              {/* Skills */}
              {jobListing.skills?.length > 0 && (
                <InfoSection title="Required Skills" icon={FaStar}>
                  <TagList items={jobListing.skills} color="blue" />
                </InfoSection>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard title="Total Views" value={jobListing.views_count?.toLocaleString() || 0} color="blue" icon={FaEye} />
                <StatCard title="Total Applications" value={applicationStats.total || 0} color="purple" icon={FaUsers} />
                <StatCard title="Average ATS Score" value={averageAtsScore ? `${averageAtsScore}%` : 'N/A'} color="indigo" icon={FaChartLine} />
                <StatCard title="Posted" value={formatDate(jobListing.created_at)} color="gray" icon={FaCalendarAlt} subtitle="Date posted" />
              </div>

              {/* Basic Info Card */}
              <InfoSection title="Job Information" icon={FaInfoCircle}>
                <dl className="space-y-3">
                  <InfoRow label="Job Type" value={getJobTypeLabel(jobListing.job_type)} />
                  <InfoRow label="Experience Level" value={getExperienceLabel(jobListing.experience_level)} />
                  <InfoRow label="Category" value={jobListing.category?.name || 'N/A'} />
                  <InfoRow label="Salary" value={getFormattedSalaryRange()} />
                </dl>
              </InfoSection>

              {/* Location Card */}
              <InfoSection title="Job Location" icon={FaMapMarkerAlt}>
                {jobListing.locations?.length > 0 ? (
                  <div className="space-y-3">
                    {jobListing.locations.map((location, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" size={14} />
                        <div>
                          <p className="text-gray-900 font-medium">{location.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Location not specified</p>
                )}
              </InfoSection>

              {/* Dates Card */}
              <InfoSection title="Important Dates" icon={FaCalendarAlt}>
                <dl className="space-y-3">
                  <InfoRow
                    label="Application Deadline"
                    value={
                      <div className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                        <FaCalendarAlt size={14} />
                        <span className="font-medium">{formatDate(jobListing.application_deadline)}</span>
                        {isExpired && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Expired</span>
                        )}
                      </div>
                    }
                  />
                  <InfoRow label="Posted On" value={formatDate(jobListing.created_at)} />
                  {jobListing.publish_at && (
                    <InfoRow label="Published On" value={formatDate(jobListing.publish_at)} />
                  )}
                </dl>
              </InfoSection>

              {/* Education Card */}
              {(jobListing.education_requirement || jobListing.education_details) && (
                <InfoSection title="Education Requirements" icon={FaGraduationCap}>
                  {jobListing.education_requirement && (
                    <p className="text-gray-900 font-medium mb-2">{jobListing.education_requirement}</p>
                  )}
                  {jobListing.education_details && (
                    <p className="text-sm text-gray-500">{jobListing.education_details}</p>
                  )}
                </InfoSection>
              )}

              {/* Employer Info Card */}
              {jobListing.employer && (
                <InfoSection title="About the Employer" icon={FaBuilding}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-gray-400" size={14} />
                      <span className="text-gray-900 font-medium">{jobListing.employer.name}</span>
                    </div>
                    {jobListing.employer.email && (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" size={14} />
                        <a href={`mailto:${jobListing.employer.email}`} className="text-blue-600 hover:underline text-sm">
                          {jobListing.employer.email}
                        </a>
                      </div>
                    )}
                  </div>
                </InfoSection>
              )}
            </div>
          </div>

          {/* Related Jobs Section */}
          {relatedJobs && relatedJobs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaRocket className="text-blue-600" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Similar Jobs You Might Like</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedJobs.map((job) => (
                  <a
                    key={job.id}
                    href={route('public.job-listings.show', job.slug)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition mb-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <FaMapMarkerAlt size={12} />
                      <span>{job.locations?.length > 0 ? job.locations[0].name : 'Location N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeBadge(job.job_type)}`}>
                        {getJobTypeLabel(job.job_type)}
                      </span>
                      <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          <FaEye size={10} />
                          {job.views_count || 0}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <FaUsers size={10} />
                          {job.applications_count || 0}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          .bg-linear-to-r, .bg-blue-50, .bg-green-50, button, a {
            background: white !important;
            color: black !important;
          }
          .shadow-md, .shadow-lg {
            box-shadow: none !important;
          }
          button, .p-2, .bg-white\\/10 {
            display: none !important;
          }
        }
        
        .prose {
          max-width: none;
          color: #374151;
        }
        
        .prose p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        
        .prose ul, .prose ol {
          margin-top: 0.5rem;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.25rem;
        }
        
        .prose h1, .prose h2, .prose h3 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}