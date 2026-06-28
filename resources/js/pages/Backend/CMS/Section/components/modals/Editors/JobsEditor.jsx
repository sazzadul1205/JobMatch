/* eslint-disable no-undef */
// resources/js/pages/Backend/CMS/Section/components/modals/Editors/JobsEditor.jsx

import React from 'react';
import { FaExternalLinkAlt, FaBriefcase } from 'react-icons/fa';

/**
 * JobsEditor - Editor for JobsSection data
 * This section displays job listings from the Job Listings Manager
 * Features:
 * - Shows information about the section
 * - Provides link to Job Listings Manager for editing
 * - Displays preview of job listings data
 * - Not editable directly (read-only)
 */
const JobsEditor = ({ section, hasData }) => {
  // ===== DATA EXTRACTION =====
  // This is controlled by the Job Listings Manager
  // No form fields needed - just informational display

  // Get the job listings data from section
  const data = section?.data || {};
  const jobs = data?.jobs || [];

  // Check if we have jobs data from the main data object
  const hasJobsData = hasData && jobs.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Jobs Section</h3>

      {/* ===== INFO BOX: JOB LISTINGS ===== */}
      {/* Explains that this section is managed by the Job Listings Manager */}
      <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
              <FaBriefcase size={20} />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-800">Job Listings Section</h4>
            <p className="text-sm text-purple-700 mt-1">
              This section displays job listings from the <strong>Job Listings Manager</strong>.
              It automatically shows all active job openings.
            </p>
            <p className="text-xs text-purple-600 mt-1">
              To add, edit, or remove job listings, please go to the Job Listings Manager.
              Changes made there will automatically reflect here.
            </p>
          </div>
        </div>
      </div>

      {/* ===== JOB COUNT AND PREVIEW ===== */}
      {/* Shows how many jobs are available and previews the first few */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Current Job Listings</h4>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
          {hasJobsData ? (
            <div className="space-y-2">
              {/* Job count */}
              <p className="text-xs text-gray-500">
                <span className="font-medium">{jobs.length}</span> job
                {jobs.length > 1 ? 's' : ''} available
              </p>
              {/* Job tags - show first 3 */}
              <div className="flex flex-wrap gap-1">
                {jobs.slice(0, 3).map((job, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded border border-gray-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {job.title || `Job ${idx + 1}`}
                  </span>
                ))}
                {/* Show "+N more" if more than 3 jobs */}
                {jobs.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{jobs.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Empty state - no jobs
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">No job listings available</p>
              <p className="text-xs text-gray-400 mt-1">
                Add job listings in the Job Listings Manager
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== SECTION SETTINGS ===== */}
      {/* Shows configuration details for this section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-600 mb-2">Section Settings</h4>
        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Data Table */}
          <div>
            <span className="text-xs text-gray-500">Data Table</span>
            <p className="text-sm font-medium text-gray-700">jobs</p>
          </div>
          {/* Data Key */}
          <div>
            <span className="text-xs text-gray-500">Data Key</span>
            <p className="text-sm font-medium text-gray-700">{section.data_key || 'jobsData'}</p>
          </div>
          {/* Component */}
          <div>
            <span className="text-xs text-gray-500">Component</span>
            <p className="text-sm font-medium text-gray-700">JobsSection</p>
          </div>
          {/* Status - has jobs or not */}
          <div>
            <span className="text-xs text-gray-500">Status</span>
            <p className={`text-sm font-medium ${hasJobsData ? 'text-green-600' : 'text-gray-400'}`}>
              {hasJobsData ? '✅ Has Jobs' : 'No Jobs'}
            </p>
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      {/* Shows statistics about jobs (total, active, featured) */}
      {hasJobsData && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Stats</h4>
          <div className="grid grid-cols-3 gap-2">
            {/* Total jobs */}
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Total</span>
              <p className="text-lg font-bold text-blue-600">{jobs.length}</p>
            </div>
            {/* Active jobs */}
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Active</span>
              <p className="text-lg font-bold text-green-600">
                {jobs.filter(j => j.is_active !== false).length}
              </p>
            </div>
            {/* Featured jobs */}
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <span className="text-xs text-gray-500">Featured</span>
              <p className="text-lg font-bold text-purple-600">
                {jobs.filter(j => j.is_featured).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== ACTION BUTTON ===== */}
      {/* Navigates user to the Job Listings Manager where they can edit */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            window.location.href = route('backend.listing.index');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
        >
          <FaExternalLinkAlt size={14} />
          Go to Job Listings Manager
        </button>
      </div>

      {/* ===== FOOTER NOTE ===== */}
      {/* Reminder that this section is read-only and where to make changes */}
      <div className="mt-3 text-xs text-gray-400 border-t border-gray-200 pt-3">
        <p>
          💡 <strong>Note:</strong> This section is controlled by the Job Listings Manager.
          You cannot edit job listings directly here.
        </p>
        <p className="mt-1">
          📍 To manage jobs, navigate to <strong>Job Listings Manager</strong> in the sidebar.
          All changes made there will automatically appear in this section.
        </p>
      </div>
    </div>
  );
};

export default JobsEditor;