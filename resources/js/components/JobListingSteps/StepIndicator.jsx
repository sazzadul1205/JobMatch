// resources/js/components/JobListingSteps/StepIndicator.jsx

// React
import React from 'react';

// Icons
import { FaCheck, FaBriefcase, FaInfoCircle, FaMapMarkerAlt, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';

export const StepIndicator = ({ currentStep, steps }) => {
  const getStepIcon = (stepId) => {
    const icons = {
      1: <FaBriefcase size={18} />,
      2: <FaInfoCircle size={18} />,
      3: <FaMapMarkerAlt size={18} />,
      4: <FaClipboardList size={18} />,
      5: <FaMoneyBillWave size={18} />,
    };
    return icons[stepId] || <FaBriefcase size={18} />;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {isCompleted ? <FaCheck size={20} /> : getStepIcon(stepNumber)}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    Step {stepNumber}
                  </div>
                  <div className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 relative">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${currentStep > stepNumber ? 'bg-green-500' : 'bg-transparent'
                      }`}
                    style={{ width: currentStep > stepNumber ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};