// pages/jobs/create/components/StepIndicator.jsx

import { FiCheck } from 'react-icons/fi';
import * as Icons from 'react-icons/fi';

const StepIndicator = ({ currentStep, steps }) => {
  const getIcon = (iconName) => {
    const Icon = Icons[iconName];
    return Icon || Icons.FiBriefcase;
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const StepIcon = getIcon(step.icon);
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex-1 relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${currentStep > step.number ? 'bg-indigo-600 w-full' : 'w-0'
                      }`}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${isActive
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-200'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {isCompleted ? <FiCheck size={16} /> : step.number}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${isActive
                        ? 'text-indigo-600'
                        : isCompleted
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;