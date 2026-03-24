// pages/jobs/edit.jsx

import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout';
import { FiArrowLeft, FiChevronRight, FiChevronLeft, FiSave } from 'react-icons/fi';

// Import components from create folder (reusing them)
import StepIndicator from './create/components/StepIndicator';
import Step1BasicInfo from './create/components/Step1BasicInfo';
import Step2JobDetails from './create/components/Step2JobDetails';
import Step3Settings from './create/components/Step3Settings';
import Step4Review from './create/components/Step4Review';

// Import utilities
import { validateStep1, validateStep2, validateStep3 } from './create/utils/validators';
import { STEPS } from './create/constants';

const EditJob = ({ job, jobTypes, categories, experienceLevels }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [keywordList, setKeywordList] = useState(job.keywords || []);
  const [benefitsList, setBenefitsList] = useState(job.benefits || []);

  // Parse location for Step1BasicInfo component
  const parseLocationForComponent = (locationString) => {
    if (!locationString) return {
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    };

    const parts = locationString.split(',');
    return {
      address_line1: parts[0]?.trim() || '',
      address_line2: '',
      city: parts[1]?.trim() || '',
      state: parts[2]?.trim() || '',
      postal_code: '',
      country: parts[3]?.trim() || ''
    };
  };

  const { data, setData, put, processing, errors, reset } = useForm({
    title: job.title || '',
    description: job.description || '',
    requirements: job.requirements || '',
    location: job.location || '',
    salary_range: job.salary_range || '',
    job_type: job.job_type || '',
    category: job.category || '',
    experience_level: job.experience_level || '',
    keywords: job.keywords || [],
    keywordInput: '',
    application_deadline: job.application_deadline ? new Date(job.application_deadline).toISOString().split('T')[0] : '',
    is_active: job.is_active ?? true,
    benefits: job.benefits || [],
    benefitInput: '',
    remote_policy: job.remote_policy || '',
    work_hours: job.work_hours || '',
    company_name: job.company_name || '',
    company_website: job.company_website || '',
    contact_email: job.contact_email || '',
    contact_phone: job.contact_phone || ''
  });

  // Initialize location parts for Step1BasicInfo
  const [locationParts, setLocationParts] = useState(parseLocationForComponent(job.location));
  const [showDetailedAddress, setShowDetailedAddress] = useState(!!locationParts.address_line1);
  const [salaryType, setSalaryType] = useState(
    data.salary_range && data.salary_range.includes(' - ') ? 'range' : 'single'
  );

  // Add keyword to list
  const addKeyword = () => {
    if (data.keywordInput.trim() && !keywordList.includes(data.keywordInput.trim())) {
      const newKeywords = [...keywordList, data.keywordInput.trim()];
      setKeywordList(newKeywords);
      setData('keywords', newKeywords);
      setData('keywordInput', '');
    }
  };

  // Remove keyword from list
  const removeKeyword = (keywordToRemove) => {
    const newKeywords = keywordList.filter(k => k !== keywordToRemove);
    setKeywordList(newKeywords);
    setData('keywords', newKeywords);
  };

  // Add benefit
  const addBenefit = () => {
    if (data.benefitInput.trim() && !benefitsList.includes(data.benefitInput.trim())) {
      const newBenefits = [...benefitsList, data.benefitInput.trim()];
      setBenefitsList(newBenefits);
      setData('benefits', newBenefits);
      setData('benefitInput', '');
    }
  };

  // Remove benefit
  const removeBenefit = (benefitToRemove) => {
    const newBenefits = benefitsList.filter(b => b !== benefitToRemove);
    setBenefitsList(newBenefits);
    setData('benefits', newBenefits);
  };

  // Handle Enter key for keywords
  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // Handle Enter key for benefits
  const handleBenefitKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addBenefit();
    }
  };

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

    return Object.keys(stepErrors).length === 0;
  };

  // Next step handler
  const handleNextStep = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('backend.listing.update', job.id));
  };

  return (
    <AuthenticatedLayout>
      <Head title={`Edit ${job.title}`} />

      <div className="py-6 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={route('backend.listing.show', job.id)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Job Details
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Job: {job.title}</h1>
          <p className="text-gray-600 mt-1">Update your job listing information</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Step Content - Using the same components as create page */}
          {currentStep === 1 && (
            <Step1BasicInfo
              data={data}
              setData={setData}
              errors={errors}
              jobTypes={jobTypes}
              categories={categories}
              experienceLevels={experienceLevels}
              // Pass the location state for the component to use
              externalLocationParts={locationParts}
              externalShowDetailedAddress={showDetailedAddress}
              externalSalaryType={salaryType}
              onLocationPartsChange={setLocationParts}
              onShowDetailedAddressChange={setShowDetailedAddress}
              onSalaryTypeChange={setSalaryType}
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
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Update Job
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

export default EditJob;