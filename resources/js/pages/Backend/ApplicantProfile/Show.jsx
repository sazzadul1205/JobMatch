// resources/js/pages/Backend/ApplicantProfile/Show.jsx

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
  FaExclamationTriangle
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

export default function Show({ profile }) {
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
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
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        router.delete(route('backend.applicant.profile.destroy', profile.id), {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your profile has been deleted. You can restore it from the profile page.',
              timer: 2000,
              showConfirmButton: false
            });
            setDeleting(false);
            router.reload();
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete profile. Please try again.',
            });
            setDeleting(false);
          }
        });
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
    }).then((result) => {
      if (result.isConfirmed) {
        setRestoring(true);
        router.post(route('backend.applicant.profile.restore', profile.user_id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Your profile has been restored successfully.',
              timer: 1500,
              showConfirmButton: false
            });
            setRestoring(false);
            router.reload();
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to restore profile. Please try again.',
            });
            setRestoring(false);
          }
        });
      }
    });
  };

  // If no profile exists (never created)
  if (!profile) {
    return (
      <AuthenticatedLayout>
        <Head title="My Profile" />

        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className=" w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUserCircle className="text-gray-400 text-5xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't created a profile yet. Create one to apply for jobs and manage your applications.
              </p>
              <Link
                href={route('backend.applicant.profile.create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <FaPlusCircle size={18} />
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Show profile details
  const age = calculateAge(profile?.birth_date);

  return (
    <AuthenticatedLayout>
      <Head title={`${profile.first_name} ${profile.last_name} - Profile`} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <div className="flex gap-3">
              {isDeleted ? (
                <button
                  onClick={handleRestore}
                  disabled={restoring}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
                >
                  {restoring ? <FaSpinner className="animate-spin" size={16} /> : <FaTrashRestore size={16} />}
                  Restore Profile
                </button>
              ) : (
                <>
                  <Link
                    href={route('backend.applicant.profile.edit', profile.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    <FaEdit size={16} />
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
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
                <div className="shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This profile has been deleted. You can restore it to continue using your profile.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${isDeleted ? 'opacity-75' : ''}`}>
            {/* Cover Photo / Header */}
            <div className={`h-32 ${isDeleted ? 'bg-gray-400' : 'bg-linear-to-r from-blue-600 to-blue-700'}`}></div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Profile Photo */}
              <div className="flex justify-center -mt-16 mb-4">
                {profile.photo_path && !isDeleted ? (
                  <img
                    src={`/storage/${profile.photo_path}`}
                    alt={profile.full_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-gray-400 text-5xl" />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
                <p className="text-gray-500 text-sm mt-1">Job Seeker</p>
                {isDeleted && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                    Deleted
                  </span>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                  <FaIdCard className="text-blue-600" size={18} />
                  <div>
                    <p className="text-xs text-gray-500">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* CV Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume / CV</h3>
                {profile.cv_path && !isDeleted ? (
                  <a
                    href={route('backend.applicant.profile.download-cv', profile.id)}
                    className="inline-flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all duration-200"
                  >
                    <FaFilePdf size={20} />
                    <span>Download CV</span>
                  </a>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {isDeleted ? 'CV not available for deleted profile.' : 'No CV uploaded yet. Edit your profile to add one.'}
                  </p>
                )}
              </div>

              {/* Applications Section */}
              {profile.applications && profile.applications.length > 0 && !isDeleted && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">My Applications</h3>
                  <div className="space-y-3">
                    {profile.applications.slice(0, 5).map((application) => (
                      <Link
                        key={application.id}
                        href={route('backend.application.show', application.id)}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{application.job_listing?.title}</p>
                            <p className="text-sm text-gray-500">
                              Applied: {formatDate(application.created_at)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                            }`}>
                            {application.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {profile.applications.length > 5 && (
                      <Link
                        href={route('backend.application.index')}
                        className="block text-center text-blue-600 hover:text-blue-700 text-sm mt-2"
                      >
                        View all {profile.applications.length} applications →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}