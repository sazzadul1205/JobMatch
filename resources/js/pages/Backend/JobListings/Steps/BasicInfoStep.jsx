// resources/js/pages/Backend/JobListings/Steps/BasicInfoStep.jsx

import { FaInfoCircle } from 'react-icons/fa';

export default function BasicInfoStep({ formData, setFormData, errors, categories, locations }) {
  const formatNumber = (value) => {
    if (!value) return '';
    const num = value.toString().replace(/,/g, '').replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getRawNumber = (value) => {
    return value.replace(/,/g, '').replace(/\D/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

      {/* Job Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="e.g., Senior Software Engineer"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 5 characters. Be specific and descriptive.
        </p>
      </div>

      {/* Category & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Category</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.location_id ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Location</option>
            {locations?.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
          {errors.location_id && (
            <p className="mt-1 text-sm text-red-500">{errors.location_id}</p>
          )}
        </div>
      </div>

      {/* Job Type & Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.job_type ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Job Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
          {errors.job_type && (
            <p className="mt-1 text-sm text-red-500">{errors.job_type}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.experience_level ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">Select Experience Level</option>
            <option value="intern">Intern (0-6 months)</option>
            <option value="entry">Entry Level (0-1 years)</option>
            <option value="junior">Junior (1-3 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior (5-8 years)</option>
            <option value="lead">Lead (8-10 years)</option>
            <option value="executive">Executive (10+ years)</option>
          </select>
          {errors.experience_level && (
            <p className="mt-1 text-sm text-red-500">{errors.experience_level}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Select the minimum years of experience required for this position.
          </p>
        </div>
      </div>

      {/* Salary */}
      {/* Salary */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="single"
                checked={formData.salaryMode === 'single'}
                onChange={() => setFormData({ ...formData, salaryMode: 'single' })}
                className="w-4 h-4"
              />
              Single Amount
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="range"
                checked={formData.salaryMode === 'range'}
                onChange={() => setFormData({ ...formData, salaryMode: 'range' })}
                className="w-4 h-4"
              />
              Salary Range
            </label>
          </div>
        </div>

        {formData.salaryMode === 'single' && (
          <input
            type="text"
            value={formData.salarySingle}
            onChange={(e) =>
              setFormData({
                ...formData,
                salarySingle: formatNumber(getRawNumber(e.target.value)),
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 50,000"
          />
        )}

        {formData.salaryMode === 'range' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.salaryFrom}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salaryFrom: formatNumber(getRawNumber(e.target.value)),
                })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Minimum"
            />
            <input
              type="text"
              value={formData.salaryTo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  salaryTo: formatNumber(getRawNumber(e.target.value)),
                })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Maximum"
            />
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional - Add salary information to attract more candidates
        </p>
      </div>
      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Tips for Basic Information:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Use a clear, specific job title (e.g., "Senior React Developer" instead of just "Developer")</li>
            <li>Choose the most appropriate category to help candidates find your job</li>
            <li>Be accurate about the location and work type</li>
          </ul>
        </div>
      </div>
    </div>
  );
}