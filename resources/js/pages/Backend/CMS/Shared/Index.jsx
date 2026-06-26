/* eslint-disable import/order */
// resources/js/pages/Backend/CMS/Shared/Index.jsx

// React
import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';

// Layout
import AuthenticatedLayout from '../../../../layouts/AuthenticatedLayout';

// Icons
import {
  FaSpinner, FaGlobe, FaChevronDown, FaChevronUp
} from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';

// SweetAlert
import Swal from 'sweetalert2';

// Import shared components for preview
import TopBar from '../../../../components/Shared/TopBar';
import Navbar from '../../../../components/Shared/Navbar';
import Footer from '../../../../components/Shared/Footer';
import FAQSection from '../../../../Sections/FAQSection/FAQSection';
import UpcomingEventsSection from '../../../../Sections/UpcomingEventsSection/UpcomingEventsSection';

// Import Modal Editors
import TopBarEditor from './Modals/TopBarEditor';
import NavbarEditor from './Modals/NavbarEditor';
import FooterEditor from './Modals/FooterEditor';
import FaqEditor from './Modals/FaqEditor';
import EventsEditor from './Modals/EventsEditor';

export default function SharedData({ sharedData }) {
  const { flash } = usePage().props;
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Type configuration
  const typeConfig = {
    topbar: {
      label: 'Top Bar',
      icon: <FaGlobe />,
      description: 'Contact info, language selector, social links',
      component: TopBar,
      editor: TopBarEditor,
      preview: true
    },
    navbar: {
      label: 'Navigation Bar',
      icon: <FaGlobe />,
      description: 'Logo, nav links, CTA button',
      component: Navbar,
      editor: NavbarEditor,
      preview: true
    },
    footer: {
      label: 'Footer',
      icon: <FaGlobe />,
      description: 'Logo, links, social, newsletter, copyright',
      component: Footer,
      editor: FooterEditor,
      preview: true
    },
    faq: {
      label: 'FAQ Section',
      icon: <FaGlobe />,
      description: 'Frequently asked questions with answers',
      component: FAQSection,
      editor: FaqEditor,
      preview: true
    },
    'upcoming-events': {
      label: 'Upcoming Events',
      icon: <FaGlobe />,
      description: 'Events listing with dates and descriptions',
      component: UpcomingEventsSection,
      editor: EventsEditor,
      preview: true
    }
  };

  const toggleSection = (type) => {
    setExpandedSection(prev => prev === type ? null : type);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData(JSON.parse(JSON.stringify(item.data)));
    setIsUploading(false);
  };

  const closeEdit = () => {
    setEditingItem(null);
    setFormData({});
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Don't submit if uploading
    if (isUploading) {
      Swal.fire({
        icon: 'warning',
        title: 'Upload in Progress',
        text: 'Please wait for the image upload to complete.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setLoading(true);

    // eslint-disable-next-line no-undef
    router.put(route('backend.cms.shared.update', editingItem.id), {
      data: formData,
      is_active: editingItem.is_active,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        closeEdit();
      },
      onError: () => setLoading(false),
    });
  };

  // Handle nested object updates
  const updateFormData = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  // Handle array updates
  const addArrayItem = (path, template = {}) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (!Array.isArray(current[lastKey])) current[lastKey] = [];
    current[lastKey].push({ ...template, id: Date.now() });
    setFormData(newData);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current[lastKey])) {
      current[lastKey].splice(index, 1);
    }
    setFormData(newData);
  };

  useEffect(() => {
    if (flash?.success) {
      Swal.fire({ icon: 'success', title: 'Success', text: flash.success, timer: 2000, showConfirmButton: false });
    }
    if (flash?.error) {
      Swal.fire({ icon: 'error', title: 'Error', text: flash.error });
    }
  }, [flash]);

  // Get editor component
  const EditorComponent = editingItem ? typeConfig[editingItem.type]?.editor : null;

  // Determine if update button should be disabled
  const isUpdateDisabled = loading || isUploading;

  return (
    <AuthenticatedLayout>
      <Head title="CMS - Shared Data" />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shared Data</h1>
            <p className="text-sm text-gray-500">Manage shared content across the site (TopBar, Navbar, Footer, FAQ, Events)</p>
          </div>
        </div>

        {/* List of Shared Data Types */}
        <div className="space-y-4">
          {sharedData.map((item) => {
            const config = typeConfig[item.type];
            if (!config) return null;

            const isExpanded = expandedSection === item.type;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleSection(item.type)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600 text-xl">{config.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{config.label}</h3>
                      <p className="text-xs text-gray-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(item);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FaEdit size={16} />
                    </button>
                    {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                  </div>
                </div>

                {/* Preview Area */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50 w-full">
                    <div className="text-xs text-gray-400 mb-2">Preview:</div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full">
                      {config.component && config.preview && (
                        <config.component
                          {...(item.type === 'topbar' ? { topBarData: item.data } : {})}
                          {...(item.type === 'navbar' ? { navbarData: item.data } : {})}
                          {...(item.type === 'footer' ? { footerData: item.data } : {})}
                          {...(item.type === 'faq' ? { data: item.data } : {})}
                          {...(item.type === 'upcoming-events' ? { data: item.data } : {})}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          EDIT MODAL - Dynamic
          ============================================================ */}
      {editingItem && EditorComponent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">
                Edit {typeConfig[editingItem.type]?.label || editingItem.type}
              </h2>
              <button onClick={closeEdit} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <EditorComponent
                formData={formData}
                updateFormData={updateFormData}
                addArrayItem={addArrayItem}
                removeArrayItem={removeArrayItem}
                isLoading={loading}
                setIsLoading={setIsUploading}
              />

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  disabled={isUpdateDisabled}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdateDisabled}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 ${isUpdateDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? <FaSpinner className="animate-spin" size={16} /> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  {isUploading ? 'Uploading...' : loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}