// pages/auth/Steps/ReviewPage.jsx

// Icons
import {
  FaCheckCircle,
  FaUser,
  FaFileAlt,
  FaTrophy,
  FaEdit,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeartbeat,
  FaBuilding,
  FaCalendarDay,
  FaLink,
  FaStar,
  FaRegStar,
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from 'react-icons/fa';
import { GiSuitcase, GiAchievement } from 'react-icons/gi';
import { MdWork, MdSchool } from 'react-icons/md';

const ReviewPage = ({ data, onEditStep }) => {
  const formatDate = (date) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString();
  };

  const formatSocialLinks = (links) => {
    if (!links || Object.keys(links).length === 0) return 'No social links provided';
    return Object.entries(links).map(([key, value]) => {
      let icon = <FaLink className="h-3 w-3 text-gray-400" />;
      if (key === 'linkedin') icon = <FaLinkedin className="h-3 w-3 text-blue-600" />;
      if (key === 'github') icon = <FaGithub className="h-3 w-3 text-gray-800" />;
      if (key === 'twitter') icon = <FaTwitter className="h-3 w-3 text-blue-400" />;

      return (
        <div key={key} className="text-sm flex items-center gap-2">
          {icon}
          <span className="font-medium capitalize">{key}:</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {value}
          </a>
        </div>
      );
    });
  };

  const SectionHeader = ({ icon: Icon, title, step, color = "blue" }) => (
    <div className="bg-linear-to-r from-gray-50 to-gray-100 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className={`p-1.5 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-5 w-5 text-${color}-600`} />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <button
        onClick={() => onEditStep(step)}
        className="text-blue-600 hover:text-blue-800 flex items-center text-sm transition-colors duration-200"
      >
        <FaEdit className="h-3.5 w-3.5 mr-1" />
        Edit
      </button>
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div>
      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="text-sm text-gray-900">{value || 'Not provided'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-3">
          <FaCheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-600 mt-1">Please review all information before submitting</p>
      </div>

      {/* Basic Information Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={FaUser} title="Basic Information" step={0} color="blue" />
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Full Name" value={`${data.first_name} ${data.last_name}`.trim()} icon={FaUser} />
            <InfoRow label="Phone" value={data.phone} icon={FaPhone} />
            <InfoRow label="Birth Date" value={formatDate(data.birth_date)} icon={FaCalendarAlt} />
            <InfoRow label="Gender" value={data.gender} icon={FaUser} />
            <InfoRow label="Blood Type" value={data.blood_type} icon={FaHeartbeat} />
            <InfoRow label="Address" value={data.address} icon={FaMapMarkerAlt} />
          </div>
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={MdWork} title="Professional Information" step={1} color="purple" />
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Years of Experience" value={data.experience_years} icon={MdWork} />
            <InfoRow label="Current Job Title" value={data.current_job_title} icon={MdWork} />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <FaLink className="h-3 w-3" />
              Social Links
            </p>
            <div className="space-y-1">{formatSocialLinks(data.social_links)}</div>
          </div>
        </div>
      </div>

      {/* CV Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={FaFileAlt} title="CV/Resume" step={2} color="green" />
        <div className="px-6 py-4">
          {data.cvs.length === 0 ? (
            <p className="text-gray-500 text-sm">No CV uploaded yet</p>
          ) : (
            <div className="space-y-2">
              {data.cvs.map((cv, index) => (
                <div key={cv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {cv.type === 'application/pdf' ? (
                      <FaFilePdf className="h-5 w-5 text-red-500" />
                    ) : (
                      <FaFileWord className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-700">{cv.original_name}</span>
                      <p className="text-xs text-gray-400">
                        {(cv.size / 1024).toFixed(1)} KB • {cv.upload_date ? new Date(cv.upload_date).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  {cv.is_primary && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      <FaStar className="h-3 w-3" />
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={GiSuitcase} title="Work Experience" step={3} color="orange" />
        <div className="px-6 py-4">
          {data.job_histories.length === 0 ? (
            <p className="text-gray-500 text-sm">No work experience added</p>
          ) : (
            <div className="space-y-4">
              {data.job_histories.map((job, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">{job.position}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <FaBuilding className="h-3 w-3" />
                        {job.company_name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                      <FaCalendarDay className="h-3 w-3" />
                      {job.starting_year} - {job.is_current ? 'Present' : (job.ending_year || 'Present')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={MdSchool} title="Education" step={4} color="indigo" />
        <div className="px-6 py-4">
          {data.education_histories.length === 0 ? (
            <p className="text-gray-500 text-sm">No education added</p>
          ) : (
            <div className="space-y-4">
              {data.education_histories.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 pb-3 border-b last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{edu.degree || 'Degree not specified'}</p>
                    <p className="text-sm text-gray-600">{edu.institution_name}</p>
                  </div>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Passed: {edu.passing_year}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <SectionHeader icon={GiAchievement} title="Achievements & Certifications" step={5} color="yellow" />
        <div className="px-6 py-4">
          {data.achievements.length === 0 ? (
            <p className="text-gray-500 text-sm">No achievements added</p>
          ) : (
            <div className="space-y-3">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="p-3 bg-linear-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <FaTrophy className="h-4 w-4 text-yellow-600" />
                    {achievement.achievement_name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 ml-6">{achievement.achievement_details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Warning Notice */}
      <div className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-center justify-center gap-2">
          <FaRegStar className="h-5 w-5 text-yellow-600" />
          <p className="text-sm text-yellow-800">
            ⚠️ Please review all information carefully. You can still edit your profile after submission.
          </p>
        </div>
      </div>

      {/* Completion Status */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Profile Completion Status</span>
          </div>
          <div className="text-sm text-gray-600">
            {data.cvs.length > 0 ? '✅ CV uploaded' : '❌ No CV'}
            {' • '}
            {data.job_histories.length > 0 || data.education_histories.length > 0 ? '✅ Experience added' : '❌ No experience'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
