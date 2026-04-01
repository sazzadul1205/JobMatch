// resources/js/pages/Backend/JobListings/Steps/JobDetailsStep.jsx

import { FaInfoCircle } from 'react-icons/fa';

export default function JobDetailsStep({ formData, setFormData, errors }) {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get max date (1 year from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Details</h2>

      {/* Education Requirement */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education Requirement
        </label>
        <select
          name="education_requirement"
          value={formData.education_requirement}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Education Level (Optional)</option>
          <option value="high-school">High School</option>
          <option value="associate">Associate Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD</option>
          <option value="none">No Formal Education Required</option>
        </select>
      </div>

      {/* Application Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Application Deadline <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          name="application_deadline"
          value={formData.application_deadline}
          onChange={handleInputChange}
          min={today}
          max={maxDateStr}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.application_deadline ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.application_deadline && (
          <p className="mt-1 text-sm text-red-500">{errors.application_deadline}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Applications will be accepted until this date
        </p>
      </div>

      {/* Expected Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Start Date
        </label>
        <input
          type="date"
          name="schedule_start_date"
          value={formData.schedule_start_date}
          onChange={handleInputChange}
          min={today}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional - When should the candidate start? (e.g., Immediate, 2 weeks notice)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Tips for Job Details:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Set a reasonable application deadline (at least 2-4 weeks from now)</li>
            <li>Be clear about education requirements to avoid unqualified applications</li>
            <li>Specify if the start date is flexible</li>
          </ul>
        </div>
      </div>
    </div>
  );
}