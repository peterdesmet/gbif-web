import React, { useContext, useState } from 'react';
import StepIndicator from './components/StepIndicator';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import DownloadProgress from './components/DownloadProgress';
import QualityFilters from './components/QualityFilters';
import { FilterContext } from '@/contexts/filter';
import { useConfig } from '@/config/config';

function App() {
  const currentFilterContext = useContext(FilterContext);
  const siteConfig = useConfig();
  const selectedChecklist =
    currentFilterContext.filter.checklistKey ?? siteConfig.defaultChecklistKey;
  return <DownloadFlow defaultChecklist={selectedChecklist} />;
}

function DownloadFlow({ defaultChecklist }: { defaultChecklist: string }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedFormat, setSelectedFormat] = useState({
    id: 'SIMPLE_CSV',
    title: 'Occurrence sdkfjh ',
  }); // just for testing. should be null initially
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
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-6xl g-mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Step Content */}
        {currentStep === 0 && <QualityFilters onContinue={handleFilterSelect} />}

        {currentStep === 1 && (
          <FormatSelection
            onFormatSelect={handleFormatSelect}
            onQuickDownload={handleQuickDownload}
            totalRecords={3500000000}
            // onBack={handleBackToFilters}
          />
        )}

        {currentStep === 2 && selectedFormat && (
          <ConfigurationStep
            defaultChecklist={defaultChecklist}
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
