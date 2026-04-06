// resources/js/components/JobListingSteps/PublishingStep.jsx

import { useState } from 'react';
import { StepWrapper } from './StepWrapper';
import { FaLink, FaGlobe, FaInfoCircle, FaPlus, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

export const PublishingStep = ({ formData, errors, handleChange }) => {
  const [newExternalLink, setNewExternalLink] = useState('');

  const addExternalLink = () => {
    if (newExternalLink.trim()) {
      const currentLinks = formData.external_apply_links || [];
      if (!currentLinks.includes(newExternalLink.trim())) {
        handleChange({
          target: {
            name: 'external_apply_links',
            value: [...currentLinks, newExternalLink.trim()]
          }
        });
        setNewExternalLink('');
      }
    }
  };

  const removeExternalLink = (index) => {
    const newLinks = [...(formData.external_apply_links || [])];
    newLinks.splice(index, 1);
    handleChange({
      target: {
        name: 'external_apply_links',
        value: newLinks
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addExternalLink();
    }
  };

  return (
    <StepWrapper
      title="Publishing & Deadlines"
      description="Set when this job should be published and when applications close"
      isActive={true}
      stepNumber={5}
    >
      <div className="space-y-6">
        {/* Application Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Application Deadline <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.application_deadline ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.application_deadline && <p className="mt-1 text-sm text-red-500">{errors.application_deadline}</p>}
          <p className="mt-1 text-xs text-gray-500">Last date for candidates to submit applications</p>
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publish Date (Optional)
          </label>
          <input
            type="date"
            name="publish_at"
            value={formData.publish_at}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to publish immediately. Future date will schedule the job posting.
          </p>
        </div>

        {/* Social Media Requirements */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Social Media Requirements</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="required_linkedin_link"
                checked={formData.required_linkedin_link}
                onChange={(e) => handleChange({ target: { name: 'required_linkedin_link', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Require LinkedIn profile for application</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="required_facebook_link"
                checked={formData.required_facebook_link}
                onChange={(e) => handleChange({ target: { name: 'required_facebook_link', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Require Facebook profile for application</span>
            </label>
          </div>
        </div>

        {/* External Apply Option - Improved */}
        <div className="border-t pt-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaGlobe className="text-blue-600" size={18} />
                <h3 className="text-md font-medium text-gray-900">External Application Links</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Add external websites where this job is also posted (e.g., LinkedIn, Indeed, company career page).
                <span className="block text-xs text-gray-500 mt-1">
                  Note: Internal applications through this website will still work. External links are additional options for candidates.
                </span>
              </p>
            </div>
          </div>

          {/* Info Box - Clarifies both internal and external work together */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start gap-2">
            <FaInfoCircle className="text-blue-500 mt-0.5 shrink-0" size={14} />
            <div className="text-xs text-blue-800">
              <span className="font-medium">How it works:</span> Candidates can apply through this website (internal)
              OR use the external links you provide. Both options will be visible to applicants.
            </div>
          </div>

          {/* External Links List */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External Apply URLs
            </label>

            {/* Add New Link */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="url"
                  value={newExternalLink}
                  onChange={(e) => setNewExternalLink(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://www.linkedin.com/jobs/view/123"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={addExternalLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
              >
                <FaPlus size={12} />
                Add Link
              </button>
            </div>

            {/* Links List */}
            {(formData.external_apply_links && formData.external_apply_links.length > 0) ? (
              <div className="space-y-2">
                {formData.external_apply_links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FaExternalLinkAlt className="text-blue-500 shrink-0" size={14} />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                      >
                        {link}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExternalLink(index)}
                      className="text-red-500 hover:text-red-700 ml-2 shrink-0"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FaLink className="mx-auto text-gray-400 mb-2" size={24} />
                <p className="text-sm text-gray-500">No external links added</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add links where this job is also posted (optional)
                </p>
              </div>
            )}
          </div>

          {/* Toggle for showing external links prominently */}
          <div className="mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="is_external_apply"
                checked={formData.is_external_apply}
                onChange={(e) => handleChange({ target: { name: 'is_external_apply', value: e.target.checked } })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div>
                <span className="text-sm text-gray-700">Show external links as primary application option</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  When checked, external links will be displayed prominently. Internal application will still be available.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Active Status */}
        <div className="border-t pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Job Status</h3>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange({ target: { name: 'is_active', value: e.target.checked } })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Active immediately (subject to publish date and deadline)</span>
          </label>
          <p className="mt-2 text-xs text-gray-500">
            Note: Jobs will automatically become inactive after the application deadline
          </p>
        </div>
      </div>
    </StepWrapper>
  );
};