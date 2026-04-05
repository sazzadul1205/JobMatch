import { useState, useRef } from 'react';
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
  FaTrash,
  FaCloudUploadAlt,
  FaImage,
  FaCheckCircle
} from 'react-icons/fa';
import { MdOutlineBloodtype } from 'react-icons/md';
import Modal from './Modal';

const BasicInfoModal = ({ isOpen, onClose, onSave, profile, saving }) => {
  const [dragActive, setDragActive] = useState(false);
  const [modalData, setModalData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    birth_date: profile?.birth_date || '',
    gender: profile?.gender || '',
    blood_type: profile?.blood_type || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    photo: null,
    photoPreview: null,
    remove_photo: false,
  });
  const fileInputRef = useRef(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetPhoto(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetPhoto(file);
    }
  };

  const validateAndSetPhoto = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or GIF)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }
    const newPreviewUrl = URL.createObjectURL(file);
    setModalData({ ...modalData, photo: file, photoPreview: newPreviewUrl, remove_photo: false });
  };

  const handleDeletePhoto = () => {
    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }
    setModalData({ ...modalData, photo: null, photoPreview: null, remove_photo: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('first_name', modalData.first_name);
    formData.append('last_name', modalData.last_name);
    if (modalData.birth_date) formData.append('birth_date', modalData.birth_date);
    if (modalData.gender) formData.append('gender', modalData.gender);
    if (modalData.blood_type) formData.append('blood_type', modalData.blood_type);
    if (modalData.phone) formData.append('phone', modalData.phone);
    if (modalData.address) formData.append('address', modalData.address);
    if (modalData.remove_photo) formData.append('remove_photo', '1');
    if (modalData.photo) formData.append('photo', modalData.photo);

    await onSave(formData);

    // Clean up preview URL after save
    if (modalData.photoPreview) {
      URL.revokeObjectURL(modalData.photoPreview);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal title="Edit Basic Information" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Photo */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Profile Photo
              </label>

              {!modalData.photoPreview && !profile?.photo_url ? (
                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${dragActive
                      ? 'border-blue-500 bg-blue-50 scale-105'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    aria-label="Upload profile photo"
                  />
                  <div className="text-center py-16 px-6">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-linear-to-br from-blue-100 to-blue-200 rounded-full">
                        <FaCloudUploadAlt className="h-10 w-10 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Drop your photo here</p>
                    <p className="text-gray-400 text-sm mb-3">or click to browse</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded-full">
                      <FaImage className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-600">JPG, PNG, GIF up to 2MB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 shadow-lg">
                    <img
                      src={modalData.photoPreview || profile?.photo_url}
                      alt="Profile preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                        <FaCheckCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6 gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-lg transform hover:scale-105"
                      >
                        <FaImage className="h-4 w-4" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium text-sm flex items-center gap-2 shadow-lg transform hover:scale-105"
                      >
                        <FaTrash size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
              <p className="text-xs text-gray-400 text-center mt-3">
                Recommended: Square image, at least 200x200px
              </p>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    First Name
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={modalData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={modalData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaPhone className="h-4 w-4 text-blue-500" />
                    Phone Number
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={modalData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaBirthdayCake className="h-4 w-4 text-blue-500" />
                    Birth Date
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="birth_date"
                    value={modalData.birth_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <FaVenusMars className="h-4 w-4 text-blue-500" />
                    Gender
                  </span>
                </label>
                <select
                  name="gender"
                  value={modalData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select gender</option>
                  {genders.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <MdOutlineBloodtype className="h-4 w-4 text-red-500" />
                    Blood Type
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHeartbeat className="h-5 w-5 text-red-400" />
                  </div>
                  <select
                    name="blood_type"
                    value={modalData.blood_type}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map(bt => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="h-4 w-4 text-blue-500" />
                  Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-0 pl-3 pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={modalData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Your full address"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <FaGlobe className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> First name, last name, and phone are required fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BasicInfoModal;