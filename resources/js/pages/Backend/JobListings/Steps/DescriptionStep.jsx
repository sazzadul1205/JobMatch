// resources/js/pages/Backend/JobListings/Steps/DescriptionStep.jsx

import { FaInfoCircle } from 'react-icons/fa';
import CustomEditor from '../../../../components/CustomEditor';

export default function DescriptionStep({ description, setDescription, requirements, setRequirements, errors }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Description & Requirements</h2>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description <span className="text-red-500">*</span>
        </label>
        <CustomEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe the job role, responsibilities, day-to-day tasks, and what makes this opportunity exciting..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 50 characters. Use formatting tools to make your description engaging.
        </p>
      </div>

      {/* Job Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Requirements <span className="text-red-500">*</span>
        </label>
        <CustomEditor
          value={requirements}
          onChange={setRequirements}
          placeholder="List the qualifications, skills, experience, and any specific requirements for this role..."
        />
        {errors.requirements && (
          <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Minimum 50 characters. Be specific about what you're looking for in a candidate.
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Tips for Description & Requirements:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Be detailed about the role - candidates want to know what they'll be doing</li>
            <li>List must-have vs nice-to-have requirements</li>
            <li>Highlight company culture and benefits</li>
            <li>Use bullet points for easier reading</li>
            <li>Include information about growth opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}