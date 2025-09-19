import React, { useState } from 'react';
import {
  ChevronLeft,
  FileText,
  Check,
  AlertTriangle,
  ExternalLink,
  Download,
  Clock,
} from 'lucide-react';

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
    privacy: false,
    processing: false,
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const handleTermChange = (term: keyof typeof acceptedTerms) => {
    setAcceptedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  const IconComponent = selectedFormat.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to configuration
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <IconComponent size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-gray-600">Please review and accept the terms before downloading</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Terms Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Use Agreement */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="dataUse"
                    checked={acceptedTerms.dataUse}
                    onChange={() => handleTermChange('dataUse')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="dataUse"
                    className="flex items-center gap-2 font-semibold text-gray-900 mb-2 cursor-pointer"
                  >
                    <FileText size={18} className="text-blue-600" />
                    Data Use Agreement
                  </label>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>By downloading this data, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
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
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="attribution"
                    checked={acceptedTerms.attribution}
                    onChange={() => handleTermChange('attribution')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="attribution"
                    className="flex items-center gap-2 font-semibold text-gray-900 mb-2 cursor-pointer"
                  >
                    <ExternalLink size={18} className="text-blue-600" />
                    Attribution Requirements
                  </label>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>When using this data in publications or presentations, you must:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Cite GBIF as the data source with the download DOI</li>
                      <li>Acknowledge the original data publishers</li>
                      <li>Include the download date and dataset size in your methods</li>
                      <li>
                        Consider co-authorship for significant data contributors when appropriate
                      </li>
                    </ul>
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <p className="font-medium text-gray-900 mb-1">Suggested citation format:</p>
                      <p className="text-xs text-gray-600 font-mono">
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
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={acceptedTerms.privacy}
                    onChange={() => handleTermChange('privacy')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="privacy"
                    className="flex items-center gap-2 font-semibold text-gray-900 mb-2 cursor-pointer"
                  >
                    <AlertTriangle size={18} className="text-amber-600" />
                    Privacy and Sensitive Data
                  </label>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>Please be aware that:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
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
          </div>

          {/* Processing Agreement */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="processing"
                    checked={acceptedTerms.processing}
                    onChange={() => handleTermChange('processing')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="processing"
                    className="flex items-center gap-2 font-semibold text-gray-900 mb-2 cursor-pointer"
                  >
                    <Clock size={18} className="text-blue-600" />
                    Processing and Delivery
                  </label>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>I understand that:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Large downloads may take several hours to process</li>
                      <li>I will receive an email notification when the download is ready</li>
                      <li>Download links will expire after 3 months</li>
                      <li>Processing may fail for very large requests and require adjustment</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Download Summary</h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">{selectedFormat.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fields:</span>
                <span className="font-medium">
                  {configuration.fields.core.length + configuration.fields.optional.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Est. Size:</span>
                <span className="font-medium">{selectedFormat.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Processing:</span>
                <span className="font-medium">
                  {selectedFormat.technicalSpecs['Processing Time']}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-900">Terms Status</h4>
              {Object.entries(acceptedTerms).map(([key, accepted]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {accepted ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  )}
                  <span className={accepted ? 'text-green-700' : 'text-gray-600'}>
                    {key === 'dataUse' && 'Data Use Agreement'}
                    {key === 'attribution' && 'Attribution Requirements'}
                    {key === 'privacy' && 'Privacy & Sensitive Data'}
                    {key === 'processing' && 'Processing & Delivery'}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onAccept}
              disabled={!allTermsAccepted}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                allTermsAccepted
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download size={16} />
              {allTermsAccepted ? 'Start Download' : 'Accept All Terms'}
            </button>

            {!allTermsAccepted && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Please accept all terms to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
