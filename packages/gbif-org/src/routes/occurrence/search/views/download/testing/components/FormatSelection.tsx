import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicLink } from '@/reactRouterPlugins';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

interface Format {
  id: string;
  title: string;
  hasNextStep?: boolean;
  description: string;
  estimateSize: boolean;
  features: string[];
}

interface FormatSelectionProps {
  onFormatSelect: (format: Format) => void;
  onBack?: () => void;
  totalRecords?: number;
  loadingCounts?: boolean;
}

// Size estimation constants from portal16
const EST_KB_DWCA = 0.355350332594235;
const EST_KB_CSV = 0.1161948717948718;
const UNZIP_FACTOR = 4.52617;

// Helper function to format file sizes
export const formatFileSize = (bytes: number): string => {
  if (bytes < 0) return 'Unknown';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Calculate estimated sizes based on format and record count
export const getEstimatedSizeInBytes = (type: string, totalRecords: number): number => {
  if (totalRecords === 0) return -1;

  let sizeKb: number;
  switch (type) {
    case 'SIMPLE_CSV':
      sizeKb = EST_KB_CSV * totalRecords * UNZIP_FACTOR;
      break;
    case 'DWCA':
      sizeKb = EST_KB_DWCA * totalRecords * UNZIP_FACTOR;
      break;
    case 'SPECIES_LIST':
      // Species list is much smaller as it's just unique species. Below are based on a few random downloads. But it varies a lot depending on the filters. BBetter would be to use cardinality instead of occurrence counts.
      sizeKb = Math.max(EST_KB_CSV * totalRecords * 0.0002 * UNZIP_FACTOR, 5000);
      break;
    default:
      sizeKb = -1;
  }

  return sizeKb * 1024; // Convert to bytes
};

const formatCards: Format[] = [
  {
    id: 'SIMPLE_CSV',
    title: 'Occurrence list',
    description: 'A single CSV file with standardized, interpreted occurrence data.',
    estimateSize: true,
    features: [
      'Single CSV file',
      'Interpreted data only',
      'Coordinates (if available)',
      'Individual occurrences',
    ],
  },
  {
    id: 'DWCA',
    title: 'Darwin Core Archive',
    hasNextStep: true,
    description:
      'Multiple files (core, raw values, interpreted data, extensions) for detailed or specialized use. The download can be customized by selecting specific extensions.',
    estimateSize: true,
    features: [
      'Multiple csv files',
      'Raw + interpreted data',
      'Multimedia links',
      'Coordinates (if available)',
      'Individual occurrences',
    ],
  },
  {
    id: 'SPECIES_LIST',
    title: 'Species list',
    description: 'A distinct list of species with occurrence counts.',
    estimateSize: true,
    features: ['Single CSV file', 'Interpreted data only', 'Occurrence counts'],
  },
  {
    id: 'SQL_TSV_ZIP',
    title: 'Occurrence cube',
    hasNextStep: true,
    description:
      'Gridded occurrence counts by taxonomic, spatial and temporal dimensions. Dimensions and aggregations can be configured in the next step.',
    estimateSize: false,
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
  onBack,
  totalRecords = 0,
  loadingCounts = false,
}: FormatSelectionProps) {
  const [configurations] = React.useState<Record<string, any>>({
    SIMPLE_CSV: { checklistKey: 'gbif' },
    SPECIES_LIST: { checklistKey: 'gbif' },
    DWCA: { checklistKey: 'gbif', extensions: [] },
    SQL_TSV_ZIP: { checklistKey: 'gbif' },
  });

  return (
    <div className="g-max-w-4xl g-mx-auto g-space-y-4">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          Back to filter
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
              <div className="g-p-4 md:g-p-6">
                <div className="g-flex g-items-center g-justify-between">
                  <div className="g-flex-1">
                    <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-end lg:g-justify-between g-gap-4">
                      <div className="g-flex-1">
                        <div className="g-flex g-items-center g-gap-3 g-mb-0">
                          <h3 className="g-text-base g-font-bold g-text-gray-900">
                            {format.title}
                          </h3>
                        </div>
                        {loadingCounts && (
                          <Skeleton className="g-text-sm g-text-slate-500 g-mb-2">Loading</Skeleton>
                        )}
                        {!loadingCounts && totalRecords > 0 && format.estimateSize && (
                          <div className="g-text-sm g-text-slate-500 g-mb-2">
                            Estimated size:{' '}
                            {formatFileSize(getEstimatedSizeInBytes(format.id, totalRecords))} bytes
                          </div>
                        )}
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
                        {/* {format.id === 'SIMPLE_CSV' || format.id === 'SPECIES_LIST' ? (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => onFormatSelect(format, configurations[format.id])}
                            >
                              Configure
                            </Button>
                            <Button
                              size="default"
                              onClick={() => onQuickDownload?.(format, configurations[format.id])}
                            >
                              Download
                            </Button>
                          </>
                        ) : (
                          <Button size="default" onClick={() => onFormatSelect(format)}>
                            Configure
                          </Button>
                        )} */}
                        <Button size="default" onClick={() => onFormatSelect(format)}>
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Card>
      <div className="g-mt-8">
        <p className="g-text-gray-600 g-text-sm">
          We also support{' '}
          <DynamicLink pageId="occurrenceDownloadSql" className="g-underline">
            SQL downloads
          </DynamicLink>
        </p>
        {/* <p className="g-text-gray-600 g-text-sm g-mt-4">
          Not sure which format to choose? Try this{' '}
          <span className="g-underline">example archive</span> or{' '}
          <DynamicLink
            pageId="faq"
            searchParams={{ question: 'download-formats' }}
            className="g-underline"
          >
            read more
          </DynamicLink>
          .
        </p> */}
      </div>
    </div>
  );
}
