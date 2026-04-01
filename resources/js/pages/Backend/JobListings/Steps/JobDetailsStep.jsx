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
          <option value="ssc">SSC / Equivalent</option>
          <option value="hsc">HSC / Equivalent</option>
          <option value="diploma">Diploma in Engineering / Equivalent</option>
          <option value="bachelor">Bachelor's Degree (Honors / Pass)</option>
          <option value="masters">Master's Degree (MA / MSc / MBA)</option>
          <option value="masters-engineering">Master's in Engineering (MEng / MSc Eng)</option>
          <option value="phd">PhD / Doctorate</option>
          <option value="professional">Professional Certification (CA / ACCA / CIMA / ICSB)</option>
          <option value="vocational">Vocational Training / Technical Education</option>
          <option value="none">No Formal Education Required</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select the minimum educational qualification required for this position.
        </p>
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
          Optional - When should the candidate start? (e.g., Immediate, 15 days notice, 30 days notice)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Tips for Job Details:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Set a reasonable application deadline (at least 2-4 weeks from now)</li>
            <li>Be clear about education requirements (SSC, HSC, Bachelor's, etc.) to avoid unqualified applications</li>
            <li>Specify if the start date is flexible (e.g., Immediate, 2 weeks notice)</li>
            <li>For professional roles, mention if professional certifications (CA, ACCA, etc.) are preferred</li>
          </ul>
        </div>
      </div>
    </div>
  );
}