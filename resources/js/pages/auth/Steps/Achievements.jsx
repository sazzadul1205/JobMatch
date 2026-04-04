import React from 'react';
import {
  FaPlus,
  FaTimes,
  FaTrophy,
  FaAward,
  FaStar,
  FaTrashAlt,
  FaMedal,
  FaCertificate,
  FaRegStar
} from 'react-icons/fa';
import { MdEmojiEvents, MdVerified } from 'react-icons/md';
import { GiAchievement, GiMedalSkull } from 'react-icons/gi';
import Swal from 'sweetalert2';

const Achievements = ({ data, setData }) => {
  const addAchievement = () => {
    setData('achievements', [
      ...data.achievements,
      {
        id: Date.now(),
        achievement_name: '',
        achievement_details: ''
      }
    ]);
  };

  const updateAchievement = (index, field, value) => {
    const updated = [...data.achievements];
    updated[index][field] = value;
    setData('achievements', updated);
  };

  const removeAchievement = (index) => {
    Swal.fire({
      title: 'Remove Achievement?',
      text: "Are you sure you want to remove this achievement or certification?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = data.achievements.filter((_, i) => i !== index);
        setData('achievements', updated);

        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Achievement has been removed.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Empty State */}
      {data.achievements.length === 0 && (
        <div className="text-center py-12 bg-linear-to-b from-gray-50 to-gray-100 rounded-xl">
          <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 shadow-md flex items-center justify-center">
            <GiMedalSkull className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No achievements added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add your certifications, awards, or accomplishments</p>
        </div>
      )}

      {/* Achievements List */}
      {data.achievements.map((achievement, index) => (
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

          {/* Preview of entered data */}
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

      {/* Add Button */}
      <button
        onClick={addAchievement}
        className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
      >
        <FaPlus className="h-5 w-5" />
        Add Achievement / Certification
      </button>

      {/* Info Notice */}
      {data.achievements.length > 0 && (
        <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
          <div className="flex items-center justify-center gap-2">
            <FaTrophy className="h-5 w-5 text-yellow-600" />
            <p className="text-sm text-gray-600">
              Add all your achievements, certifications, awards, and recognitions to stand out to employers.
            </p>
          </div>
        </div>
      )}

      {/* Examples Section when empty */}
      {data.achievements.length === 0 && (
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
  );
};

export default Achievements;