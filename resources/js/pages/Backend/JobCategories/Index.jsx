// resources/js/pages/Backend/JobCategories/Index.jsx

import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaUndo,
  FaBriefcase
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// SweetAlert2
import Swal from 'sweetalert2';

export default function JobCategoriesIndex({ categories, flash }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
  });

  // Show flash messages
  if (flash?.success) {
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: flash.success,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  if (flash?.error) {
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: flash.error,
      confirmButtonColor: '#2563eb',
    });
  }

  const handleOpenCreate = () => {
    setEditing(null);
    setFormData({ name: '', is_active: true });
    setIsOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditing(cat);
    setFormData({
      name: cat.name,
      is_active: cat.is_active,
    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (editing) {
      router.put(route('backend.categories.update', editing.id), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Category has been updated successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          setIsSubmitting(false);
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: errors?.name?.[0] || 'Failed to update category. Please try again.',
            confirmButtonColor: '#2563eb',
          });
        },
      });
    } else {
      router.post(route('backend.categories.store'), formData, {
        preserveScroll: true,
        onSuccess: () => {
          setIsSubmitting(false);
          handleClose();
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'Category has been created successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        onError: (errors) => {
          setIsSubmitting(false);
          Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: errors?.name?.[0] || 'Failed to create category. Please try again.',
            confirmButtonColor: '#2563eb',
          });
        },
      });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Delete category?',
      text: 'This will move it to trash.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingId(id);

        router.delete(route('backend.categories.destroy', id), {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Category has been moved to trash.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Delete Failed',
              text: 'Failed to delete category. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setDeletingId(null),
        });
      }
    });
  };

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Restore category?',
      text: 'This will restore the category.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
    }).then((result) => {
      if (result.isConfirmed) {
        router.patch(route('backend.categories.restore', id), {}, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Restored!',
              text: 'Category has been restored successfully.',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: () => {
            Swal.fire({
              icon: 'error',
              title: 'Restore Failed',
              text: 'Failed to restore category. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
        });
      }
    });
  };

  // resources/js/pages/Backend/JobCategories/Index.jsx

  const handleToggle = (cat) => {
    Swal.fire({
      title: 'Change status?',
      text: `This will ${cat.is_active ? 'deactivate' : 'activate'} this category.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue',
    }).then((result) => {
      if (result.isConfirmed) {
        setTogglingId(cat.id);

        router.patch(route('backend.categories.toggle', cat.id), {}, {
          preserveScroll: true,
          onSuccess: (page) => {
            // Force a full page reload to get fresh data
            router.reload();

            Swal.fire({
              icon: 'success',
              title: 'Status Updated!',
              text: `Category has been ${!cat.is_active ? 'activated' : 'deactivated'}.`,
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (error) => {
            console.error('Toggle error:', error);
            Swal.fire({
              icon: 'error',
              title: 'Update Failed',
              text: 'Failed to update category status. Please try again.',
              confirmButtonColor: '#2563eb',
            });
          },
          onFinish: () => setTogglingId(null),
        });
      }
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Job categories" />

      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Job Categories
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all job categories in one place
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <FaPlus size={16} />
              Add Category
            </button>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
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
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-16">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaBriefcase className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No categories found</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
                      <div className="mt-6">
                        <button
                          onClick={handleOpenCreate}
                          className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                        >
                          <FaPlus className="mr-2" size={16} />
                          Add Category
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {categories.map((cat, index) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaBriefcase className="text-blue-600" size={14} />
                        </div>
                        <span className={`font-medium ${cat.deleted_at ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {cat.name}
                        </span>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(cat)}
                        disabled={togglingId === cat.id}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${cat.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } ${togglingId === cat.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {togglingId === cat.id ? (
                          <FaSpinner className="inline animate-spin mr-1" size={12} />
                        ) : null}
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {cat.deleted_at ? (
                          // RESTORE BUTTON
                          <button
                            onClick={() => handleRestore(cat.id)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Restore"
                          >
                            <FaUndo size={18} />
                          </button>
                        ) : (
                          <>
                            {/* EDIT BUTTON */}
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <FaEdit size={18} />
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={deletingId === cat.id}
                              className={`p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 ${deletingId === cat.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              title="Delete"
                            >
                              {deletingId === cat.id ? (
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
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in text-black">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {editing ? 'Edit Category' : 'Create Category'}
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
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Information Technology"
                    required
                    autoFocus
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  {editing ? (isSubmitting ? 'Updating...' : 'Update') : (isSubmitting ? 'Creating...' : 'Create')}
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