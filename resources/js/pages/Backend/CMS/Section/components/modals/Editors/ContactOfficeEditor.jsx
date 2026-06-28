// resources/js/pages/Backend/CMS/Section/components/modals/Editors/ContactOfficeEditor.jsx

import React, { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { TextField } from './shared/Fields';

const ContactOfficeEditor = ({ section, hasData, onDataChange }) => {
  const initialData = section?.data?.data || section?.data || [];
  const [formData, setFormData] = useState(Array.isArray(initialData) ? initialData : []);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const updateArrayItem = (index, field, value) => {
    const newData = [...formData];
    if (!newData[index]) newData[index] = {};
    newData[index][field] = value;
    setFormData(newData);
  };

  const updateNestedArrayItem = (index, field, subIndex, value) => {
    const newData = [...formData];
    if (!newData[index]) newData[index] = {};
    if (!newData[index][field]) newData[index][field] = [];
    newData[index][field][subIndex] = value;
    setFormData(newData);
  };

  const addPhone = (index) => {
    const newData = [...formData];
    if (!newData[index]) newData[index] = {};
    if (!newData[index].phones) newData[index].phones = [];
    newData[index].phones.push('');
    setFormData(newData);
  };

  const removePhone = (index, phoneIndex) => {
    const newData = [...formData];
    if (newData[index] && newData[index].phones) {
      newData[index].phones.splice(phoneIndex, 1);
      setFormData(newData);
    }
  };

  const addEmail = (index) => {
    const newData = [...formData];
    if (!newData[index]) newData[index] = {};
    if (!newData[index].emails) newData[index].emails = [];
    newData[index].emails.push('');
    setFormData(newData);
  };

  const removeEmail = (index, emailIndex) => {
    const newData = [...formData];
    if (newData[index] && newData[index].emails) {
      newData[index].emails.splice(emailIndex, 1);
      setFormData(newData);
    }
  };

  const addOffice = () => {
    const newData = [...formData];
    newData.push({
      title: '',
      address: '',
      phones: [''],
      emails: [''],
      map_url: '',
      coordinates: { lat: 0, lng: 0 },
      is_active: true
    });
    setFormData(newData);
  };

  const removeOffice = (index) => {
    Swal.fire({
      title: 'Remove Office',
      text: `Are you sure you want to remove "${formData[index]?.title || 'this office'}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newData = [...formData];
        newData.splice(index, 1);
        setFormData(newData);
      }
    });
  };

  const toggleActive = (index) => {
    const newData = [...formData];
    if (newData[index]) {
      newData[index].is_active = !newData[index].is_active;
      setFormData(newData);
    }
  };

  if (!hasData || !formData || formData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Edit Contact Office Data</h3>
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">No offices added</p>
          <p className="text-xs mt-1">Click "Add Office" to create one</p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addOffice}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <FaPlus size={14} />
            Add Office
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Edit Contact Office Data ({formData.length} offices)</h3>
        <button
          type="button"
          onClick={addOffice}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs font-medium"
        >
          <FaPlus size={12} />
          Add Office
        </button>
      </div>

      <div className="space-y-4">
        {formData.map((office, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Office #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => toggleActive(index)}
                  className={`text-xs px-2 py-0.5 rounded-full transition ${office.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}
                >
                  {office.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeOffice(index)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <FaTrash size={12} /> Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <TextField
                  label="Office Title"
                  value={office.title || ''}
                  onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                  placeholder="Head Office"
                />
                <div>
                  <label className="block text-xs text-gray-400 mb-0.5">Address</label>
                  <textarea
                    value={office.address || ''}
                    onChange={(e) => updateArrayItem(index, 'address', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="24/5 Mollika, Prominent Housing, 3 Pisciculture Road, Mohammadpur, Dhaka -1207."
                  />
                </div>
                <TextField
                  label="Map URL"
                  value={office.map_url || ''}
                  onChange={(e) => updateArrayItem(index, 'map_url', e.target.value)}
                  placeholder="https://www.google.com/maps?q=23.7570,90.3620&output=embed"
                />
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-xs text-gray-400">Phone Numbers</label>
                    <button
                      type="button"
                      onClick={() => addPhone(index)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <FaPlus size={10} /> Add
                    </button>
                  </div>
                  {(office.phones || ['']).map((phone, phoneIndex) => (
                    <div key={phoneIndex} className="flex items-center gap-2 mt-1">
                      <FaPhone size={12} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={phone || ''}
                        onChange={(e) => updateNestedArrayItem(index, 'phones', phoneIndex, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="+880 1761-493412"
                      />
                      {(office.phones || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePhone(index, phoneIndex)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-xs text-gray-400">Email Addresses</label>
                    <button
                      type="button"
                      onClick={() => addEmail(index)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                    >
                      <FaPlus size={10} /> Add
                    </button>
                  </div>
                  {(office.emails || ['']).map((email, emailIndex) => (
                    <div key={emailIndex} className="flex items-center gap-2 mt-1">
                      <FaEnvelope size={12} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        value={email || ''}
                        onChange={(e) => updateNestedArrayItem(index, 'emails', emailIndex, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="dusdhaka@gmail.com"
                      />
                      {(office.emails || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmail(index, emailIndex)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={office.coordinates?.lat || ''}
                      onChange={(e) => {
                        const newData = [...formData];
                        if (!newData[index].coordinates) newData[index].coordinates = { lat: 0, lng: 0 };
                        newData[index].coordinates.lat = parseFloat(e.target.value) || 0;
                        setFormData(newData);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="23.757"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={office.coordinates?.lng || ''}
                      onChange={(e) => {
                        const newData = [...formData];
                        if (!newData[index].coordinates) newData[index].coordinates = { lat: 0, lng: 0 };
                        newData[index].coordinates.lng = parseFloat(e.target.value) || 0;
                        setFormData(newData);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="90.362"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt size={12} className="text-gray-400" />
                  <span className="truncate max-w-40">{office.address || 'No address'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaPhone size={12} className="text-gray-400" />
                  <span>{(office.phones || []).filter(p => p).length || 0} phones</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEnvelope size={12} className="text-gray-400" />
                  <span>{(office.emails || []).filter(e => e).length || 0} emails</span>
                </div>
                {office.coordinates?.lat && office.coordinates?.lng && (
                  <div className="flex items-center gap-1">
                    <FaGlobe size={12} className="text-gray-400" />
                    <span>{office.coordinates.lat}, {office.coordinates.lng}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Section ID:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.id}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Table:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_table || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Data Key:</span>
            <span className="ml-2 text-gray-700 font-mono">{section.data_key || 'None'}</span>
          </div>
          <div>
            <span className="text-gray-500">Total Offices:</span>
            <span className="ml-2 text-gray-700 font-mono">{formData.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOfficeEditor;