import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import React from 'react';
import { FaFileAlt, FaListUl, FaArchive, FaThLarge, FaChevronLeft } from 'react-icons/fa';

interface Format {
  title: string;
  hasNextStep?: boolean;
  description: string;
  size: string;
  features: string[];
}

interface FormatSelectionProps {
  onFormatSelect: (format: Format, config: any) => void;
  onQuickDownload?: (format: Format, config: any) => void;
  onBack?: () => void;
}

const formatCards: Format[] = [
  {
    title: 'OCCURRENCE LIST',
    description: 'A single CSV file with standardized, interpreted occurrence data.',
    size: '417 GB',
    features: [
      'Single CSV file',
      'Interpreted data only',
      'Coordinates (if available)',
      'Individual occurrences',
    ],
  },
  {
    title: 'DARWIN CORE ARCHIVE',
    hasNextStep: true,
    description:
      'Multiple files (core, raw values, interpreted data, extensions) for detailed or specialized use. The download can be customized by selecting specific extensions.',
    size: '1 TB',
    features: [
      'Multiple csv files',
      'Raw + interpreted data',
      'Multimedia links',
      'Coordinates (if available)',
      'Individual occurrences',
    ],
  },
  {
    title: 'SPECIES LIST',
    description: 'A distinct list of species with occurrence counts.',
    size: '2 MB',
    features: ['Single CSV file', 'Interpreted data only', 'Occurrence counts'],
  },
  {
    title: 'CUBE DATA',
    hasNextStep: true,
    description:
      'Gridded occurrence counts by taxonomic, spatial and temporal dimensions. Dimensions and aggregations can be configured in the next step.',
    size: 'Compressed',
    features: [
      'Single CSV file',
      'Interpreted data only',
      'Coordinates (if selected)',
      'Occurrence counts',
    ],
  },
];

export default function FormatSelection({
  onFormatSelect,
  onQuickDownload,
  onBack,
}: FormatSelectionProps) {
  const [configurations] = React.useState<Record<string, any>>({
    'OCCURRENCE LIST': { taxonomy: 'gbif' },
    'SPECIES LIST': { taxonomy: 'gbif' },
    'DARWIN CORE ARCHIVE': { taxonomy: 'gbif', extensions: [] },
    'CUBE DATA': { taxonomy: 'gbif' },
  });

  return (
    <div className="g-max-w-4xl g-mx-auto g-space-y-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-6 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          Back to quality filters
        </button>
      )}

      <Card className="g-rounded-lg">
        {formatCards.map((format) => {
          return (
            <div
              key={format.title}
              className={`g-border-b g-overflow-hidden g-border-gray-200 last:g-border-0`}
            >
              {/* Main Card Content */}
              <div className="g-p-6">
                <div className="g-flex g-items-center g-justify-between">
                  <div className="g-flex-1">
                    <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-end lg:g-justify-between g-gap-4">
                      <div className="g-flex-1">
                        <div className="g-flex g-items-center g-gap-3 g-mb-1">
                          <h3 className="g-text-base g-font-bold g-text-gray-900">
                            {format.title}
                          </h3>
                          <span className="g-text-sm g-text-gray-500 g-bg-gray-100 g-px-2 g-py-1 g-rounded">
                            {format.size}
                          </span>
                        </div>
                        <p className="g-text-gray-600 g-text-sm g-mb-3">{format.description}</p>

                        {/* Compact Features */}
                        <div className="g-flex g-flex-wrap g-gap-2">
                          {format.features.map((feature, index) => (
                            <span
                              key={index}
                              className="g-inline-flex g-items-center g-gap-1 g-text-xs g-bg-gray-50 g-text-gray-700 g-px-2 g-py-1 g-rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="g-flex g-flex-col g-items-stretch g-gap-3">
                        {format.title === 'OCCURRENCE LIST' || format.title === 'SPECIES LIST' ? (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => onFormatSelect(format, configurations[format.title])}
                            >
                              {/* <FiSettings className="g-inline g-mr-1" size={14} /> */}
                              Configure
                            </Button>
                            <Button
                              size="default"
                              onClick={() =>
                                onQuickDownload?.(format, configurations[format.title])
                              }
                            >
                              Download
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="default"
                            onClick={() => onFormatSelect(format, configurations[format.title])}
                          >
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
      <div className="g-text-center g-mt-8">
        <p className="g-text-gray-600 g-text-sm">
          We also support{' '}
          <DynamicLink pageId="occurrenceDownloadSql" className="g-underline">
            SQL downloads
          </DynamicLink>
        </p>
        <p className="g-text-gray-600 g-text-sm g-mt-4">
          Not sure which format to choose? Try this{' '}
          <span className="g-underline">example archive</span> or{' '}
          <span className="g-underline">read more</span>.
        </p>
      </div>
    </div>
  );
}
