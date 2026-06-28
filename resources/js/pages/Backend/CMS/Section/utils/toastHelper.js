// resources/js/pages/Backend/CMS/Section/utils/toastHelper.js

/**
 * Toast Helper - Notification system using SweetAlert2
 * Features:
 * - Toast notifications with auto-dismiss
 * - Position top-right
 * - Progress bar
 * - Hover to pause timer
 * - Custom styling for better UX
 */

import Swal from 'sweetalert2';

/**
 * Show a toast notification
 * @param {string} icon - 'success', 'error', 'warning', 'info'
 * @param {string} title - Notification title
 * @param {string} text - Notification description (optional)
 * @param {number} timer - Duration in milliseconds (default: 3000)
 */
export const showToast = (icon, title, text = '', timer = 3000) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      // Pause timer on hover
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    customClass: {
      popup: '!rounded-xl !shadow-2xl',
      title: '!text-sm !font-semibold',
      htmlContainer: '!text-xs !text-gray-600',
    }
  });

  Toast.fire({
    icon,
    title,
    text,
  });
};

/**
 * Show a confirmation dialog with SweetAlert2
 * @param {Object} options - Configuration options
 * @returns {Promise} - Swal result
 */
export const showConfirmDialog = (options = {}) => {
  const defaultOptions = {
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-xl',
      title: 'text-lg font-semibold',
      htmlContainer: 'text-sm',
      confirmButton: 'px-4 py-2 rounded-lg',
      cancelButton: 'px-4 py-2 rounded-lg',
    },
  };

  return Swal.fire({
    ...defaultOptions,
    ...options,
  });
};

/**
 * Show a success toast
 */
export const showSuccessToast = (title, text = '', timer = 3000) => {
  showToast('success', title, text, timer);
};

/**
 * Show an error toast
 */
export const showErrorToast = (title, text = '', timer = 4000) => {
  showToast('error', title, text, timer);
};

/**
 * Show a warning toast
 */
export const showWarningToast = (title, text = '', timer = 3000) => {
  showToast('warning', title, text, timer);
};

/**
 * Show an info toast
 */
export const showInfoToast = (title, text = '', timer = 3000) => {
  showToast('info', title, text, timer);
};