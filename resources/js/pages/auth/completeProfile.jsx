// pages/auth/completeProfile.jsx

// React
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';

// sweetalert2
import Swal from 'sweetalert2';

// Icons
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaRedoAlt,
  FaSpinner,
  FaUserCheck,
  FaFileAlt,
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaEye,
  FaUser
} from 'react-icons/fa';
import { MdWork } from 'react-icons/md';

// Step Components
import CVUpload from './Steps/CVUpload';
import Education from './Steps/Education';
import BasicInfo from './Steps/BasicInfo';
import ReviewPage from './Steps/ReviewPage';
import Achievements from './Steps/Achievements';
import WorkExperience from './Steps/WorkExperience';
import ProfessionalInfo from './Steps/ProfessionalInfo';

const CompleteProfile = ({ applicantProfile = null }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const { data, setData, post, processing, errors } = useForm({
    // Basic Info
    first_name: applicantProfile?.first_name || '',
    last_name: applicantProfile?.last_name || '',
    birth_date: applicantProfile?.birth_date || '',
    gender: applicantProfile?.gender || '',
    blood_type: applicantProfile?.blood_type || '',
    phone: applicantProfile?.phone || '',
    address: applicantProfile?.address || '',
    photo: null,

    // Professional Info
    experience_years: applicantProfile?.experience_years || '',
    current_job_title: applicantProfile?.current_job_title || '',
    social_links: applicantProfile?.social_links || {},

    // CVs
    cvs: applicantProfile?.cvs || [],

    // Job History
    job_histories: applicantProfile?.job_histories || [],

    // Education
    education_histories: applicantProfile?.education_histories || [],

    // Achievements
    achievements: applicantProfile?.achievements || [],
  });

  useEffect(() => {
    const nextData = {
      first_name: applicantProfile?.first_name || '',
      last_name: applicantProfile?.last_name || '',
      birth_date: applicantProfile?.birth_date || '',
      gender: applicantProfile?.gender || '',
      blood_type: applicantProfile?.blood_type || '',
      phone: applicantProfile?.phone || '',
      address: applicantProfile?.address || '',
      photo: null,
      experience_years: applicantProfile?.experience_years || '',
      current_job_title: applicantProfile?.current_job_title || '',
      social_links: applicantProfile?.social_links || {},
      cvs: applicantProfile?.cvs || [],
      job_histories: applicantProfile?.job_histories || [],
      education_histories: applicantProfile?.education_histories || [],
      achievements: applicantProfile?.achievements || [],
    };

    Object.entries(nextData).forEach(([key, value]) => {
      setData(key, value);
    });
  }, [applicantProfile?.id]);

  const steps = [
    { name: 'Basic Info', component: BasicInfo, icon: FaUser },
    { name: 'Professional', component: ProfessionalInfo, icon: MdWork },
    { name: 'CV Upload', component: CVUpload, icon: FaFileAlt },
    { name: 'Work Experience', component: WorkExperience, icon: FaBriefcase },
    { name: 'Education', component: Education, icon: FaGraduationCap },
    { name: 'Achievements', component: Achievements, icon: FaTrophy },
    { name: 'Review', component: ReviewPage, icon: FaEye },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleEditStep = (stepIndex) => {
    setCurrentStep(stepIndex);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    Swal.fire({
      title: 'Submit Profile?',
      html: `
      <div class="text-left">
        <p class="text-gray-700">Are you sure you want to submit your profile?</p>
        <p class="text-sm text-gray-500 mt-3 pt-2 border-t border-gray-100">
          <span class="flex items-center gap-1">📄 Your CVs are already uploaded.</span>
          <span class="flex items-center gap-1 mt-1">✏️ You can still edit your profile later from your dashboard.</span>
        </p>
      </div>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, submit my profile!',
      cancelButtonText: 'No, go back',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'px-5 py-2 text-sm font-medium',
        cancelButton: 'px-5 py-2 text-sm font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (!data.first_name || !data.last_name || !data.phone) {
          Swal.fire({
            icon: 'error',
            title: 'Missing Required Info',
            text: 'Please fill in First Name, Last Name, and Phone before submitting.',
            confirmButtonColor: '#ef4444',
          });
          return;
        }
        post('/profile/complete', {
          transform: (payload) => ({
            ...payload,
            cvs: [], // CVs are uploaded immediately via /profile/cv
          }),
          forceFormData: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Profile Submitted!',
              html: `
              <div class="text-center">
                <div class="flex justify-center mb-3">
                  <div class="p-3 bg-green-100 rounded-full">
                    <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <p class="text-gray-700">Your profile has been successfully submitted!</p>
                <p class="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
              </div>
            `,
              timer: 3000,
              showConfirmButton: false,
              background: '#ffffff',
              customClass: {
                popup: 'rounded-2xl'
              }
            }).then(() => {
              router.visit('/dashboard');
            });
          },
          onError: (errors) => {
            Swal.fire({
              icon: 'error',
              title: 'Submission Failed',
              text: Object.values(errors).flat().join('\n') || 'Something went wrong. Please try again.',
              confirmButtonColor: '#ef4444',
              customClass: {
                popup: 'rounded-2xl'
              }
            });
          }
        });
      }
    });
  };

  const isReviewPage = currentStep === steps.length - 1;
  const progressPercentage = ((currentStep + 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 text-black">

      <Head title="Complete Your Profile" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center flex mx-auto items-center justify-center gap-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
            {isReviewPage ? (
              <FaEye className="h-8 w-8 text-blue-600" />
            ) : (
              <FaUserCheck className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isReviewPage ? 'Review Your Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isReviewPage
                ? 'Please review all information before submitting'
                : `Step ${currentStep + 1} of ${steps.length - 1}: ${steps[currentStep].name}`}
            </p>
          </div>
        </div>

        {/* Progress Bar - Hide on Review Page */}
        {!isReviewPage && (
          <div className="mb-8 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between mb-3">
              {steps.slice(0, -1).map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isActive = index === currentStep;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center"
                    style={{ width: `${100 / (steps.length - 1)}%` }}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                        ${!isCompleted && !isActive ? 'bg-gray-200 text-gray-500' : ''}
                      `}
                    >
                      {isCompleted ? <FaCheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-linear-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {isReviewPage ? (
            <ReviewPage data={data} onEditStep={handleEditStep} />
          ) : (
            <CurrentStepComponent
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 ">
            {!isReviewPage ? (
              <div className="flex justify-between gap-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`
                    px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                    ${currentStep === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                    }
                  `}
                >
                  <FaArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  className="ml-auto px-6 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  Next
                  <FaArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaRedoAlt className="h-4 w-4" />
                  Start Over
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={processing}
                  className="flex-1 px-6 py-2.5 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <FaSpinner className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="h-4 w-4" />
                      Submit Profile
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Optional Note */}
        {!isReviewPage && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-blue-500">✨</span>
              First name, last name, and phone are required to complete your profile.
              <span className="text-blue-500">✨</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteProfile;

