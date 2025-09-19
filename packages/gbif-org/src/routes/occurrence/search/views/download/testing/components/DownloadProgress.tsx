import React, { useState, useEffect } from 'react';
import {
  Check,
  Download,
  Mail,
  Clock,
  FileText,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <IconComponent size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isComplete ? 'Download Complete!' : 'Processing Your Download'}
            </h1>
            <p className="text-gray-600">
              {isComplete
                ? 'Your data is ready for download'
                : 'Please keep this page open while we prepare your data'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Processing Progress</h3>
              <span className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              {isComplete ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check size={16} />
                  <span className="font-medium">Processing complete</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-blue-600">
                    <RefreshCw size={16} className="animate-spin" />
                    <span className="font-medium">{currentStage.label}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">
                    {timeRemaining > 0
                      ? `~${formatTime(timeRemaining)} remaining`
                      : 'Finishing up...'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stage Progress */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Processing Stages</h3>
            <div className="space-y-4">
              {stages.map((stageItem, index) => {
                const isActive = stageItem.id === stage;
                const isCompleted = index < currentStageIndex || isComplete;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stageItem.id} className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={16} />
                      ) : isCurrent ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          isCompleted
                            ? 'text-green-700'
                            : isCurrent
                            ? 'text-blue-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {stageItem.label}
                      </h4>
                      <p className="text-sm text-gray-600">{stageItem.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Download Ready */}
          {isComplete && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                  <Download size={24} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">Your Download is Ready!</h3>
                  <p className="text-green-800 text-sm mb-4">
                    We've successfully processed your {selectedFormat.title} download. The file is
                    now available for download and will remain accessible for 3 months.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <Download size={16} />
                      Download File ({selectedFormat.size})
                    </button>
                    <button className="border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                      <ExternalLink size={16} />
                      View Metadata
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Email Notification */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Email Notification</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {isComplete
                    ? 'A download confirmation has been sent to your email address with the download link and citation information.'
                    : "We'll send you an email notification when your download is ready. You can safely close this page."}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={14} />
                  <span>user@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Download Details</h3>

            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Download ID:</span>
                <span className="font-mono text-xs">{downloadId}</span>
              </div>
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
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium">{selectedFormat.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {isComplete && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                  <Check size={14} />
                  Ready for Download
                </div>
                <p className="text-green-600 text-xs">
                  Link expires:{' '}
                  {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={onStartOver}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Start New Download
              </button>

              {!isComplete && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                  <AlertCircle size={12} />
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
