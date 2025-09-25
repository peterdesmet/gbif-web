import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  FaChevronLeft,
  FaFileAlt,
  FaCheck,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaDownload,
  FaClock,
} from 'react-icons/fa';

interface TermsStepProps {
  qualityFilters: any;
  selectedFormat: any;
  configuration: any;
  onBack: () => void;
  onAccept: () => void;
}

export default function TermsStep({
  qualityFilters,
  selectedFormat,
  configuration,
  onBack,
  onAccept,
}: TermsStepProps) {
  const [acceptedTerms, setAcceptedTerms] = useState({
    dataUse: false,
    attribution: false,
    // privacy: false,
    // processing: false,
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const handleTermChange = (term: keyof typeof acceptedTerms) => {
    setAcceptedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-8">
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          Back to configuration
        </button>

        {/* <div className="g-flex g-items-center g-gap-4 g-mb-6">
          <div className="g-p-3 g-bg-primary-100 g-rounded">
            <IconComponent size={24} className="g-text-primary-600" />
          </div>
          <div>
            <h1 className="g-text-2xl g-font-bold g-text-gray-900">Terms and Conditions</h1>
            <p className="g-text-gray-600">Please review and accept the terms before downloading</p>
          </div>
        </div> */}
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Terms Content */}
        <div className="lg:g-col-span-2 g-space-y-6">
          {/* Data Use Agreement */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <input
                    type="checkbox"
                    id="dataUse"
                    checked={acceptedTerms.dataUse}
                    onChange={() => handleTermChange('dataUse')}
                    className="g-h-5 g-w-5 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="dataUse"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
                    <FaFileAlt size={18} className="g-text-primary-600" />
                    Data Use Agreement
                  </label>
                  <div className="g-text-sm g-text-gray-700 g-space-y-2">
                    <p>By downloading this data, you agree to:</p>
                    <ul className="g-list-disc g-list-inside g-space-y-1 g-ml-4">
                      <li>
                        Use the data for legitimate scientific, educational, or conservation
                        purposes
                      </li>
                      <li>Not redistribute the raw data without proper attribution</li>
                      <li>Respect any additional restrictions specified by data publishers</li>
                      <li>
                        Acknowledge that data quality may vary and verify critical information
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attribution Requirements */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <input
                    type="checkbox"
                    id="attribution"
                    checked={acceptedTerms.attribution}
                    onChange={() => handleTermChange('attribution')}
                    className="g-h-5 g-w-5 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="attribution"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
                    <FaExternalLinkAlt size={18} className="g-text-primary-600" />
                    Attribution Requirements
                  </label>
                  <div className="g-text-sm g-text-gray-700 g-space-y-2">
                    <p>When using this data in publications or presentations, you must:</p>
                    <ul className="g-list-disc g-list-inside g-space-y-1 g-ml-4">
                      <li>Cite GBIF as the data source with the download DOI</li>
                      <li>Acknowledge the original data publishers</li>
                      <li>Include the download date and dataset size in your methods</li>
                      <li>
                        Consider co-authorship for significant data contributors when appropriate
                      </li>
                    </ul>
                    <div className="g-bg-gray-50 g-p-3 g-rounded g-mt-3">
                      <p className="g-font-medium g-text-gray-900 g-mb-1">
                        Suggested citation format:
                      </p>
                      <p className="g-text-xs g-text-gray-600 g-font-mono">
                        GBIF.org ({new Date().getFullYear()}) GBIF Occurrence Download
                        https://doi.org/10.15468/dl.xxxxxx accessed via GBIF.org on{' '}
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy and Data Protection */}
          {/* <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={acceptedTerms.privacy}
                    onChange={() => handleTermChange('privacy')}
                    className="g-h-5 g-w-5 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="privacy"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
                    <FaExclamationTriangle size={18} className="g-text-amber-600" />
                    Privacy and Sensitive Data
                  </label>
                  <div className="g-text-sm g-text-gray-700 g-space-y-2">
                    <p>Please be aware that:</p>
                    <ul className="g-list-disc g-list-inside g-space-y-1 g-ml-4">
                      <li>
                        Some records may contain precise locality information for sensitive species
                      </li>
                      <li>
                        You are responsible for handling sensitive location data appropriately
                      </li>
                      <li>
                        Do not publish precise coordinates for endangered or commercially valuable
                        species
                      </li>
                      <li>
                        Respect local regulations and indigenous rights regarding biodiversity data
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Processing Agreement */}
          {/* <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <input
                    type="checkbox"
                    id="processing"
                    checked={acceptedTerms.processing}
                    onChange={() => handleTermChange('processing')}
                    className="g-h-5 g-w-5 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="processing"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
                    <FaClock size={18} className="g-text-primary-600" />
                    Processing and Delivery
                  </label>
                  <div className="g-text-sm g-text-gray-700 g-space-y-2">
                    <p>I understand that:</p>
                    <ul className="g-list-disc g-list-inside g-space-y-1 g-ml-4">
                      <li>Large downloads may take several hours to process</li>
                      <li>I will receive an email notification when the download is ready</li>
                      <li>Download links will expire after 3 months</li>
                      <li>Processing may fail for very large requests and require adjustment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Summary</h3>

            <div className="g-space-y-3 g-text-sm g-mb-6">
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Format:</span>
                <span className="g-font-medium">{selectedFormat.title}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Taxonomy:</span>
                <span className="g-font-medium">{configuration?.taxonomy?.toUpperCase() ?? 'GBIF'}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Extensions:</span>
                <span className="g-font-medium">{configuration?.extensions?.length ?? 0}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Est. Size:</span>
                <span className="g-font-medium">{selectedFormat.size}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Processing:</span>
                <span className="g-font-medium">
                  {selectedFormat.technicalSpecs['Processing Time']}
                </span>
              </div>
            </div>

            <div className="g-space-y-3 g-mb-6">
              <h4 className="g-font-medium g-text-gray-900">Terms Status</h4>
              {Object.entries(acceptedTerms).map(([key, accepted]) => (
                <div key={key} className="g-flex g-items-center g-gap-2 g-text-sm">
                  {accepted ? (
                    <FaCheck size={16} className="g-text-green-600" />
                  ) : (
                    <div className="g-w-4 g-h-4 g-border-2 g-border-gray-300 g-rounded"></div>
                  )}
                  <span className={accepted ? 'g-text-green-700' : 'g-text-gray-600'}>
                    {key === 'dataUse' && 'Data Use Agreement'}
                    {key === 'attribution' && 'Attribution Requirements'}
                    {key === 'privacy' && 'Privacy & Sensitive Data'}
                    {key === 'processing' && 'Processing & Delivery'}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={onAccept}
              disabled={!allTermsAccepted}
              className={`g-w-full g-flex g-items-center g-justify-center g-gap-2`}
            >
              <FaDownload size={16} />
              {allTermsAccepted ? 'Start Download' : 'Accept All Terms'}
            </Button>

            {!allTermsAccepted && (
              <p className="g-text-xs g-text-gray-500 g-text-center g-mt-2">
                Please accept all terms to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
