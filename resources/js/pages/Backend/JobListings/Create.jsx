// resources/js/pages/Backend/JobListings/Create.jsx

import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout';

// Icons
import { FaArrowLeft, FaBriefcase } from 'react-icons/fa';

// Step Components
import { ReviewStep } from '../../../components/JobListingSteps/ReviewStep';
import { LocationStep } from '../../../components/JobListingSteps/LocationStep';
import { BasicInfoStep } from '../../../components/JobListingSteps/BasicInfoStep';
import { StepIndicator } from '../../../components/JobListingSteps/StepIndicator';
import { PublishingStep } from '../../../components/JobListingSteps/PublishingStep';
import { StepNavigation } from '../../../components/JobListingSteps/StepNavigation';
import { RequirementsStep } from '../../../components/JobListingSteps/RequirementsStep';
import { CompensationStep } from '../../../components/JobListingSteps/CompensationStep';

// SweetAlert
import Swal from 'sweetalert2';

export default function Create({ categories, locations }) {
  // Make categories and locations available globally for child components
  if (typeof window !== 'undefined') {
    window.categories = categories;
    window.locations = locations;
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Basic Info', component: BasicInfoStep },
    { id: 2, title: 'Requirements', component: RequirementsStep },
    { id: 3, title: 'Location', component: LocationStep },
    { id: 4, title: 'Compensation', component: CompensationStep },
    { id: 5, title: 'Publishing', component: PublishingStep },
    { id: 6, title: 'Review', component: ReviewStep },
  ];

  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    category_id: '',
    job_type: '',
    experience_level: '',
    description: '',

    // Requirements
    requirements: '',
    skills: [],
    responsibilities: [],
    benefits: [],
    education_requirement: '',
    education_details: '',

    // Location
    location_ids: [],

    // Compensation
    salary_min: '',
    salary_max: '',
    is_salary_negotiable: false,
    as_per_companies_policy: false,
    keywords: [],

    // Publishing
    application_deadline: '',
    publish_at: '',
    is_active: true,
    required_linkedin_link: false,
    required_facebook_link: false,
  });

  // Check if form has any data entered
  const hasFormData = () => {
    return (
      formData.title ||
      formData.category_id ||
      formData.job_type ||
      formData.experience_level ||
      formData.description ||
      formData.requirements ||
      formData.skills.length > 0 ||
      formData.responsibilities.length > 0 ||
      formData.location_ids.length > 0
    );
  };

  // Handle back button click with confirmation if data exists
  const handleBackToListings = () => {
    if (hasFormData()) {
      Swal.fire({
        title: 'Discard changes?',
        text: 'You have entered information that will be lost if you leave. Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, discard',
        cancelButtonText: 'Stay',
      }).then((result) => {
        if (result.isConfirmed) {
          router.visit(route('backend.listing.index'));
        }
      });
    } else {
      router.visit(route('backend.listing.index'));
    }
  };

  // Validate current step
  const validateStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!formData.title || formData.title.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        }
        if (!formData.category_id) {
          newErrors.category_id = 'Please select a category';
        }
        if (!formData.job_type) {
          newErrors.job_type = 'Please select a job type';
        }
        if (!formData.experience_level) {
          newErrors.experience_level = 'Please select an experience level';
        }
        if (!formData.description || formData.description.replace(/<[^>]*>/g, '').trim().length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        }
        break;

      case 2: // Requirements
        if (!formData.requirements || formData.requirements.replace(/<[^>]*>/g, '').trim().length < 50) {
          newErrors.requirements = 'Requirements must be at least 50 characters';
        }
        if (formData.skills.length === 0) {
          newErrors.skills = 'Please add at least one required skill';
        }
        if (formData.responsibilities.length === 0) {
          newErrors.responsibilities = 'Please add at least one responsibility';
        }
        break;

      case 3: // Location
        if (formData.location_ids.length === 0) {
          newErrors.location_ids = 'Please select at least one location';
        }
        break;

      case 4: // Compensation
        if (formData.salary_min && formData.salary_max && parseFloat(formData.salary_max) < parseFloat(formData.salary_min)) {
          newErrors.salary_max = 'Maximum salary must be greater than or equal to minimum salary';
        }
        break;

      case 5: // Publishing
        if (!formData.application_deadline) {
          newErrors.application_deadline = 'Please set an application deadline';
        }
        break;

      case 6: // Review - Always valid if we got here
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors before proceeding.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to a specific step (for review page editing)
  const navigateToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final submission - ONLY called when user clicks "Post Job" on review page
  const handleSubmit = () => {
    // Prepare data for submission
    const submitData = {
      ...formData,
      salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
    };

    Swal.fire({
      title: 'Post Job Listing?',
      html: `
        <div class="text-left">
          <p class="mb-2">Are you sure you want to post this job?</p>
          <ul class="list-disc list-inside text-sm text-gray-600">
            <li>The job will be visible to applicants</li>
            <li>You can edit or deactivate it later</li>
            <li>Applications will start coming in once posted</li>
          </ul>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Post Job',
      cancelButtonText: 'Review Again',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);

        router.post(route('backend.listing.store'), submitData, {
          preserveScroll: true,
          onSuccess: () => {
            Swal.fire({
              icon: 'success',
              title: 'Job Posted!',
              html: `
                <p>Your job listing has been posted successfully.</p>
                <p class="text-sm text-gray-500 mt-2">Candidates can now apply.</p>
              `,
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              router.visit(route('backend.listing.index'));
            });
          },
          onError: (error) => {
            console.error('Submission error:', error);

            // Handle validation errors from server
            if (error.response?.data?.errors) {
              setErrors(error.response.data.errors);
              // Navigate back to first step to show errors
              setCurrentStep(1);
              Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please check the form for errors.',
                confirmButtonColor: '#2563eb',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error.response?.data?.message || 'Failed to post job listing. Please try again.',
                confirmButtonColor: '#2563eb',
              });
            }
            setIsSubmitting(false);
          },
          onFinish: () => {
            setIsSubmitting(false);
          },
        });
      }
    });
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  // Check if current step is the review step to customize button text
  const isReviewStep = currentStep === steps.length;

  // Custom submit handler for review step
  const handleStepSubmit = () => {
    if (isReviewStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Create Job Listing" />

      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto ">
          {/* Header */}
          <div className="mx-auto flex justify-center items-center gap-5">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <FaBriefcase className="w-8 h-8 text-white" />
            </div>

            {/* Header Content */}
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Create Job Listing
              </h1>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Fill in the details below to post a new job opportunity and find the perfect candidate
              </p>
            </div>
          </div>


          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Step Indicator */}
            <div className="border-b border-gray-100 bg-gray-50/50 px-8 pt-6">
              <StepIndicator currentStep={currentStep} steps={steps} />
            </div>

            {/* Form Content */}
            <div className="px-8 py-8">
              <CurrentStepComponent
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleArrayChange={handleArrayChange}
                setFormData={setFormData}
                locations={locations}
                categories={categories}
                onNavigateToStep={navigateToStep}
              />
            </div>

            {/* Navigation */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-6">
              <StepNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                onNext={handleStepSubmit}
                onPrevious={previousStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isValid={true}
                isReviewStep={isReviewStep}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}