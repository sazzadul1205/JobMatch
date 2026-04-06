// resources/js/components/JobListingSteps/RequirementsStep.jsx

import React from 'react';
import { StepWrapper } from './StepWrapper';
import CustomEditor from '../../components/CustomEditor';
import { FaInfoCircle } from 'react-icons/fa';

export const RequirementsStep = ({ formData, errors, handleChange, handleArrayChange, setFormData }) => {
  const [newSkill, setNewSkill] = React.useState('');
  const [newResponsibility, setNewResponsibility] = React.useState('');
  const [newBenefit, setNewBenefit] = React.useState('');

  const addItem = (arrayName, value, setter) => {
    if (value.trim()) {
      handleArrayChange(arrayName, [...formData[arrayName], value.trim()]);
      setter('');
    }
  };

  const removeItem = (arrayName, index) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    handleArrayChange(arrayName, newArray);
  };

  return (
    <StepWrapper
      title="Requirements & Qualifications"
      description="Define what candidates need to succeed in this role"
      isActive={true}
      stepNumber={2}
    >
      <div className="space-y-6">
        {/* Job Requirements - Using CustomEditor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Requirements <span className="text-red-500">*</span>
          </label>
          <CustomEditor
            value={formData.requirements}
            onChange={(html) => setFormData(prev => ({ ...prev, requirements: html }))}
            placeholder="List the qualifications, skills, experience, and any specific requirements for this role..."
          />
          {errors.requirements && <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>}
          <p className="mt-1 text-xs text-gray-500">
            Minimum 50 characters. Be specific about what you're looking for in a candidate.
          </p>
        </div>

        {/* Skills - List Based */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('skills', newSkill, setNewSkill)}
              placeholder="e.g., JavaScript, Project Management, Communication"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => addItem('skills', newSkill, setNewSkill)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Skill
            </button>
          </div>

          {/* List View instead of Tags */}
          {formData.skills.length > 0 ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Skill Name</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.skills.map((skill, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{skill}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem('skills', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-sm text-gray-500">No skills added yet</p>
              <p className="text-xs text-gray-400 mt-1">Add skills using the input above</p>
            </div>
          )}

          {errors.skills && <p className="mt-1 text-sm text-red-500">{errors.skills}</p>}
          <p className="mt-1 text-xs text-gray-500">Add at least one required skill</p>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Responsibilities <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newResponsibility}
              onChange={(e) => setNewResponsibility(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('responsibilities', newResponsibility, setNewResponsibility)}
              placeholder="e.g., Lead development of new features"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => addItem('responsibilities', newResponsibility, setNewResponsibility)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {formData.responsibilities.map((resp, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="flex-1 text-gray-700">{resp}</span>
                <button
                  type="button"
                  onClick={() => removeItem('responsibilities', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {errors.responsibilities && <p className="mt-1 text-sm text-red-500">{errors.responsibilities}</p>}
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits & Perks
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem('benefits', newBenefit, setNewBenefit)}
              placeholder="e.g., Health insurance, Remote work, Flexible hours"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => addItem('benefits', newBenefit, setNewBenefit)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.benefits.map((benefit, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {benefit}
                <button
                  type="button"
                  onClick={() => removeItem('benefits', index)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Requirement <span className="text-red-500">*</span>
            </label>
            <select
              name="education_requirement"
              value={formData.education_requirement}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select education requirement</option>
              <option value="No formal education required">No formal education required</option>
              <option value="Class 5 (Primary School Certificate)">Class 5 (Primary School Certificate)</option>
              <option value="Class 8 (Junior School Certificate)">Class 8 (Junior School Certificate)</option>
              <option value="SSC (Secondary School Certificate)">SSC (Secondary School Certificate)</option>
              <option value="HSC (Higher Secondary Certificate)">HSC (Higher Secondary Certificate)</option>
              <option value="Diploma in Engineering">Diploma in Engineering</option>
              <option value="Bachelor's degree (Pass)">Bachelor's degree (Pass)</option>
              <option value="Bachelor's degree (Honours)">Bachelor's degree (Honours)</option>
              <option value="BSc in Computer Science & Engineering">BSc in Computer Science & Engineering</option>
              <option value="BSc in Electrical & Electronic Engineering">BSc in Electrical & Electronic Engineering</option>
              <option value="BSc in Civil Engineering">BSc in Civil Engineering</option>
              <option value="BSc in Mechanical Engineering">BSc in Mechanical Engineering</option>
              <option value="BBA (Bachelor of Business Administration)">BBA (Bachelor of Business Administration)</option>
              <option value="BA (Bachelor of Arts)">BA (Bachelor of Arts)</option>
              <option value="BSS (Bachelor of Social Science)">BSS (Bachelor of Social Science)</option>
              <option value="LLB (Bachelor of Laws)">LLB (Bachelor of Laws)</option>
              <option value="MBBS (Bachelor of Medicine)">MBBS (Bachelor of Medicine)</option>
              <option value="BDS (Bachelor of Dental Surgery)">BDS (Bachelor of Dental Surgery)</option>
              <option value="BPharm (Bachelor of Pharmacy)">BPharm (Bachelor of Pharmacy)</option>
              <option value="BSc in Nursing">BSc in Nursing</option>
              <option value="BSc in Agriculture">BSc in Agriculture</option>
              <option value="Master's degree">Master's degree</option>
              <option value="MBA (Master of Business Administration)">MBA (Master of Business Administration)</option>
              <option value="MA (Master of Arts)">MA (Master of Arts)</option>
              <option value="MSS (Master of Social Science)">MSS (Master of Social Science)</option>
              <option value="MSc (Master of Science)">MSc (Master of Science)</option>
              <option value="LLM (Master of Laws)">LLM (Master of Laws)</option>
              <option value="MPH (Master of Public Health)">MPH (Master of Public Health)</option>
              <option value="PhD (Doctor of Philosophy)">PhD (Doctor of Philosophy)</option>
              <option value="Post Graduate Diploma (PGD)">Post Graduate Diploma (PGD)</option>
              <option value="Professional Certification">Professional Certification</option>
              <option value="Vocational Training">Vocational Training</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Details (Optional)
            </label>
            <input
              type="text"
              name="education_details"
              value={formData.education_details}
              onChange={handleChange}
              placeholder="e.g., CGPA 3.0 or equivalent, Any recognized university"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
          <FaInfoCircle className="text-blue-500 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Tips for Requirements & Responsibilities:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Be specific about required qualifications and experience</li>
              <li>List must-have vs nice-to-have skills</li>
              <li>Clearly define day-to-day responsibilities</li>
              <li>Include information about team structure and reporting lines</li>
              <li>Highlight growth opportunities and learning paths</li>
            </ul>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
};