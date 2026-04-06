// resources/js/pages/Backend/JobListings/Show.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaUsers,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaUser,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaLinkedin,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaInfoCircle,
  FaChartLine,
  FaStar,
} from 'react-icons/fa';
import { FaListCheck } from "react-icons/fa6";

// SweetAlert
import Swal from 'sweetalert2';

export default function Show({ jobListing, applicationStats, averageAtsScore, totalViews, recentApplications }) {
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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
      'internship': 'bg-orange-100 text-orange-800',
      'remote': 'bg-indigo-100 text-indigo-800',
      'hybrid': 'bg-purple-100 text-purple-800',
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

  const getExperienceBadge = (level) => {
    const levels = {
      'entry': 'bg-blue-100 text-blue-800',
      'junior': 'bg-cyan-100 text-cyan-800',
      'mid-level': 'bg-teal-100 text-teal-800',
      'senior': 'bg-purple-100 text-purple-800',
      'lead': 'bg-orange-100 text-orange-800',
      'executive': 'bg-red-100 text-red-800',
    };
    return levels[level] || 'bg-gray-100 text-gray-800';
  };

  const getSalaryDisplay = () => {
    if (jobListing.as_per_companies_policy) {
      return 'As per company policy';
    }
    if (jobListing.is_salary_negotiable) {
      return 'Negotiable';
    }
    if (jobListing.salary_min && jobListing.salary_max) {
      return `${jobListing.salary_min.toLocaleString()} - ${jobListing.salary_max.toLocaleString()} BDT`;
    }
    if (jobListing.salary_min) {
      return `From ${jobListing.salary_min.toLocaleString()} BDT`;
    }
    return 'Not specified';
  };

  const getStatusBadge = () => {
    const isExpired = jobListing.application_deadline && new Date(jobListing.application_deadline) < new Date();

    if (jobListing.deleted_at) {
      return { text: 'Deleted', color: 'bg-gray-100 text-gray-600', icon: <FaTimesCircle size={14} /> };
    }
    if (!jobListing.is_active) {
      return { text: 'Inactive', color: 'bg-red-100 text-red-800', icon: <FaTimesCircle size={14} /> };
    }
    if (isExpired) {
      return { text: 'Expired', color: 'bg-orange-100 text-orange-800', icon: <FaHourglassHalf size={14} /> };
    }
    return { text: 'Active', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle size={14} /> };
  };

  const getAtsScoreColor = (score) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const status = getStatusBadge();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.visit(route('backend.listing.index'));
    }
  };

  const handleToggle = () => {
    Swal.fire({
      title: 'Change status?',
      text: `This will ${jobListing.is_active ? 'deactivate' : 'activate'} this job listing.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        setTogglingId(jobListing.id);

        router.patch(route('backend.listing.toggle-active', jobListing.id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            router.reload();
            Swal.fire({
              icon: 'success',
              title: 'Status Updated!',
              text: `Job listing has been ${!jobListing.is_active ? 'activated' : 'deactivated'}.`,
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: error?.response?.data?.message || 'Failed to update job status.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setTogglingId(null),
        });
      }
    });
  };

  const handleDelete = () => {
    const applicationsCount = jobListing.applications_count || 0;

    if (applicationsCount > 0) {
      Swal.fire({
        title: 'Cannot Delete',
        text: `This job has ${applicationsCount} application(s). Please deactivate it instead.`,
        icon: 'warning',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    Swal.fire({
      title: 'Delete job listing?',
      text: 'This will move it to trash. This action can be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(jobListing.id);

        router.delete(route('backend.listing.destroy', jobListing.id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Job listing has been moved to trash.',
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.listing.index'));
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: errors?.message || 'Failed to delete job listing.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
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
    <div className="bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100 mb-3`}>
        <Icon className={`text-${color}-600`} size={24} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <AuthenticatedLayout>
      <Head title={`Job Details: ${jobListing.title}`} />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" size={14} />
                <span className="text-sm font-medium">Back to Listings</span>
              </button>

              <div className="flex gap-2">
                {!jobListing.deleted_at && (
                  <>
                    <a
                      href={route('backend.listing.edit', jobListing.id)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <FaEdit size={12} />
                      Edit Job
                    </a>
                    <button
                      onClick={handleToggle}
                      disabled={togglingId === jobListing.id}
                      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm ${jobListing.is_active
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } ${togglingId === jobListing.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {togglingId === jobListing.id ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : jobListing.is_active ? (
                        <FaToggleOff size={14} />
                      ) : (
                        <FaToggleOn size={14} />
                      )}
                      {jobListing.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deletingId === jobListing.id}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                    >
                      {deletingId === jobListing.id ? (
                        <FaSpinner className="animate-spin" size={12} />
                      ) : (
                        <FaTrash size={12} />
                      )}
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {jobListing.title}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.icon}
                  {status.text}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Posted by {jobListing.employer?.name || 'Unknown Employer'} • {formatDateTime(jobListing.created_at)}
              </p>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <StatCard title="Total Applications" value={applicationStats.total} color="blue" icon={FaUsers} />
            <StatCard title="Pending" value={applicationStats.pending} color="yellow" icon={FaHourglassHalf} />
            <StatCard title="Shortlisted" value={applicationStats.shortlisted} color="green" icon={FaCheckCircle} />
            <StatCard title="Rejected" value={applicationStats.rejected} color="red" icon={FaTimesCircle} />
            <StatCard title="Hired" value={applicationStats.hired} color="purple" icon={FaBriefcase} />
            <StatCard
              title="Average ATS Score"
              value={averageAtsScore ? `${averageAtsScore}%` : 'N/A'}
              color="indigo"
              icon={FaChartLine}
              subtitle={averageAtsScore ? `Based on ${applicationStats.total} applications` : 'No ATS data yet'}
            />
          </div>

          {/* Views Card - Special */}
          <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-6 overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FaEye size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Views</p>
                  <p className="text-2xl font-bold">{totalViews || 0}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Last 30 days</p>
                <p className="text-sm font-medium">Unique visitors tracked</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <InfoSection title="Job Description" icon={FaBriefcase}>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: jobListing.description }} />
              </InfoSection>

              {/* Requirements */}
              <InfoSection title="Requirements & Qualifications" icon={FaListCheck}>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: jobListing.requirements }} />
              </InfoSection>

              {/* Responsibilities */}
              {jobListing.responsibilities?.length > 0 && (
                <InfoSection title="Key Responsibilities" icon={FaListCheck}>
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
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Basic Info Card */}
              <InfoSection title="Basic Information" icon={FaInfoCircle}>
                <dl className="space-y-3">
                  <InfoRow label="Job Type" value={
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getJobTypeBadge(jobListing.job_type)}`}>
                      {getJobTypeLabel(jobListing.job_type)}
                    </span>
                  } />
                  <InfoRow label="Experience Level" value={
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getExperienceBadge(jobListing.experience_level)}`}>
                      {getExperienceLabel(jobListing.experience_level)}
                    </span>
                  } />
                  <InfoRow label="Category" value={jobListing.category?.name || 'N/A'} />
                  <InfoRow label="Salary" value={getSalaryDisplay()} />
                </dl>
              </InfoSection>

              {/* Location Card */}
              <InfoSection title="Location(s)" icon={FaMapMarkerAlt}>
                {jobListing.locations?.length > 0 ? (
                  <div className="space-y-3">
                    {jobListing.locations.map((location, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-gray-400 mt-0.5 shrink-0" size={14} />
                        <div>
                          <p className="text-gray-900 font-medium">{location.name}</p>
                          {location.address && <p className="text-sm text-gray-500">{location.address}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No location specified</p>
                )}
              </InfoSection>

              {/* Dates Card */}
              <InfoSection title="Dates & Deadlines" icon={FaCalendarAlt}>
                <dl className="space-y-3">
                  <InfoRow
                    label="Application Deadline"
                    value={
                      <div className={`flex items-center gap-2 ${new Date(jobListing.application_deadline) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                        <FaCalendarAlt size={14} />
                        <span className="font-medium">{formatDate(jobListing.application_deadline)}</span>
                        {new Date(jobListing.application_deadline) < new Date() && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Passed</span>
                        )}
                      </div>
                    }
                  />
                  <InfoRow
                    label="Publish Date"
                    value={
                      jobListing.publish_at ? (
                        <div className="flex items-center gap-2">
                          <FaClock className="text-blue-500" size={14} />
                          <span>{formatDate(jobListing.publish_at)}</span>
                        </div>
                      ) : 'Immediately'
                    }
                  />
                  <InfoRow label="Created At" value={formatDateTime(jobListing.created_at)} />
                  <InfoRow label="Last Updated" value={formatDateTime(jobListing.updated_at)} />
                </dl>
              </InfoSection>

              {/* Skills Card */}
              {jobListing.skills?.length > 0 && (
                <InfoSection title="Required Skills" icon={FaListCheck}>
                  <TagList items={jobListing.skills} color="blue" />
                </InfoSection>
              )}

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

              {/* Keywords Card */}
              {jobListing.keywords?.length > 0 && (
                <InfoSection title="ATS Keywords" icon={FaStar}>
                  <TagList items={jobListing.keywords} color="purple" />
                </InfoSection>
              )}

              {/* Social Requirements */}
              {(jobListing.required_linkedin_link || jobListing.required_facebook_link) && (
                <InfoSection title="Social Requirements" icon={FaGlobe}>
                  <div className="space-y-2">
                    {jobListing.required_linkedin_link && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <FaLinkedin className="text-blue-700" size={18} />
                        <span className="text-sm text-gray-700">Requires LinkedIn profile</span>
                      </div>
                    )}
                    {jobListing.required_facebook_link && (
                      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <FaFacebook className="text-blue-600" size={18} />
                        <span className="text-sm text-gray-700">Requires Facebook profile</span>
                      </div>
                    )}
                  </div>
                </InfoSection>
              )}

              {/* External Apply Links */}
              {jobListing.is_external_apply && jobListing.external_apply_links?.length > 0 && (
                <InfoSection title="External Application Links" icon={FaExternalLinkAlt}>
                  <div className="space-y-2">
                    {jobListing.external_apply_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm break-all p-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FaExternalLinkAlt size={12} />
                        {link}
                      </a>
                    ))}
                  </div>
                </InfoSection>
              )}

              {/* Employer Info */}
              {jobListing.employer && (
                <InfoSection title="Posted By" icon={FaUser}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" size={14} />
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

          {/* Recent Applications Section */}
          {!jobListing.deleted_at && recentApplications && recentApplications.length > 0 && (
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-purple-600" size={18} />
                    <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  </div>
                  <a
                    href={route('backend.listing.applications', jobListing.id)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                  >
                    View All ({applicationStats.total})
                    <FaArrowLeft className="rotate-180" size={12} />
                  </a>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ATS Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentApplications.map((app, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{app.name}</p>
                              <p className="text-sm text-gray-500">{app.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-purple-100 text-purple-800'
                              }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {app.ats_score ? (
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${app.ats_score >= 80 ? 'bg-green-500' :
                                        app.ats_score >= 60 ? 'bg-blue-500' :
                                          app.ats_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                    style={{ width: `${app.ats_score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{app.ats_score}%</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Pending</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(app.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View All Applications Button */}
          {!jobListing.deleted_at && applicationStats.total > 0 && (
            <div className="mt-6 text-center">
              <a
                href={route('backend.listing.applications', jobListing.id)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FaUsers size={16} />
                View All Applications ({applicationStats.total})
                <FaArrowLeft className="rotate-180" size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}