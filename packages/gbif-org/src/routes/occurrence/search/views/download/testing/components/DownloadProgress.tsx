import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaDownload,
  FaEnvelope,
  FaClock,
  FaFileAlt,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaSyncAlt,
} from 'react-icons/fa';

interface DownloadProgressProps {
  qualityFilters: any;
  selectedFormat: any;
  configuration: any;
  onStartOver: () => void;
}

export default function DownloadProgress({
  qualityFilters,
  selectedFormat,
  configuration,
  onStartOver,
}: DownloadProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('preparing');
  const [downloadId] = useState(() => 'gbif-' + Math.random().toString(36).substr(2, 9));
  const [estimatedTime, setEstimatedTime] = useState(1800); // 30 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(1800);

  const stages = [
    {
      id: 'preparing',
      label: 'Preparing download',
      description: 'Validating request and allocating resources',
    },
    { id: 'querying', label: 'Querying database', description: 'Searching occurrence records' },
    {
      id: 'processing',
      label: 'Processing data',
      description: 'Applying filters and transformations',
    },
    { id: 'formatting', label: 'Formatting output', description: 'Converting to requested format' },
    { id: 'compressing', label: 'Compressing files', description: 'Creating downloadable archive' },
    {
      id: 'complete',
      label: 'Download ready',
      description: 'Your download is ready for retrieval',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + Math.random() * 2, 100);

        // Update stage based on progress
        if (newProgress < 15) setStage('preparing');
        else if (newProgress < 40) setStage('querying');
        else if (newProgress < 70) setStage('processing');
        else if (newProgress < 85) setStage('formatting');
        else if (newProgress < 100) setStage('compressing');
        else setStage('complete');

        return newProgress;
      });

      setTimeRemaining((prev) => Math.max(prev - 5, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentStageIndex = stages.findIndex((s) => s.id === stage);
  const currentStage = stages[currentStageIndex];
  const isComplete = stage === 'complete';

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const IconComponent = selectedFormat.icon;

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-8">
        <div className="g-flex g-items-center g-gap-4 g-mb-6">
          <div className="g-p-3 g-bg-primary-100 g-rounded">
            <IconComponent size={24} className="g-text-primary-600" />
          </div>
          <div>
            <h1 className="g-text-2xl g-font-bold g-text-gray-900">
              {isComplete ? 'Download Complete!' : 'Processing Your Download'}
            </h1>
            <p className="g-text-gray-600">
              {isComplete
                ? 'Your data is ready for download'
                : 'Please keep this page open while we prepare your data'}
            </p>
          </div>
        </div>
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Progress Content */}
        <div className="lg:g-col-span-2 g-space-y-6">
          {/* Progress Bar */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6">
            <div className="g-flex g-items-center g-justify-between g-mb-4">
              <h3 className="g-font-semibold g-text-gray-900">Processing Progress</h3>
              <span className="g-text-2xl g-font-bold g-text-primary-600">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="g-w-full g-bg-gray-200 g-rounded-full g-h-3 g-mb-4">
              <div
                className="g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 g-h-3 g-rounded-full g-transition-all g-duration-1000 g-ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="g-flex g-items-center g-gap-3 g-text-sm">
              {isComplete ? (
                <div className="g-flex g-items-center g-gap-2 g-text-green-600">
                  <FaCheck size={16} />
                  <span className="g-font-medium">Processing complete</span>
                </div>
              ) : (
                <>
                  <div className="g-flex g-items-center g-gap-2 g-text-primary-600">
                    <FaSyncAlt size={16} className="g-animate-spin" />
                    <span className="g-font-medium">{currentStage.label}</span>
                  </div>
                  <span className="g-text-gray-500">•</span>
                  <span className="g-text-gray-600">
                    {timeRemaining > 0
                      ? `~${formatTime(timeRemaining)} remaining`
                      : 'Finishing up...'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stage Progress */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Processing Stages</h3>
            <div className="g-space-y-4">
              {stages.map((stageItem, index) => {
                const isActive = stageItem.id === stage;
                const isCompleted = index < currentStageIndex || isComplete;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stageItem.id} className="g-flex g-items-center g-gap-4">
                    <div
                      className={`g-flex-shrink-0 g-w-8 g-h-8 g-rounded-full g-flex g-items-center g-justify-center ${
                        isCompleted
                          ? 'g-bg-green-100 g-text-green-600'
                          : isCurrent
                          ? 'g-bg-primary-100 g-text-primary-600'
                          : 'g-bg-gray-100 g-text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <FaCheck size={16} />
                      ) : isCurrent ? (
                        <FaSyncAlt size={16} className="g-animate-spin" />
                      ) : (
                        <span className="g-text-sm g-font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="g-flex-1">
                      <h4
                        className={`g-font-medium ${
                          isCompleted
                            ? 'g-text-green-700'
                            : isCurrent
                            ? 'g-text-primary-700'
                            : 'g-text-gray-500'
                        }`}
                      >
                        {stageItem.label}
                      </h4>
                      <p className="g-text-sm g-text-gray-600">{stageItem.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download Ready */}
          {isComplete && (
            <div className="g-bg-gradient-to-r g-from-green-50 g-to-green-100 g-border g-border-green-200 g-rounded g-p-6">
              <div className="g-flex g-items-start g-gap-4">
                <div className="g-flex-shrink-0 g-p-2 g-bg-green-100 g-rounded">
                  <FaDownload size={24} className="g-text-green-600" />
                </div>
                <div className="g-flex-1">
                  <h3 className="g-font-semibold g-text-green-900 g-mb-2">
                    Your Download is Ready!
                  </h3>
                  <p className="g-text-green-800 g-text-sm g-mb-4">
                    We've successfully processed your {selectedFormat.title} download. The file is
                    now available for download and will remain accessible for 3 months.
                  </p>
                  <div className="g-flex g-flex-col sm:g-flex-row g-gap-3">
                    <button className="g-bg-green-600 hover:g-bg-green-700 g-text-white g-font-semibold g-py-2 g-px-4 g-rounded g-transition-colors g-flex g-items-center g-gap-2">
                      <FaDownload size={16} />
                      Download File ({selectedFormat.size})
                    </button>
                    <button className="g-border g-border-green-600 g-text-green-600 hover:g-bg-green-50 g-font-semibold g-py-2 g-px-4 g-rounded g-transition-colors g-flex g-items-center g-gap-2">
                      <FaExternalLinkAlt size={16} />
                      View Metadata
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Notification */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6">
            <div className="g-flex g-items-start g-gap-4">
              <div className="g-flex-shrink-0 g-p-2 g-bg-primary-100 g-rounded">
                <FaEnvelope size={20} className="g-text-primary-600" />
              </div>
              <div className="g-flex-1">
                <h3 className="g-font-semibold g-text-gray-900 g-mb-2">Email Notification</h3>
                <p className="g-text-gray-600 g-text-sm g-mb-3">
                  {isComplete
                    ? 'A download confirmation has been sent to your email address with the download link and citation information.'
                    : "We'll send you an email notification when your download is ready. You can safely close this page."}
                </p>
                <div className="g-flex g-items-center g-gap-2 g-text-sm g-text-gray-500">
                  <FaEnvelope size={14} />
                  <span>user@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Details</h3>

            <div className="g-space-y-3 g-text-sm g-mb-6">
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Download ID:</span>
                <span className="g-font-mono g-text-xs">{downloadId}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Format:</span>
                <span className="g-font-medium">{selectedFormat.title}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Fields:</span>
                <span className="g-font-medium">
                  {configuration.fields.core.length + configuration.fields.optional.length}
                </span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">File Size:</span>
                <span className="g-font-medium">{selectedFormat.size}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Started:</span>
                <span className="g-font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {isComplete && (
              <div className="g-mb-6 g-p-3 g-bg-green-50 g-border g-border-green-200 g-rounded">
                <div className="g-flex g-items-center g-gap-2 g-text-green-700 g-text-sm g-font-medium g-mb-1">
                  <FaCheck size={14} />
                  Ready for Download
                </div>
                <p className="g-text-green-600 g-text-xs">
                  Link expires:{' '}
                  {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="g-space-y-3">
              <button
                onClick={onStartOver}
                className="g-w-full g-bg-gray-100 hover:g-bg-gray-200 g-text-gray-700 g-font-medium g-py-2 g-px-4 g-rounded g-transition-colors g-text-sm"
              >
                Start New Download
              </button>

              {!isComplete && (
                <div className="g-flex g-items-center g-gap-2 g-text-xs g-text-amber-700 g-bg-amber-50 g-p-2 g-rounded">
                  <FaExclamationCircle size={12} />
                  <span>Keep this page open during processing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
