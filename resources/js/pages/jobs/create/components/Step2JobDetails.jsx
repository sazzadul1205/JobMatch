// pages/jobs/create/components/Step2JobDetails.jsx

import { FiFileText, FiUsers, FiPlus, FiX } from 'react-icons/fi';

const Step2JobDetails = ({
  data,
  setData,
  errors,
  keywordList,
  benefitsList,
  addKeyword,
  removeKeyword,
  addBenefit,
  removeBenefit,
  handleKeywordKeyPress,
  handleBenefitKeyPress
}) => {
  return (
    <div className="space-y-6 text-black">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiFileText className="mr-2 text-indigo-600" size={20} />
          Job Description & Requirements
        </h2>
        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              rows={6}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Describe the role, responsibilities, and what the job entails..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.requirements}
              onChange={e => setData('requirements', e.target.value)}
              rows={6}
              className={`w-full border ${errors.requirements ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="List the requirements, qualifications, and skills needed..."
            />
            {errors.requirements && (
              <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords / Skills
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.keywordInput}
                onChange={e => setData('keywordInput', e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., React, Python, Project Management"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                <FiPlus size={18} />
              </button>
            </div>
            {keywordList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {keywordList.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 hover:text-indigo-900"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiUsers className="inline mr-1" size={14} />
              Benefits & Perks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.benefitInput}
                onChange={e => setData('benefitInput', e.target.value)}
                onKeyPress={handleBenefitKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Health Insurance, Remote Work, 401k"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                <FiPlus size={18} />
              </button>
            </div>
            {benefitsList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {benefitsList.map((benefit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => removeBenefit(benefit)}
                      className="ml-2 hover:text-green-900"
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Work Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Hours
            </label>
            <input
              type="text"
              value={data.work_hours}
              onChange={e => setData('work_hours', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Monday - Friday, 9 AM - 5 PM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2JobDetails;