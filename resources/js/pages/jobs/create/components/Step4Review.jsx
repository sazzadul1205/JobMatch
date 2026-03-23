// pages/jobs/create/components/Step4Review.jsx

import { FiCheck, FiInfo } from 'react-icons/fi';

const Step4Review = ({ data, jobTypes, categories, experienceLevels, keywordList, benefitsList }) => {
  return (
    <div className="space-y-6 text-black">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiCheck className="mr-2 text-indigo-600" size={20} />
          Review Your Job Listing
        </h2>

        <div className="space-y-6">
          {/* Basic Info Review */}
          <div className="border-b pb-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-medium">{data.title || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Job Type</p>
                <p className="font-medium">{jobTypes[data.job_type] || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{categories[data.category] || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience Level</p>
                <p className="font-medium">{experienceLevels[data.experience_level] || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{data.location || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="font-medium">{data.salary_range || 'Not provided'}</p>
              </div>
              {data.remote_policy && (
                <div>
                  <p className="text-sm text-gray-500">Remote Policy</p>
                  <p className="font-medium capitalize">{data.remote_policy.replace('_', ' ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Job Details Review */}
          <div className="border-b pb-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Job Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-sm mt-1">{data.description || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requirements</p>
                <p className="text-sm mt-1">{data.requirements || 'Not provided'}</p>
              </div>
              {keywordList.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Keywords/Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {keywordList.map((keyword, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {benefitsList.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Benefits</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {benefitsList.map((benefit, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.work_hours && (
                <div>
                  <p className="text-sm text-gray-500">Work Hours</p>
                  <p className="font-medium">{data.work_hours}</p>
                </div>
              )}
            </div>
          </div>

          {/* Application Settings Review */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-3">Application Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Application Deadline</p>
                <p className="font-medium">{data.application_deadline || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${data.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {data.is_active ? 'Active' : 'Draft'}
                </p>
              </div>
              {data.contact_email && (
                <div>
                  <p className="text-sm text-gray-500">Contact Email</p>
                  <p className="font-medium">{data.contact_email}</p>
                </div>
              )}
              {data.contact_phone && (
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-medium">{data.contact_phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Warning for draft */}
          {!data.is_active && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
              <FiInfo className="text-yellow-600 mr-2 mt-0.5" size={18} />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">This job will be saved as a draft</p>
                <p>It will not be visible to job seekers until you activate it.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4Review;