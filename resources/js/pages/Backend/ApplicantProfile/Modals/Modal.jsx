import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';

const Modal = ({ title, onClose, onSave, children, saving }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <FaTimes size={24} />
        </button>
      </div>
      <div className="p-6">{children}</div>
      <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" size={16} /> : <FaSave size={16} />}
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

export default Modal;