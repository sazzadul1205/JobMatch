// resources/js/components/JobListingSteps/PublishingStep.jsx

import { StepWrapper } from './StepWrapper';

export const PublishingStep = ({ formData, errors, handleChange }) => {

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