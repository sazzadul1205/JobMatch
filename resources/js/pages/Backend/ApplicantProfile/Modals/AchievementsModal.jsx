import { useState } from 'react';
import Swal from 'sweetalert2';
import {
  FaPlus,
  FaTrophy,
  FaAward,
  FaStar,
  FaTrashAlt,
  FaMedal,
  FaCertificate,
  FaRegStar,
  FaSpinner
} from 'react-icons/fa';
import { MdEmojiEvents, MdVerified } from 'react-icons/md';
import { GiAchievement, GiMedalSkull } from 'react-icons/gi';
import Modal from './Modal';

const AchievementsModal = ({ isOpen, onClose, profile }) => {
  const [saving, setSaving] = useState(false);
  const [modalData, setModalData] = useState({
    achievements: profile?.achievements?.map(ach => ({
      id: ach.id || null,
      achievement_name: ach.achievement_name || '',
      achievement_details: ach.achievement_details || '',
      to_delete: false
    })) || [],
  });

  const addAchievement = () => {
    setModalData({
      ...modalData,
      achievements: [
        ...modalData.achievements,
        {
          id: null,
          achievement_name: '',
          achievement_details: '',
          to_delete: false
        }
      ]
    });
  };

  const updateAchievement = (index, field, value) => {
    const updatedAchievements = [...modalData.achievements];
    updatedAchievements[index][field] = value;
    setModalData({ ...modalData, achievements: updatedAchievements });
  };

  const removeAchievement = (index) => {
    const updatedAchievements = [...modalData.achievements];
    if (updatedAchievements[index].id) {
      updatedAchievements[index].to_delete = true;
    } else {
      updatedAchievements.splice(index, 1);
    }
    setModalData({ ...modalData, achievements: updatedAchievements });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/backend/applicant/profile/${profile.id}/achievements`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          achievements: modalData.achievements
        })
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
        window.location.reload();
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

  const getAchievementIcon = (title) => {
    if (title?.toLowerCase().includes('certificate') || title?.toLowerCase().includes('certified')) {
      return <FaCertificate className="h-4 w-4 text-purple-500" />;
    }
    if (title?.toLowerCase().includes('award') || title?.toLowerCase().includes('winner')) {
      return <FaMedal className="h-4 w-4 text-yellow-500" />;
    }
    if (title?.toLowerCase().includes('competition')) {
      return <MdEmojiEvents className="h-4 w-4 text-orange-500" />;
    }
    return <FaStar className="h-4 w-4 text-yellow-500" />;
  };

  if (!isOpen) return null;

  const activeAchievements = modalData.achievements.filter(ach => !ach.to_delete);

  return (
    <Modal title="Edit Achievements & Certifications" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GiAchievement className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Achievements & Certifications</h2>
              <p className="text-sm text-gray-500 mt-1">Showcase your accomplishments</p>
            </div>
          </div>
        </div>

        {activeAchievements.length === 0 && (
          <div className="text-center py-12 bg-linear-to-b from-gray-50 to-gray-100 rounded-xl">
            <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 shadow-md flex items-center justify-center">
              <GiMedalSkull className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No achievements added yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your certifications, awards, or accomplishments</p>
          </div>
        )}

        {activeAchievements.map((achievement, index) => (
          <div key={achievement.id} className="border border-gray-200 rounded-xl p-5 relative hover:shadow-lg transition-all duration-200 bg-white">
            <button
              onClick={() => removeAchievement(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <FaTrashAlt className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-100">
              <FaTrophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-600">Achievement #{index + 1}</span>
              {achievement.achievement_name && (
                <span className="ml-2 flex items-center gap-1">
                  {getAchievementIcon(achievement.achievement_name)}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <FaAward className="h-4 w-4 text-gray-400" />
                  Achievement / Certification Title
                </span>
              </label>
              <input
                type="text"
                value={achievement.achievement_name}
                onChange={(e) => updateAchievement(index, 'achievement_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Certified Scrum Master, Best Employee Award 2024, Google IT Certification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <MdVerified className="h-4 w-4 text-gray-400" />
                  Details
                </span>
              </label>
              <textarea
                value={achievement.achievement_details}
                onChange={(e) => updateAchievement(index, 'achievement_details', e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Describe your achievement, certification, or award. Include issuing organization, date, and any relevant details..."
              />
            </div>

            {(achievement.achievement_name || achievement.achievement_details) && (
              <div className="mt-4 p-3 bg-linear-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <FaRegStar className="h-3 w-3 text-yellow-500" />
                  Preview:
                </p>
                {achievement.achievement_name && (
                  <p className="text-sm font-semibold text-gray-800">
                    🏆 {achievement.achievement_name}
                  </p>
                )}
                {achievement.achievement_details && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {achievement.achievement_details}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addAchievement}
          disabled={activeAchievements.length >= 3}
          className={`w-full py-3.5 border-2 border-dashed rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium
            ${activeAchievements.length >= 3 ? 'border-gray-200 text-gray-400 cursor-not-allowed hover:border-gray-200 hover:text-gray-400 hover:bg-white' : 'border-gray-300'}`}
        >
          <FaPlus className="h-5 w-5" />
          Add Achievement / Certification
        </button>

        {activeAchievements.length > 0 && (
          <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center justify-center gap-2">
              <FaTrophy className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-gray-600">
                Add all your achievements, certifications, awards, and recognitions to stand out to employers.
              </p>
            </div>
          </div>
        )}

        {activeAchievements.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
              <FaStar className="h-3 w-3 text-yellow-500" />
              Example achievements you can add:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <FaCertificate className="h-3 w-3 text-purple-500" />
                <span>Certified Scrum Master (CSM)</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMedal className="h-3 w-3 text-yellow-500" />
                <span>Employee of the Month</span>
              </div>
              <div className="flex items-center gap-1">
                <MdEmojiEvents className="h-3 w-3 text-orange-500" />
                <span>Hackathon Winner 2023</span>
              </div>
              <div className="flex items-center gap-1">
                <FaAward className="h-3 w-3 text-green-500" />
                <span>AWS Certified Solutions Architect</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AchievementsModal;
