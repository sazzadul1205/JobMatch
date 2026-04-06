// resources/js/components/JobListingSteps/StepNavigation.jsx

import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaPen } from 'react-icons/fa';

export const StepNavigation = ({
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  isReviewStep = false,
  isEdit = false
}) => {
  return (
    <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 ${currentStep === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        <FaChevronLeft size={14} />
        Previous
      </button>

      {isReviewStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg ${isEdit
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isEdit ? 'Updating...' : 'Posting...'}
            </>
          ) : (
            <>
              {isEdit ? <FaPen size={16} /> : <FaCheckCircle size={16} />}
              {isEdit ? 'Update Job' : 'Post Job'}
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          Next
          <FaChevronRight size={14} />
        </button>
      )}
    </div>
  );
};