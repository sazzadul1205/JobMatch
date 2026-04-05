// React
import { useState } from 'react';

// Inertia
import { Head, Link, router } from '@inertiajs/react';

// Icons
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaTrash,
  FaTrashRestore,
  FaFilePdf,
  FaUserCircle,
  FaPlusCircle,
  FaSpinner,
  FaBirthdayCake,
  FaIdCard,
  FaExclamationTriangle,
  FaFileAlt,
  FaBriefcase,
  FaTrophy,
  FaMapMarkerAlt,
  FaVenusMars,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaGlobe,
  FaCalendarAlt,
  FaBuilding,
  FaStar,
  FaClock,
  FaChartLine,
} from 'react-icons/fa';
import { MdOutlineBloodtype, MdWork, MdSchool, MdPending } from 'react-icons/md';

// SweetAlert2
import Swal from 'sweetalert2';

// Layouts
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Modals
import BasicInfoModal from './Modals/BasicInfoModal';
import ProfessionalInfoModal from './Modals/ProfessionalInfoModal';
import WorkExperienceModal from './Modals/WorkExperienceModal';
import EducationModal from './Modals/EducationModal';
import AchievementsModal from './Modals/AchievementsModal';

export default function Show({ profile }) {
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const isDeleted = profile?.deleted_at !== null;

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const openModal = (modalType) => {
    if (isDeleted) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Edit',
        text: 'Please restore your profile before editing.',
      });
      return;
    }
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Save handlers
  const saveBasicInfo = async (formData) => {
    setSaving(true);
    try {
      const response = await fetch(`/applicant/profile/${profile.id}/basic-info`, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Basic information updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        router.reload();
        closeModal();
      } else {
        throw new Error(data.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update basic information.',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveProfessionalInfo = async (data) => {
    setSaving(true);
    try {
      const response = await fetch(`/applicant/profile/${profile.id}/professional-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Professional information updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        router.reload();
        closeModal();
      } else {
        throw new Error(responseData.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update professional information.',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveWorkExperiences = async (data) => {
    setSaving(true);
    try {
      const response = await fetch(`/applicant/profile/${profile.id}/work-experiences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Work experience updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        router.reload();
        closeModal();
      } else {
        throw new Error(responseData.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update work experience.',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveEducations = async (data) => {
    setSaving(true);
    try {
      const response = await fetch(`/applicant/profile/${profile.id}/educations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Education updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        router.reload();
        closeModal();
      } else {
        throw new Error(responseData.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update education.',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAchievements = async (data) => {
    setSaving(true);
    try {
      const response = await fetch(`/applicant/profile/${profile.id}/achievements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (responseData.success) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Achievements updated successfully.',
          timer: 1500,
          showConfirmButton: false
        });
        router.reload();
        closeModal();
      } else {
        throw new Error(responseData.message || 'Failed to update');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to update achievements.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Profile?',
      text: 'Your profile will be soft deleted. You can restore it later.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        try {
          const response = await fetch(`/applicant/profile/${profile.id}`, {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
            }
          });

          const data = await response.json();

          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your profile has been deleted.',
              timer: 2000,
              showConfirmButton: false
            });
            router.reload();
          } else {
            throw new Error(data.message || 'Failed to delete');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to delete profile.',
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  const handleRestore = () => {
    Swal.fire({
      title: 'Restore Profile?',
      text: 'Your profile will be restored with all its data.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setRestoring(true);
        try {
          const response = await fetch(`/applicant/profile/${profile.user_id}/restore`, {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
            }
          });

          const data = await response.json();

          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Your profile has been restored successfully.',
              timer: 1500,
              showConfirmButton: false
            });
            router.reload();
          } else {
            throw new Error(data.message || 'Failed to restore');
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'Failed to restore profile.',
          });
        } finally {
          setRestoring(false);
        }
      }
    });
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Change Password',
      html: `
        <input type="password" id="current_password" class="swal2-input" placeholder="Current Password">
        <input type="password" id="new_password" class="swal2-input" placeholder="New Password (min 8 characters)">
        <input type="password" id="new_password_confirmation" class="swal2-input" placeholder="Confirm New Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Change Password',
      cancelButtonText: 'Cancel',
      preConfirm: async () => {
        const current_password = document.getElementById('current_password').value;
        const new_password = document.getElementById('new_password').value;
        const new_password_confirmation = document.getElementById('new_password_confirmation').value;

        if (!current_password || !new_password || !new_password_confirmation) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }

        if (new_password.length < 8) {
          Swal.showValidationMessage('New password must be at least 8 characters');
          return false;
        }

        if (new_password !== new_password_confirmation) {
          Swal.showValidationMessage('New passwords do not match');
          return false;
        }

        try {
          const response = await fetch('/applicant/profile/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              current_password,
              new_password,
              new_password_confirmation
            })
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.errors) {
              const errors = Object.values(data.errors).flat().join('\n');
              throw new Error(errors);
            }
            throw new Error(data.message || 'Failed to change password');
          }

          return data;
        } catch (error) {
          Swal.showValidationMessage(error.message);
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password changed successfully!',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  if (!profile) {
    return (
      <AuthenticatedLayout>
        <Head title="My Profile" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserCircle className="text-gray-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-6">
              You haven't created a profile yet. Create one to apply for jobs.
            </p>
            <Link
              href={route('backend.applicant.profile.create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlusCircle size={18} />
              Create Profile
            </Link>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  const age = calculateAge(profile?.birth_date);
  const stats = profile?.stats || {};

  return (
    <AuthenticatedLayout>
      <Head title={`${profile.first_name} ${profile.last_name} - Profile`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex gap-3 flex-wrap">
              {!isDeleted && (
                <button
                  onClick={handleChangePassword}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <FaUser size={16} />
                  Change Password
                </button>
              )}

              {isDeleted ? (
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {restoring ? <FaSpinner className="animate-spin" size={16} /> : <FaTrashRestore size={16} />}
                  Restore Profile
                </button>
              ) : (
                <>
                  <Link
                    href={route('backend.applicant.profile.edit', profile.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaEdit size={16} />
                    Edit Profile
                  </Link>

                  <Link
                    href={route('backend.applications.my-applications')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <FaFileAlt size={16} />
                    My Applications ({stats.total_applications || 0})
                  </Link>

                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? <FaSpinner className="animate-spin" size={16} /> : <FaTrash size={16} />}
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Deleted Banner */}
          {isDeleted && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                <p className="text-sm text-yellow-700">
                  This profile has been deleted. You can restore it to continue using your profile.
                </p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {!isDeleted && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">CVs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.active_cvs || 0}/{stats.total_cvs || 0}</p>
                  </div>
                  <FaFilePdf className="text-red-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Work Experience</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_jobs || 0}</p>
                  </div>
                  <FaBriefcase className="text-orange-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Education</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_education || 0}</p>
                  </div>
                  <MdSchool className="text-green-500 text-2xl" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Achievements</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_achievements || 0}</p>
                  </div>
                  <FaTrophy className="text-yellow-500 text-2xl" />
                </div>
              </div>
            </div>
          )}

          {/* Completion Progress */}
          {!isDeleted && profile.completion_percentage && (
            <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-semibold text-blue-600">{profile.completion_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${profile.completion_percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Main Profile Card */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isDeleted ? 'opacity-75' : ''}`}>
            <div className={`h-32 ${isDeleted ? 'bg-gray-400' : 'bg-linear-to-r from-blue-600 to-blue-700'}`} />

            <div className="px-6 pb-6">
              {/* Profile Photo */}
              <div className="flex justify-center -mt-16 mb-4">
                {profile.photo_url && !isDeleted ? (
                  <img
                    src={profile.photo_url}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-gray-400 text-5xl" />
                  </div>
                )}
              </div>

              {/* Name & Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                {profile.current_job_title && (
                  <p className="text-gray-600 text-sm mt-1">{profile.current_job_title}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Job Seeker</p>
                {isDeleted && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Deleted
                  </span>
                )}
              </div>

              {/* Basic Information */}
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaUser className="text-blue-600" />
                    Basic Information
                  </h3>
                  {!isDeleted && (
                    <button
                      onClick={() => openModal('basic')}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{profile.phone || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaBirthdayCake className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Birth Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.birth_date ? formatDate(profile.birth_date) : 'Not specified'}
                        {age && <span className="text-gray-500 ml-1">({age} years)</span>}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaVenusMars className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="text-sm font-medium text-gray-900">{profile.gender || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MdOutlineBloodtype className="text-red-500" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Blood Type</p>
                      <p className="text-sm font-medium text-gray-900">{profile.blood_type || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-blue-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">{profile.address || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="border-t pt-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaBriefcase className="text-purple-600" />
                    Professional Information
                  </h3>
                  {!isDeleted && (
                    <button
                      onClick={() => openModal('professional')}
                      className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm"
                    >
                      <FaEdit size={14} /> Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MdWork className="text-purple-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Years of Experience</p>
                      <p className="text-sm font-medium text-gray-900">
                        {profile.experience_years !== null
                          ? (profile.experience_years === 0 ? 'Fresher' : `${profile.experience_years} year${profile.experience_years > 1 ? 's' : ''}`)
                          : 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaBuilding className="text-purple-600" size={18} />
                    <div>
                      <p className="text-xs text-gray-500">Current Job Title</p>
                      <p className="text-sm font-medium text-gray-900">{profile.current_job_title || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Social Links</p>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(profile.social_links).map(([platform, url]) => {
                        let Icon = FaGlobe;
                        let color = "text-gray-600";
                        if (platform === 'linkedin') { Icon = FaLinkedin; color = "text-blue-600"; }
                        if (platform === 'github') { Icon = FaGithub; color = "text-gray-800"; }
                        if (platform === 'twitter') { Icon = FaTwitter; color = "text-blue-400"; }
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                          >
                            <Icon className={color} size={16} />
                            <span className="text-sm text-gray-700 capitalize">{platform}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Work Experience */}
              {profile.job_histories && profile.job_histories.length > 0 && (
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaBriefcase className="text-orange-600" />
                      Work Experience ({profile.job_histories.length})
                    </h3>
                    {!isDeleted && (
                      <button
                        onClick={() => openModal('work')}
                        className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {profile.job_histories.map((job, index) => (
                      <div key={job.id || index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{job.position}</h4>
                            <p className="text-sm text-gray-600">{job.company_name}</p>
                          </div>
                          {job.is_current && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                              <FaStar size={12} /> Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <FaCalendarAlt size={12} />
                          {job.starting_year} - {job.is_current ? 'Present' : (job.ending_year || 'Present')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education_histories && profile.education_histories.length > 0 && (
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MdSchool className="text-green-600" />
                      Education ({profile.education_histories.length})
                    </h3>
                    {!isDeleted && (
                      <button
                        onClick={() => openModal('education')}
                        className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {profile.education_histories.map((edu, index) => (
                      <div key={edu.id || index} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution_name}</p>
                        <p className="text-xs text-gray-500 mt-1">Passing Year: {edu.passing_year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {profile.achievements && profile.achievements.length > 0 && (
                <div className="border-t pt-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaTrophy className="text-yellow-600" />
                      Achievements & Certifications ({profile.achievements.length})
                    </h3>
                    {!isDeleted && (
                      <button
                        onClick={() => openModal('achievements')}
                        className="text-yellow-600 hover:text-yellow-700 flex items-center gap-1 text-sm"
                      >
                        <FaEdit size={14} /> Edit
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {profile.achievements.map((achievement, index) => (
                      <div key={achievement.id || index} className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <FaTrophy className="text-yellow-600" size={16} />
                          {achievement.achievement_name}
                        </h4>
                        {achievement.achievement_details && (
                          <p className="text-sm text-gray-600 mt-2">{achievement.achievement_details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CV Section */}
              {profile.cvs && profile.cvs.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-red-600" />
                    CV / Resume ({profile.cvs.length})
                  </h3>
                  <div className="space-y-3">
                    {profile.cvs.map((cv) => (
                      <div key={cv.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <FaFilePdf className="text-red-500" size={24} />
                          <div>
                            <p className="font-medium text-gray-900">{cv.original_name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                              <span>Uploaded: {new Date(cv.created_at).toLocaleDateString()}</span>
                              {cv.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 text-orange-600">
                                  <MdPending size={12} /> Pending
                                </span>
                              )}
                              {cv.is_primary && (
                                <span className="inline-flex items-center gap-1 text-yellow-600">
                                  <FaStar size={12} /> Primary
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <a
                          href={cv.cv_url || `/storage/${cv.cv_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          View CV
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Since */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaIdCard className="text-blue-600" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BasicInfoModal
        isOpen={activeModal === 'basic'}
        onClose={closeModal}
        onSave={saveBasicInfo}
        profile={profile}
        saving={saving}
      />

      <ProfessionalInfoModal
        isOpen={activeModal === 'professional'}
        onClose={closeModal}
        onSave={saveProfessionalInfo}
        profile={profile}
        saving={saving}
      />

      <WorkExperienceModal
        isOpen={activeModal === 'work'}
        onClose={closeModal}
        onSave={saveWorkExperiences}
        profile={profile}
        saving={saving}
      />

      <EducationModal
        isOpen={activeModal === 'education'}
        onClose={closeModal}
        onSave={saveEducations}
        profile={profile}
        saving={saving}
      />

      <AchievementsModal
        isOpen={activeModal === 'achievements'}
        onClose={closeModal}
        onSave={saveAchievements}
        profile={profile}
        saving={saving}
      />
    </AuthenticatedLayout>
  );
}