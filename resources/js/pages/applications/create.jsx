// pages/applications/create.jsx

import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiAward,
  FiTag
} from 'react-icons/fi';

const ApplicationForm = ({ job, hasApplied }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState('');

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    resume: null,
  });

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setResumeError('Please upload a PDF ');
        setResumeFile(null);
        setData('resume', null);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError('File size must be less than 5MB');
        setResumeFile(null);
        setData('resume', null);
        return;
      }

      setResumeError('');
      setResumeFile(file);
      setData('resume', file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('applications.store', job.id), {
      preserveScroll: true,
      onSuccess: () => {
        // Reset form on success
        setResumeFile(null);
      }
    });
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!job.application_deadline) return false;
    return new Date(job.application_deadline) < new Date();
  };

  const deadlinePassed = isDeadlinePassed();

  // If already applied, show message
  if (hasApplied) {
    return (
      <AuthenticatedLayout>
        <Head title="Already Applied" />

        <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Already Submitted</h1>
            <p className="text-gray-600 mb-6">
              You have already applied for this position. Your application is being reviewed.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href={route('backend.listing.show', job.id)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Job Details
              </Link>
              <Link
                href={route('backend.application.index')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                View My Applications
              </Link>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // If job is not accepting applications
  if (deadlinePassed || !job.is_active) {
    return (
      <AuthenticatedLayout>
        <Head title="Application Closed" />

        <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FiAlertCircle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Closed</h1>
            <p className="text-gray-600 mb-6">
              {deadlinePassed
                ? `The application deadline for this position was ${formatDate(job.application_deadline)}.`
                : 'This position is no longer accepting applications.'}
            </p>
            <Link
              href={route('backend.listing.show', job.id)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Back to Job Details
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Apply for ${job.title}`} />

      <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={route('backend.listing.show', job.id)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Job Details
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-gray-400" size={14} />
                    <span>{job.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-400" size={14} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiAward className="text-gray-400" size={14} />
                    <span>{job.experience_level}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-gray-400" size={14} />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FiClock className="text-gray-400" size={14} />
                    <span>Deadline: {formatDate(job.application_deadline)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">Job Requirements</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="line-clamp-4">{job.requirements}</p>
                </div>

                {job.keywords && job.keywords.length > 0 && (
                  <>
                    <h3 className="font-medium text-gray-900 mt-4 mb-2">Key Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.keywords.slice(0, 5).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                      {job.keywords.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{job.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">Apply for this Position</h1>
                <p className="text-gray-600 mt-1">Please fill out the form below to submit your application</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV <span className="text-red-500">*</span>
                  </label>
                  <div className={`border-2 border-dashed ${resumeError || errors.resume ? 'border-red-300' : 'border-gray-300'} rounded-lg p-6 text-center hover:border-indigo-500 transition`}>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="cursor-pointer block"
                    >
                      <FiUpload className="mx-auto text-gray-400 mb-2" size={32} />
                      {resumeFile ? (
                        <>
                          <FiFileText className="mx-auto text-indigo-600 mb-2" size={32} />
                          <p className="text-sm font-medium text-indigo-600">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-gray-400 mt-2">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">
                            PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  {(resumeError || errors.resume) && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <FiAlertCircle size={14} />
                      {resumeError || errors.resume}
                    </p>
                  )}
                </div>

                {/* Form Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <FiCheckCircle size={16} />
                    Application Tips
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Make sure your resume is up to date and highlights relevant experience</li>
                    <li>Tailor your resume to match the job requirements</li>
                    <li>Double-check your contact information for accuracy</li>
                    <li>Your application will be processed through our ATS system</li>
                  </ul>
                </div>

                {/* Privacy Notice */}
                <div className="text-xs text-gray-500">
                  <p>
                    By submitting this application, you agree to our privacy policy and consent to the processing of your personal data.
                    Your information will be used solely for recruitment purposes.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Link
                    href={route('backend.listing.show', job.id)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={18} />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ApplicationForm;