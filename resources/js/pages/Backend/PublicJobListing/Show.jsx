// resources/js/pages/Backend/PublicJobListing/Show.jsx

import { Head, Link } from '@inertiajs/react';
import {
  FaArrowLeft,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBuilding,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaShare,
  FaBookmark,
  FaCheckCircle,
  FaAward,
  FaUsers,
  FaChartLine,
} from 'react-icons/fa';
import { useState } from 'react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function PublicJobShow({ jobListing }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getExperienceLevel = (level) => {
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

  const getEducationLevel = (edu) => {
    const levels = {
      'ssc': 'SSC / Equivalent',
      'hsc': 'HSC / Equivalent',
      'diploma': 'Diploma in Engineering',
      'bachelor': "Bachelor's Degree",
      'masters': "Master's Degree",
      'masters-engineering': "Master's in Engineering",
      'phd': 'PhD / Doctorate',
      'professional': 'Professional Certification',
      'vocational': 'Vocational Training',
      'none': 'No Formal Education Required'
    };
    return levels[edu] || edu || 'Not specified';
  };

  const daysUntilDeadline = () => {
    const today = new Date();
    const deadlineDate = new Date(jobListing.application_deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = daysUntilDeadline();
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(jobListing.title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(jobListing.title)}&url=${encodeURIComponent(window.location.href)}`
  };

  const handleSave = () => {
    setSaved(!saved);
    // Here you would typically make an API call to save the job
  };

  return (
    <AuthenticatedLayout>
      <Head title={jobListing.title} />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 text-black">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={route('backend.public-jobs.index')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft size={16} />
            <span>Back to Jobs</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear -to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-3">{jobListing.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaBuilding size={14} />
                    <span>{jobListing.user?.name || 'Company Name'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt size={14} />
                    <span>{jobListing.location?.name || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt size={14} />
                    <span>Posted: {formatDate(jobListing.created_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  title={saved ? 'Saved' : 'Save job'}
                >
                  <FaBookmark size={18} className={saved ? 'text-yellow-400' : 'text-white'} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    title="Share"
                  >
                    <FaShare size={18} />
                  </button>
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <a
                        href={shareLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaFacebook className="text-blue-600" /> Facebook
                      </a>
                      <a
                        href={shareLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaLinkedin className="text-blue-700" /> LinkedIn
                      </a>
                      <a
                        href={shareLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaTwitter className="text-blue-400" /> Twitter
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Job Type</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getJobTypeBadge(jobListing.job_type)}`}>
                    {jobListing.job_type?.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-medium text-gray-900">{getExperienceLevel(jobListing.experience_level)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Education</span>
                  <span className="font-medium text-gray-900">{getEducationLevel(jobListing.education_requirement)}</span>
                </div>
              </div>
              <div className="space-y-4">
                {jobListing.salary && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Salary</span>
                    <span className="font-medium text-green-600 text-lg">{jobListing.salary}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Application Deadline</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900 block">{formatDate(jobListing.application_deadline)}</span>
                    {!isExpired && (
                      <span className={`text-xs ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                        {isUrgent ? `${daysLeft} days left` : 'Open for applications'}
                      </span>
                    )}
                    {isExpired && (
                      <span className="text-xs text-red-600">Expired</span>
                    )}
                  </div>
                </div>
                {jobListing.schedule_start_date && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Expected Start Date</span>
                    <span className="font-medium text-gray-900">{formatDate(jobListing.schedule_start_date)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            {jobListing.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-blue-600" />
                  Job Description
                </h2>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: jobListing.description }}
                />
              </div>
            )}

            {/* Requirements */}
            {jobListing.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Requirements
                </h2>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: jobListing.requirements }}
                />
              </div>
            )}

            {/* Skills */}
            {jobListing.skills && jobListing.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaAward className="text-purple-600" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {jobListing.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {jobListing.responsibilities && jobListing.responsibilities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-orange-600" />
                  Key Responsibilities
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {jobListing.responsibilities.map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {jobListing.benefits && jobListing.benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-green-600" />
                  Benefits & Perks
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {jobListing.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Button */}
            {!isExpired ? (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  href={route('applications.create', jobListing.id)}
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-semibold"
                >
                  <FaEnvelope size={18} />
                  Apply Now
                </Link>
                <p className="text-sm text-gray-500 mt-3 text-center md:text-left">
                  Don't miss this opportunity! Apply before {formatDate(jobListing.application_deadline)}
                </p>
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-600 font-medium">
                    This position has expired. Please check other opportunities.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}