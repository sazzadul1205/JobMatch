// pages/jobs/create/components/Step3Settings.jsx

import { FiClock } from 'react-icons/fi';
import { getMinDate } from '../utils/validators';

const Step3Settings = ({ data, setData, errors }) => {
  return (
    <div className="space-y-6 text-black">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiClock className="mr-2 text-indigo-600" size={20} />
          Application Settings
        </h2>
        <div className="space-y-4">
          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.application_deadline}
              onChange={e => setData('application_deadline', e.target.value)}
              min={getMinDate()}
              className={`w-full border ${errors.application_deadline ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.application_deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.application_deadline}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={data.contact_email}
                  onChange={e => setData('contact_email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="hr@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={data.contact_phone}
                  onChange={e => setData('contact_phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="border-t pt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={e => setData('is_active', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Activate job listing immediately
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              If disabled, the job will be saved as draft and won't be visible to job seekers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Settings;