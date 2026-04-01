// resources/js/pages/Backend/JobListings/Steps/PreviewStep.jsx

import { FaEdit } from 'react-icons/fa';

export default function PreviewStep({
  formData,
  description,
  requirements,
  skills,
  responsibilities,
  benefits,
  keywords,
  categories,
  locations,
  setCurrentStep
}) {
  const getCategoryName = (id) => {
    const category = categories?.find(cat => cat.id === parseInt(id));
    return category ? category.name : 'Not selected';
  };

  const getLocationName = (id) => {
    const location = locations?.find(loc => loc.id === parseInt(id));
    return location ? location.name : 'Not selected';
  };

  const formatJobType = (type) => {
    const types = {
      'full-time': 'Full Time',
      'part-time': 'Part Time',
      'contract': 'Contract',
      'freelance': 'Freelance',
      'internship': 'Internship',
      'remote': 'Remote'
    };
    return types[type] || type;
  };

  const formatExperienceLevel = (level) => {
    const levels = {
      'entry': 'Entry Level',
      'junior': 'Junior',
      'mid': 'Mid Level',
      'senior': 'Senior',
      'lead': 'Lead',
      'executive': 'Executive',
      'intern': 'Intern'
    };
    return levels[level] || level;
  };

  const formatEducation = (edu) => {
    const levels = {
      'high-school': 'High School',
      'associate': 'Associate Degree',
      'bachelor': "Bachelor's Degree",
      'master': "Master's Degree",
      'phd': 'PhD',
      'none': 'No Formal Education Required'
    };
    return levels[edu] || edu || 'Not specified';
  };

  const getSalaryDisplay = () => {
    if (formData.salaryMode === 'single') {
      return formData.salarySingle ? `$${formData.salarySingle}` : 'Not specified';
    } else {
      return formData.salaryFrom || formData.salaryTo
        ? `$${formData.salaryFrom || '0'} - $${formData.salaryTo || '0'}`
        : 'Not specified';
    }
  };

  // Prevent Enter key from submitting
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" onKeyDown={handleKeyDown}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Preview Job Listing</h2>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          <FaEdit size={16} />
          Edit Details
        </button>
      </div>

      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {formData.title || 'Untitled Position'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium">{getCategoryName(formData.category_id)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{getLocationName(formData.location_id)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Job Type</p>
            <p className="font-medium">{formatJobType(formData.job_type)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Experience Level</p>
            <p className="font-medium">{formatExperienceLevel(formData.experience_level)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="font-medium">{getSalaryDisplay()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Application Deadline</p>
            <p className="font-medium">{formData.application_deadline || 'Not set'}</p>
          </div>
          {formData.schedule_start_date && (
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formData.schedule_start_date}</p>
            </div>
          )}
          {formData.education_requirement && (
            <div>
              <p className="text-sm text-gray-500">Education Required</p>
              <p className="font-medium">{formatEducation(formData.education_requirement)}</p>
            </div>
          )}
        </div>

        {description && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        )}

        {requirements && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
            <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: requirements }} />
          </div>
        )}

        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {responsibilities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Responsibilities</h2>
            <ul className="list-disc list-inside space-y-1">
              {responsibilities.map((resp, index) => (
                <li key={index} className="text-gray-700">{resp}</li>
              ))}
            </ul>
          </div>
        )}

        {benefits.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits & Perks</h2>
            <ul className="list-disc list-inside space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="text-gray-700">{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {keywords.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {(formData.show_linkedin || formData.show_facebook) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Will be shared on:</h3>
            <div className="flex gap-3">
              {formData.show_linkedin && <span className="text-blue-600">LinkedIn</span>}
              {formData.show_facebook && <span className="text-blue-600">Facebook</span>}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Status: {formData.is_active ?
              <span className="text-green-600 font-medium">✓ Will be published immediately</span> :
              <span className="text-yellow-600 font-medium">📝 Will be saved as draft</span>}
          </p>
        </div>
      </div>
    </div>
  );
}