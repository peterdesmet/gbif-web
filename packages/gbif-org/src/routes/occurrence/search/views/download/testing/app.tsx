import React, { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import DownloadProgress from './components/DownloadProgress';
import QualityFilters from './components/QualityFilters';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [configuration, setConfiguration] = useState(null);

  const handleFilterSelect = (format: any) => {
    // setSelectedFormat(format);
    setCurrentStep(1);
  };

  const handleFormatSelect = (format: any, config: any) => {
    setSelectedFormat(format);
    // setConfiguration(config);
    setCurrentStep(2);
  };

  const handleQuickDownload = (format: any, config: any) => {
    setSelectedFormat(format);
    setConfiguration(config);
    setCurrentStep(3); // Skip configuration step and go straight to terms
  };

  const handleConfigurationComplete = (config: any) => {
    setConfiguration(config);
    setCurrentStep(3);
  };

  const handleTermsAccept = () => {
    setCurrentStep(4);
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setSelectedFormat(null);
    setConfiguration(null);
  };

  const handleBackToFilters = () => {
    setCurrentStep(0);
  };

  const handleBackToFormat = () => {
    setCurrentStep(1);
  };

  const handleBackToConfiguration = () => {
    setCurrentStep(2);
  };

  return (
    <div className="g-min-h-screen g-py-8 g-px-4">
      <div className="g-max-w-6xl g-mx-auto">
        {/* Header */}
        {/* <div className="g-text-center g-mb-8">
          <h1 className="g-text-3xl g-font-bold g-text-gray-900 g-mb-3">GBIF Download Options</h1>
          <p className="g-text-gray-600 g-max-w-2xl g-mx-auto">
            Choose the format that best suits your research needs. Each option provides different
            levels of data completeness and processing.
          </p>
        </div> */}

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        {currentStep === 0 && <QualityFilters onContinue={handleFilterSelect} />}

        {currentStep === 1 && (
          <FormatSelection
            onFormatSelect={handleFormatSelect}
            onQuickDownload={handleQuickDownload}
            // onBack={handleBackToFilters}
          />
        )}

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
      </div>
    </div>
  );
}

export default App;
