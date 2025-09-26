import { FaCheck, FaCog, FaFileAlt, FaDownload, FaFilter } from 'react-icons/fa';
import { ComponentType } from 'react';

export interface Step {
  id: number;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}

export const downloadSteps: Step[] = [
  // { id: 0, name: 'Filters', icon: FaFilter, description: 'Apply quality filters' },
  { id: 1, name: 'Format', icon: FaCog, description: 'Choose download format' }, // FaFileAlt
  { id: 2, name: 'Configure', icon: FaCog, description: 'Set options and fields' },
  // { id: 3, name: 'Terms', icon: FaFileAlt, description: 'Accept terms and conditions' },
  { id: 3, name: 'Download', icon: FaDownload, description: 'Processing and delivery' },
];

interface StepIndicatorProps {
  currentStep: number;
  steps?: Step[];
}

export default function StepIndicator({ currentStep, steps = downloadSteps }: StepIndicatorProps) {
  return (
    <div className="g-mb-12">
      <nav aria-label="Progress">
        <ol className="g-flex g-items-center g-justify-center">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const IconComponent = step.icon;

            return (
              <li
                key={step.id}
                className={`g-relative ${stepIdx !== steps.length - 1 ? 'g-pr-8 sm:g-pr-20' : ''}`}
              >
                {stepIdx !== steps.length - 1 && (
                  <div className="g-absolute g-inset-0 g-flex g-items-center" aria-hidden="true">
                    <div
                      className={`g-h-0.5 g-w-full ${
                        isCompleted ? 'g-bg-primary-600' : 'g-bg-gray-200'
                      }`}
                    />
                  </div>
                )}
                <div className="g-relative g-flex g-items-center g-justify-center">
                  <div
                    className={`g-flex g-h-10 g-w-10 g-items-center g-justify-center g-rounded-full g-border-2 ${
                      isCompleted
                        ? 'g-border-primary-600 g-bg-primary-600'
                        : isCurrent
                        ? 'g-border-primary-600 g-bg-white'
                        : 'g-border-gray-300 g-bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="g-h-5 g-w-5 g-text-white" />
                    ) : (
                      <IconComponent
                        className={`g-h-5 g-w-5 ${
                          isCurrent ? 'g-text-primary-600' : 'g-text-gray-500'
                        }`}
                      />
                    )}
                  </div>
                  <div className="g-absolute g-top-12 g-text-center">
                    <div
                      className={`g-text-sm g-font-medium ${
                        isCurrent
                          ? 'g-text-primary-600'
                          : isCompleted
                          ? 'g-text-primary-600'
                          : 'g-text-gray-500'
                      }`}
                    >
                      {step.name}
                    </div>
                    {/* <div className="g-text-xs g-text-gray-500 g-mt-1 g-hidden sm:g-block">
                      {step.description}
                    </div> */}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
