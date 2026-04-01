// resources/js/pages/Backend/JobListings/Edit.jsx

import { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';

// Icons
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

// Layout
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Step Components
import BasicInfoStep from './Steps/BasicInfoStep';
import JobDetailsStep from './Steps/JobDetailsStep';
import DescriptionStep from './Steps/DescriptionStep';
import SkillsStep from './Steps/SkillsStep';
import PreviewStep from './Steps/PreviewStep';

export default function Edit({ jobListing, categories, locations, errors: serverErrors }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);

  // Parse salary from stored format
  const parseSalary = (salary) => {
    if (!salary) return { salaryMode: 'single', salarySingle: '', salaryFrom: '', salaryTo: '' };

    if (salary.includes(' - ')) {
      const [from, to] = salary.split(' - ');
      return {
        salaryMode: 'range',
        salarySingle: '',
        salaryFrom: from.replace('$', '').trim(),
        salaryTo: to.replace('$', '').trim(),
      };
    } else {
      return {
        salaryMode: 'single',
        salarySingle: salary.replace('$', '').trim(),
        salaryFrom: '',
        salaryTo: '',
      };
    }
  };

  const parsedSalary = parseSalary(jobListing.salary);

  // Form state
  const [formData, setFormData] = useState({
    title: jobListing.title || '',
    category_id: jobListing.category_id || '',
    location_id: jobListing.location_id || '',
    job_type: jobListing.job_type || '',
    experience_level: jobListing.experience_level || '',
    salaryMode: parsedSalary.salaryMode,
    salarySingle: parsedSalary.salarySingle,
    salaryFrom: parsedSalary.salaryFrom,
    salaryTo: parsedSalary.salaryTo,
    education_requirement: jobListing.education_requirement || '',
    application_deadline: jobListing.application_deadline ? jobListing.application_deadline.split('T')[0] : '',
    schedule_start_date: jobListing.schedule_start_date ? jobListing.schedule_start_date.split('T')[0] : '',
    is_active: jobListing.is_active ?? true,
    show_linkedin: jobListing.show_linkedin ?? false,
    show_facebook: jobListing.show_facebook ?? false,
  });

  // Editor states
  const [description, setDescription] = useState(jobListing.description || '');
  const [requirements, setRequirements] = useState(jobListing.requirements || '');

  // Array fields - parse JSON if needed
  const [benefits, setBenefits] = useState(() => {
    if (Array.isArray(jobListing.benefits)) return jobListing.benefits;
    if (typeof jobListing.benefits === 'string') return JSON.parse(jobListing.benefits || '[]');
    return [];
  });

  const [skills, setSkills] = useState(() => {
    if (Array.isArray(jobListing.skills)) return jobListing.skills;
    if (typeof jobListing.skills === 'string') return JSON.parse(jobListing.skills || '[]');
    return [];
  });

  const [responsibilities, setResponsibilities] = useState(() => {
    if (Array.isArray(jobListing.responsibilities)) return jobListing.responsibilities;
    if (typeof jobListing.responsibilities === 'string') return JSON.parse(jobListing.responsibilities || '[]');
    return [];
  });

  const [keywords, setKeywords] = useState(() => {
    if (Array.isArray(jobListing.keywords)) return jobListing.keywords;
    if (typeof jobListing.keywords === 'string') return JSON.parse(jobListing.keywords || '[]');
    return [];
  });

  // Make categories and locations available to step components
  useEffect(() => {
    window.categories = categories;
    window.locations = locations;
  }, [categories, locations]);

  const steps = [
    { number: 1, title: 'Basic Information', component: BasicInfoStep },
    { number: 2, title: 'Job Details', component: JobDetailsStep },
    { number: 3, title: 'Description & Requirements', component: DescriptionStep },
    { number: 4, title: 'Skills & Benefits', component: SkillsStep },
    { number: 5, title: 'Preview & Submit', component: PreviewStep },
  ];

  const allErrors = { ...serverErrors, ...stepErrors };

  const validateStep = async (stepNumber) => {
    const errors = {};

    if (stepNumber === 1) {
      if (!formData.title) errors.title = 'Job title is required';
      else if (formData.title.length < 5) errors.title = 'Job title must be at least 5 characters';
      if (!formData.category_id) errors.category_id = 'Please select a category';
      if (!formData.location_id) errors.location_id = 'Please select a location';
      if (!formData.job_type) errors.job_type = 'Please select job type';
      if (!formData.experience_level) errors.experience_level = 'Please select experience level';
    }

    if (stepNumber === 2) {
      if (!formData.application_deadline) errors.application_deadline = 'Application deadline is required';
    }

    if (stepNumber === 3) {
      if (!description.trim()) errors.description = 'Job description is required';
      else if (description.trim().length < 50) errors.description = 'Job description must be at least 50 characters';
      if (!requirements.trim()) errors.requirements = 'Job requirements are required';
      else if (requirements.trim().length < 50) errors.requirements = 'Job requirements must be at least 50 characters';
    }

    if (stepNumber === 4) {
      if (skills.length === 0) errors.skills = 'At least one skill is required';
      if (responsibilities.length === 0) errors.responsibilities = 'At least one responsibility is required';
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const performSubmit = () => {
    if (isSubmitting) {
      console.warn('Blocked: already submitting');
      return;
    }

    setIsSubmitting(true);

    const salary =
      formData.salaryMode === 'single'
        ? formData.salarySingle
        : `${formData.salaryFrom} - ${formData.salaryTo}`;

    const submitData = {
      ...formData,
      salary,
      description,
      requirements,
      benefits,
      skills,
      responsibilities,
      keywords,
    };

    router.put(route('backend.listing.update', jobListing.id), submitData, {
      preserveScroll: true,
      onFinish: () => setIsSubmitting(false),
      onSuccess: () => router.get(route('backend.listing.index')),
      onError: (errors) => {
        console.error('Update failed:', errors);
        if (errors?.response?.data?.errors) {
          setStepErrors(errors.response.data.errors);
        }
      },
    });
  };

  const handleSubmit = (e) => {
    // Prevent any default form submission
    e.preventDefault();
    e.stopPropagation();

    console.log('Form submit triggered, current step:', currentStep);

    // Only submit if we're on step 5
    if (currentStep === 5) {
      performSubmit();
    } else {
      console.warn('Blocked: not on step 5');
    }

    return false;
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  // For steps 1-4, use a simple div wrapper instead of form submission
  const isPreviewStep = currentStep === 5;

  return (
    <AuthenticatedLayout>
      <Head title={`Edit Job: ${jobListing.title}`} />

      <div className="min-h-screen bg-gray-50 py-8 text-black">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <a
              href={route('backend.listing.index')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Back to Job Listings
            </a>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Job Listing</h1>
              <p className="text-gray-600 mt-1">Update the details for "{jobListing.title}"</p>
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(allErrors).length > 0 && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(allErrors).map(([field, error]) => (
                        <li key={field}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((step) => {
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex-1 text-center">
                    <div className={`
                      w-10 h-10 mx-auto rounded-full flex items-center justify-center
                      ${isActive ? 'bg-blue-600 text-white' :
                        isCompleted ? 'bg-green-500 text-white' :
                          'bg-gray-200 text-gray-500'}
                    `}>
                      {isCompleted ? <FaCheckCircle size={20} /> : step.number}
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Only use form tag for preview step, otherwise use div */}
          {isPreviewStep ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative"
            >
              <CurrentStepComponent
                formData={formData}
                setFormData={setFormData}
                description={description}
                setDescription={setDescription}
                requirements={requirements}
                setRequirements={setRequirements}
                skills={skills}
                setSkills={setSkills}
                responsibilities={responsibilities}
                setResponsibilities={setResponsibilities}
                benefits={benefits}
                setBenefits={setBenefits}
                keywords={keywords}
                setKeywords={setKeywords}
                errors={stepErrors}
                categories={categories}
                locations={locations}
                setCurrentStep={setCurrentStep}
              />

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ← Previous
                </button>

                <button
                  type="submit"
                  ref={submitButtonRef}
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <FaSpinner className="animate-spin" size={16} />}
                  <FaSave size={16} />
                  Update Job Listing
                </button>
              </div>
            </form>
          ) : (
            <div className="relative">
              <CurrentStepComponent
                formData={formData}
                setFormData={setFormData}
                description={description}
                setDescription={setDescription}
                requirements={requirements}
                setRequirements={setRequirements}
                skills={skills}
                setSkills={setSkills}
                responsibilities={responsibilities}
                setResponsibilities={setResponsibilities}
                benefits={benefits}
                setBenefits={setBenefits}
                keywords={keywords}
                setKeywords={setKeywords}
                errors={stepErrors}
                categories={categories}
                locations={locations}
                setCurrentStep={setCurrentStep}
              />

              {/* Navigation Buttons */}
              <div className="mt-6 flex justify-between">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    ← Previous
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}