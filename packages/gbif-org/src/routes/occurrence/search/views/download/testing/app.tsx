import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import QualityFilters from './components/QualityFilters';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import DownloadProgress from './components/DownloadProgress';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [qualityFilters, setQualityFilters] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [configuration, setConfiguration] = useState(null);

  const handleFiltersComplete = (filters: any) => {
    setQualityFilters(filters);
    setCurrentStep(2);
  };

  const handleFormatSelect = (format: any) => {
    setSelectedFormat(format);
    setCurrentStep(3);
  };

  const handleConfigurationComplete = (config: any) => {
    setConfiguration(config);
    setCurrentStep(4);
  };

  const handleTermsAccept = () => {
    setCurrentStep(5);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setQualityFilters(null);
    setSelectedFormat(null);
    setConfiguration(null);
  };

  const handleBackToFilters = () => {
    setCurrentStep(1);
  };

  const handleBackToFormat = () => {
    setCurrentStep(2);
  };

  const handleBackToConfiguration = () => {
    setCurrentStep(3);
  };

  return (
    <div className="g-min-h-screen g-bg-gradient-to-br g-from-slate-50 g-to-slate-100 g-py-8 g-px-4">
      <div className="g-max-w-6xl g-mx-auto">
        {/* Header */}
        <div className="g-text-center g-mb-8">
          <h1 className="g-text-3xl g-font-bold g-text-gray-900 g-mb-3">GBIF Download Options</h1>
          <p className="g-text-gray-600 g-max-w-2xl g-mx-auto">
            Choose the format that best suits your research needs. Each option provides different
            levels of data completeness and processing.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        {currentStep === 1 && <FormatSelection onFormatSelect={handleFormatSelect} />}

        {currentStep === 2 && selectedFormat && (
          <ConfigurationStep
            selectedFormat={selectedFormat}
            onBack={handleBackToFormat}
            onContinue={handleConfigurationComplete}
          />
        )}

        {currentStep === 3 && selectedFormat && configuration && (
          <TermsStep
            selectedFormat={selectedFormat}
            configuration={configuration}
            onBack={handleBackToConfiguration}
            onAccept={handleTermsAccept}
          />
        )}

        {currentStep === 4 && selectedFormat && configuration && (
          <DownloadProgress
            selectedFormat={selectedFormat}
            configuration={configuration}
            onStartOver={handleStartOver}
          />
        )}

        {/* Footer */}
        {currentStep === 2 && (
          <div className="g-text-center g-mt-8">
            <p className="g-text-gray-600 g-text-sm">
              All downloads are provided in tab-delimited CSV format for compatibility with Excel
              and other analysis tools. Darwin Core Archive format follows international
              biodiversity data standards and allows for extension selection in the next step.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
