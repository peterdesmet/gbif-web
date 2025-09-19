import React from 'react';
import { Check, Settings, FileText, Download, Filter } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Filters', icon: Filter, description: 'Apply quality filters' },
  { id: 2, name: 'Format', icon: FileText, description: 'Choose download format' },
  { id: 3, name: 'Configure', icon: Settings, description: 'Set options and fields' },
  { id: 4, name: 'Terms', icon: FileText, description: 'Accept terms and conditions' },
  { id: 5, name: 'Download', icon: Download, description: 'Processing and delivery' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-center">
          {steps.map((step, stepIdx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const IconComponent = step.icon;

            return (
              <li
                key={step.id}
                className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
              >
                {stepIdx !== steps.length - 1 && (
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div
                      className={`h-0.5 w-full ${isCompleted ? 'bg-blue-600' : 'bg-gray-200'}`}
                    />
                  </div>
                )}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isCompleted
                        ? 'border-blue-600 bg-blue-600'
                        : isCurrent
                        ? 'border-blue-600 bg-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <IconComponent
                        className={`h-5 w-5 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                      />
                    )}
                  </div>
                  <div className="absolute top-12 text-center">
                    <div
                      className={`text-sm font-medium ${
                        isCurrent
                          ? 'text-blue-600'
                          : isCompleted
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {step.description}
                    </div>
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
