// pages/auth/Steps/BasicInfo.jsx

// Icons
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaHeartbeat,
  FaIdCard,
  FaBirthdayCake,
  FaGlobe,
  FaVenusMars,
  FaTint
} from 'react-icons/fa';
import { MdOutlineBloodtype } from 'react-icons/md';

const BasicInfo = ({ data, setData }) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaUser className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            <p className="text-sm text-gray-500 mt-1">Tell us about yourself</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <FaIdCard className="h-4 w-4 text-gray-400" />
              First Name
            </span>
          </label>
          <input
            type="text"
            value={data.first_name}
            onChange={(e) => setData('first_name', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={data.last_name}
            onChange={(e) => setData('last_name', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="+880 1XXX XXXXXX"
            />
          </div>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <FaBirthdayCake className="h-4 w-4 text-gray-400" />
              Birth Date
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={data.birth_date}
              onChange={(e) => setData('birth_date', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <FaVenusMars className="h-4 w-4 text-gray-400" />
              Gender
            </span>
          </label>
          <select
            value={data.gender}
            onChange={(e) => setData('gender', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
          >
            <option value="">Select gender</option>
            {genders.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Blood Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <MdOutlineBloodtype className="h-4 w-4 text-red-400" />
              Blood Type
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaHeartbeat className="h-5 w-5 text-red-400" />
            </div>
            <select
              value={data.blood_type}
              onChange={(e) => setData('blood_type', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            >
              <option value="">Select blood type</option>
              {bloodTypes.map(bt => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-0 pl-3 pointer-events-none">
            <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            value={data.address}
            onChange={(e) => setData('address', e.target.value)}
            rows="3"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder="Your full address"
          />
        </div>
      </div>

      {/* Optional Notice */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-center gap-2">
          <FaGlobe className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-gray-600">
            All fields are optional. You can skip and update later from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;