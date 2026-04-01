// resources/js/pages/Locations/Index.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaTimes, FaSpinner, FaUndo } from 'react-icons/fa';

// Layouts
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function LocationsIndex({ locations }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    is_active: true,
  });

  const handleOpenCreate = () => {
    setEditingLocation(null);
    setFormData({ name: '', address: '', is_active: true });
    setIsOpen(true);
  };

  const handleOpenEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address || '',
      is_active: location.is_active,
    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingLocation(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingLocation) {
      router.put(route('backend.locations.update', editingLocation.id), formData, {
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    } else {
      router.post(route('backend.locations.store'), formData, {
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('backend.locations.destroy', id), {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Location has been deleted.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text: 'Something went wrong.',
            });
          },
          onFinish: () => {
            setDeletingId(null);
          },
        });
      }
    });
  };

  const handleToggleActive = (location) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will ${location.is_active ? 'deactivate' : 'activate'} this location.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        setTogglingId(location.id);

        router.patch(route('backend.locations.toggle', location.id), {}, {
          preserveScroll: true,
          onFinish: () => setTogglingId(null),
        });
      }
    });
  };

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Restore location?',
      text: 'This will restore the location.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it',
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('backend.locations.restore', id), {}, {
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              timer: 1500,
              showConfirmButton: false,
            });
          },
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Locations" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Locations
            </h1>
            <button
              onClick={handleOpenCreate}
              className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <FaPlus size={16} />
              Add Location
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location, index) => (
                  <tr
                    key={location.id}
                    className="hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaMapMarkerAlt className="text-blue-600" size={14} />
                        </div>
                        <span className={`font-medium ${location.deleted_at ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}>
                          {location.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm max-w-xs truncate ${location.deleted_at ? 'line-through text-gray-400' : 'text-gray-500'
                        }`}>
                        {location.address || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(location)}
                        disabled={togglingId === location.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${location.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } ${togglingId === location.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {togglingId === location.id ? (
                          <FaSpinner className="inline animate-spin mr-1" size={12} />
                        ) : null}
                        {location.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">

                        {location.deleted_at ? (
                          // 🔄 RESTORE BUTTON
                          <button
                            onClick={() => handleRestore(location.id)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
                          >
                            <FaUndo size={18} />
                          </button>
                        ) : (
                          <>
                            {/* ✏️ EDIT */}
                            <button
                              onClick={() => handleOpenEdit(location)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <FaEdit size={18} />
                            </button>

                            {/* 🗑 DELETE */}
                            <button
                              onClick={() => handleDelete(location.id)}
                              disabled={deletingId === location.id}
                              className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === location.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                              {deletingId === location.id ? (
                                <FaSpinner className="animate-spin" size={18} />
                              ) : (
                                <FaTrash size={18} />
                              )}
                            </button>
                          </>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {locations.length === 0 && (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No locations</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new location.</p>
                <div className="mt-6">
                  <button
                    onClick={handleOpenCreate}
                    className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                  >
                    <FaPlus className="mr-2" size={16} />
                    Add Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in text-black">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {editingLocation ? 'Edit Location' : 'Add Location'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  {editingLocation ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Creating...' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}