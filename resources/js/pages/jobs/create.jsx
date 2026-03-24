// pages/jobs/create.jsx

import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { FiArrowLeft, FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi';

// Import components
import StepIndicator from './create/components/StepIndicator';
import Step1BasicInfo from './create/components/Step1BasicInfo';
import Step2JobDetails from './create/components/Step2JobDetails';
import Step3Settings from './create/components/Step3Settings';
import Step4Review from './create/components/Step4Review';

// Import hooks
import { useJobForm } from './create/hooks/useJobForm';

// Import utilities
import { validateStep1, validateStep2, validateStep3 } from './create/utils/validators';
import { STEPS } from './create/constants';

const CreateJob = ({ jobTypes, categories, experienceLevels, storeUrl }) => {
  const {
    data,
    setData,
    currentStep,
    keywordList,
    benefitsList,
    processing,
    errors,
    addKeyword,
    removeKeyword,
    addBenefit,
    removeBenefit,
    handleKeywordKeyPress,
    handleBenefitKeyPress,
    nextStep,
    prevStep,
    handleSubmit
  } = useJobForm(storeUrl); // Pass the storeUrl to the hook

  // Validate current step
  const validateStep = () => {
    let stepErrors = {};

    if (currentStep === 1) {
      stepErrors = validateStep1(data);
    } else if (currentStep === 2) {
      stepErrors = validateStep2(data);
    } else if (currentStep === 3) {
      stepErrors = validateStep3(data);
    }

    const hasErrors = Object.keys(stepErrors).length > 0;

    // You could set errors state here if needed
    return !hasErrors;
  };

  // Next step handler with validation
  const handleNextStep = () => {
    if (validateStep()) {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create New Job - Step by Step" />

      <div className="py-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={route('backend.listing.index')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Post a New Job</h1>
          <p className="text-gray-600 mt-1">Follow the steps below to create your job listing</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step Content */}
          {currentStep === 1 && (
            <Step1BasicInfo
              data={data}
              setData={setData}
              errors={errors}
              jobTypes={jobTypes}
              categories={categories}
              experienceLevels={experienceLevels}
            />
          )}

          {currentStep === 2 && (
            <Step2JobDetails
              data={data}
              setData={setData}
              errors={errors}
              keywordList={keywordList}
              benefitsList={benefitsList}
              addKeyword={addKeyword}
              removeKeyword={removeKeyword}
              addBenefit={addBenefit}
              removeBenefit={removeBenefit}
              handleKeywordKeyPress={handleKeywordKeyPress}
              handleBenefitKeyPress={handleBenefitKeyPress}
            />
          )}

          {currentStep === 3 && (
            <Step3Settings
              data={data}
              setData={setData}
              errors={errors}
            />
          )}

          {currentStep === 4 && (
            <Step4Review
              data={data}
              jobTypes={jobTypes}
              categories={categories}
              experienceLevels={experienceLevels}
              keywordList={keywordList}
              benefitsList={benefitsList}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              type="button"
              onClick={handlePrevStep}
              className={`px-6 py-2 border rounded-lg transition duration-150 flex items-center gap-2 ${currentStep === 1
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              disabled={currentStep === 1}
            >
              <FiChevronLeft size={18} />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150 flex items-center gap-2"
              >
                Next Step
                <FiChevronRight size={18} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <FiCheck size={18} />
                    Publish Job
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
};

export default CreateJob;