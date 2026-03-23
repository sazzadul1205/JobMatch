// pages/jobs/create/components/Step1BasicInfo.jsx (Updated)

import { useState, useEffect } from 'react';
import {
  FiBriefcase,
  FiTag,
  FiAward,
  FiMapPin,
  FiDollarSign,
  FiGlobe,
  FiAlertCircle,
  FiToggleLeft,
  FiToggleRight,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { REMOTE_POLICY_OPTIONS } from '../constants';

const Step1BasicInfo = ({
  data,
  setData,
  errors,
  jobTypes,
  categories,
  experienceLevels,
  // External state props (for edit page)
  externalLocationParts,
  externalShowDetailedAddress,
  externalSalaryType,
  onLocationPartsChange,
  onShowDetailedAddressChange,
  onSalaryTypeChange
}) => {
  // Use internal state if external props not provided (create mode), otherwise use external state
  const [internalLocationParts, setInternalLocationParts] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: ''
  });

  const [internalShowDetailedAddress, setInternalShowDetailedAddress] = useState(false);
  const [internalSalaryType, setInternalSalaryType] = useState('single');

  // Determine if we're in edit mode (external props provided)
  const isEditMode = !!externalLocationParts;

  // Use either external or internal state
  const locationParts = isEditMode ? externalLocationParts : internalLocationParts;
  const showDetailedAddress = isEditMode ? externalShowDetailedAddress : internalShowDetailedAddress;
  const salaryType = isEditMode ? externalSalaryType : internalSalaryType;

  // Set state update functions
  const setLocationParts = isEditMode ? onLocationPartsChange : setInternalLocationParts;
  const setShowDetailedAddress = isEditMode ? onShowDetailedAddressChange : setInternalShowDetailedAddress;
  const setSalaryType = isEditMode ? onSalaryTypeChange : setInternalSalaryType;

  // Update location parts and combine into location string
  const updateLocationPart = (field, value) => {
    const updated = { ...locationParts, [field]: value };
    setLocationParts(updated);

    // Combine parts into a single location string
    const locationPartsArray = [];

    if (updated.address_line1) locationPartsArray.push(updated.address_line1);
    if (updated.address_line2) locationPartsArray.push(updated.address_line2);

    // Combine city, state, postal code
    const cityStateZip = [updated.city, updated.state, updated.postal_code]
      .filter(part => part.trim())
      .join(', ');

    if (cityStateZip) locationPartsArray.push(cityStateZip);
    if (updated.country) locationPartsArray.push(updated.country);

    const locationString = locationPartsArray.join(', ');
    setData('location', locationString);
  };

  // Format currency with commas
  const formatCurrency = (value) => {
    const numericValue = value.replace(/[^\d.]/g, '');
    if (numericValue === '') return '';
    const parts = numericValue.split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] ? '.' + parts[1].slice(0, 2) : '';
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return integerPart + decimalPart;
  };

  // Handle salary input change
  const handleSalaryChange = (value, field = 'single') => {
    const formattedValue = formatCurrency(value);

    if (salaryType === 'single') {
      setData('salary_range', formattedValue);
    } else {
      if (field === 'from') {
        setData('salary_range', `${formattedValue} - ${data.salary_range.split(' - ')[1] || ''}`);
      } else if (field === 'to') {
        setData('salary_range', `${data.salary_range.split(' - ')[0] || ''} - ${formattedValue}`);
      }
    }
  };

  // Get salary range parts
  const getSalaryParts = () => {
    if (!data.salary_range) return { from: '', to: '' };
    const parts = data.salary_range.split(' - ');
    return {
      from: parts[0] || '',
      to: parts[1] || ''
    };
  };

  const salaryParts = getSalaryParts();

  return (
    <div className="space-y-6 text-black">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FiBriefcase className="mr-2 text-indigo-600" size={20} />
          Basic Information
        </h2>
        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'
                } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="e.g., Senior Software Engineer"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Job Type, Category, Experience Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiBriefcase className="inline mr-1" size={14} />
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                value={data.job_type}
                onChange={e => setData('job_type', e.target.value)}
                className={`w-full border ${errors.job_type ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select job type</option>
                {Object.entries(jobTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.job_type && (
                <p className="mt-1 text-sm text-red-600">{errors.job_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiTag className="inline mr-1" size={14} />
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={data.category}
                onChange={e => setData('category', e.target.value)}
                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select category</option>
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiAward className="inline mr-1" size={14} />
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                value={data.experience_level}
                onChange={e => setData('experience_level', e.target.value)}
                className={`w-full border ${errors.experience_level ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="">Select experience level</option>
                {Object.entries(experienceLevels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.experience_level && (
                <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>
              )}
            </div>
          </div>

          {/* Location - Detailed Address with Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <FiMapPin className="inline mr-1" size={14} />
                Location <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowDetailedAddress(!showDetailedAddress)}
                className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {showDetailedAddress ? (
                  <>
                    <FiChevronUp size={16} />
                    Show Simple View
                  </>
                ) : (
                  <>
                    <FiChevronDown size={16} />
                    Add Detailed Address
                  </>
                )}
              </button>
            </div>

            {showDetailedAddress ? (
              <div className="space-y-3">
                {/* Address Line 1 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Address Line 1 (Building/House/Street)
                  </label>
                  <textarea
                    value={locationParts.address_line1}
                    onChange={e => updateLocationPart('address_line1', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="e.g., 123 Main Street, Suite 100, Building A"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={locationParts.address_line2}
                    onChange={e => updateLocationPart('address_line2', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Floor 5, Room 501"
                  />
                </div>

                {/* City, State, Postal Code Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      value={locationParts.city}
                      onChange={e => updateLocationPart('city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">State/Province</label>
                    <input
                      type="text"
                      value={locationParts.state}
                      onChange={e => updateLocationPart('state', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={locationParts.postal_code}
                      onChange={e => updateLocationPart('postal_code', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="10001"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Country</label>
                  <input
                    type="text"
                    value={locationParts.country}
                    onChange={e => updateLocationPart('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="United States"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    value={locationParts.city}
                    onChange={e => updateLocationPart('city', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={locationParts.state}
                    onChange={e => updateLocationPart('state', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="State/Province"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={locationParts.country}
                    onChange={e => updateLocationPart('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Country"
                  />
                </div>
              </div>
            )}

            {/* Preview of full location */}
            {data.location && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Full Address Preview:</p>
                <p className="text-sm text-gray-700">{data.location}</p>
              </div>
            )}

            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Salary Range - Toggle between single and range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <FiDollarSign className="inline mr-1" size={14} />
                Salary
              </label>
              <button
                type="button"
                onClick={() => {
                  setSalaryType(salaryType === 'single' ? 'range' : 'single');
                  setData('salary_range', ''); // Reset when toggling
                }}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                {salaryType === 'single' ? (
                  <>
                    <FiToggleLeft size={18} />
                    Switch to Range
                  </>
                ) : (
                  <>
                    <FiToggleRight size={18} />
                    Switch to Single
                  </>
                )}
              </button>
            </div>

            {salaryType === 'single' ? (
              <div>
                <input
                  type="text"
                  value={data.salary_range}
                  onChange={e => handleSalaryChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="$50,000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Example: $50,000 or $50,000/year
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="text"
                    value={salaryParts.from}
                    onChange={e => handleSalaryChange(e.target.value, 'from')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="$50,000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="text"
                    value={salaryParts.to}
                    onChange={e => handleSalaryChange(e.target.value, 'to')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="$70,000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Remote Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiGlobe className="inline mr-1" size={14} />
              Remote Policy
            </label>
            <select
              value={data.remote_policy}
              onChange={e => setData('remote_policy', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select remote policy</option>
              {REMOTE_POLICY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;