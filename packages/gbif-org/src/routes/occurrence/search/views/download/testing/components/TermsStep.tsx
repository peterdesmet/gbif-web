import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useCallback, useState } from 'react';
import { FaChevronLeft, FaCheck, FaDownload } from 'react-icons/fa';
import { generateCubeSql } from './cubeService';
import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { DownloadSummary } from './DownloadSummary';
import { getEstimatedSizeInBytes } from './utils';

interface TermsStepProps {
  predicate?: any;
  sql?: string;
  selectedFormat: any;
  configuration: any;
  totalRecords?: number;
  onBack: () => void;
}

export default function TermsStep({
  predicate,
  sql,
  selectedFormat,
  configuration,
  totalRecords,
  onBack,
}: TermsStepProps) {
  // Hardcoded flag to show large download warning - replace with actual logic later
  const estimatedSizeInBytes = getEstimatedSizeInBytes(selectedFormat.id, totalRecords ?? 0);
  const isLargeDownload = totalRecords ? estimatedSizeInBytes > 500_000_000 : false;
  const [preparingDownload, setPreparingDownload] = useState(false);
  const [error, setError] = useState(null);
  const { checklists, loading } = useSupportedChecklists();
  const [acceptedTerms, setAcceptedTerms] = useState({
    dataUse: false,
    ...(isLargeDownload && { largeDownload: false }),
  });

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const handleDownload = useCallback(async () => {
    // if it is a cube, then refresh it in case the filters have changed
    setPreparingDownload(true);
    if (configuration.cube) {
      const result = await generateCubeSql(configuration.cube, predicate);
      console.log(result);
      if (!result.sql) {
        alert('Error generating SQL'); // TODO inform the user and do not proceed. instead allow the user to try again.
        return;
      }
      console.log('Download initiated with configuration:', {
        selectedFormat,
        configuration,
        predicate,
      });
      setPreparingDownload(false);
    } else {
      console.log('Download initiated with configuration:', {
        selectedFormat,
        configuration,
        predicate,
      });
      setPreparingDownload(false);
    }
  }, [configuration, predicate, selectedFormat]);

  const handleTermChange = (term: AcceptedTerm) => {
    setAcceptedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-4">
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
        <pre>
          {JSON.stringify(
            {
              totalRecords,
              estimatedSizeInBytes,
              selectedFormat,
              configuration,
              predicate,
              sql,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Terms Content */}
        <div className="lg:g-col-span-2 g-space-y-6">
          {/* Data Use Agreement */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <div className="g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-mt-1">
                  <Checkbox
                    id="dataUse"
                    checked={acceptedTerms.dataUse}
                    onCheckedChange={() => handleTermChange('dataUse')}
                    className="g-h-5 g-w-5"
                  />
                </div>
                <div className="g-flex-1">
                  <label
                    htmlFor="dataUse"
                    className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                  >
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

          {/* Large Download Warning - Conditional */}
          {isLargeDownload && (
            <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
              <div className="g-p-6">
                <div className="g-flex g-items-start g-gap-4">
                  <div className="g-flex-shrink-0 g-mt-1">
                    <Checkbox
                      id="largeDownload"
                      checked={acceptedTerms.largeDownload || false}
                      onCheckedChange={() => handleTermChange('largeDownload')}
                      className="g-h-5 g-w-5"
                    />
                  </div>
                  <div className="g-flex-1">
                    <label
                      htmlFor="largeDownload"
                      className="g-flex g-items-center g-gap-2 g-font-semibold g-text-gray-900 g-mb-2 g-cursor-pointer"
                    >
                      Large Download Acknowledgment
                    </label>
                    <div className="g-text-sm g-text-gray-700 g-space-y-3">
                      <p>
                        <strong>The estimated size of this download is 1 TB.</strong> On a 50 Mb/s
                        internet connection, this would take 57 hours to download.
                      </p>
                      <p>
                        Once you have downloaded the file, you will need approximately{' '}
                        <strong>6 TB of free disk space</strong> to unzip the data.
                      </p>
                      <p>
                        The dataset has <strong>3,509,434,147 data rows</strong>.
                      </p>
                      <p>
                        You will not be able to view or analyse the data in Excel or similar
                        applications. A dataset of this size is difficult to analyse on an ordinary
                        computer. You will probably need access to a distributed computing service
                        or 'Big Data' tools.
                      </p>
                      <div className="g-mt-4 g-p-3 g-bg-gray-50 g-border g-border-gray-200 g-rounded">
                        <p className="g-text-sm g-font-medium g-text-gray-900">
                          Please check the box above to acknowledge that you understand these risks
                          and have access to suitable tools for handling this large dataset.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Summary</h3>

            <DownloadSummary selectedFormat={selectedFormat} configuration={configuration} />

            <div className="g-space-y-3 g-mb-6 g-mt-6">
              <h4 className="g-font-medium g-text-gray-900">Terms Status</h4>
              <Term
                label="Data Use Agreement"
                termKey="dataUse"
                accepted={acceptedTerms.dataUse}
                handleTermChange={handleTermChange}
              />
              {isLargeDownload && (
                <Term
                  label="Large Download Acknowledgment"
                  termKey="largeDownload"
                  accepted={acceptedTerms.largeDownload || false}
                  handleTermChange={handleTermChange}
                />
              )}
            </div>

            <Button
              disabled={!allTermsAccepted}
              className={`g-w-full g-flex g-items-center g-justify-center g-gap-2`}
              onClick={handleDownload}
            >
              <FaDownload size={16} />
              Create download
            </Button>

            {!allTermsAccepted && (
              <p className="g-text-xs g-text-gray-500 g-text-center g-mt-2">
                Please complete all requirements to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type AcceptedTerm = 'dataUse' | 'largeDownload';

function Term({
  termKey,
  accepted,
  handleTermChange,
  label,
}: {
  termKey: AcceptedTerm;
  accepted: boolean;
  handleTermChange: (term: AcceptedTerm) => void;
  label: string | React.ReactNode;
}) {
  return (
    <label className="g-flex g-items-start g-gap-2 g-text-sm">
      <Checkbox
        id={termKey}
        checked={accepted}
        onCheckedChange={() => handleTermChange(termKey)}
        className="'g-flex-none g-me-2 g-mt-0.5 g-h-4 g-w-4"
      />
      <span className={accepted ? 'g-text-green-700' : 'g-text-gray-600'}>{label}</span>
    </label>
  );
}
