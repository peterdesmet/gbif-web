import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import React from 'react';
import { FaFileAlt, FaListUl, FaArchive, FaThLarge, FaChevronLeft } from 'react-icons/fa';

interface Format {
  id: string;
  title: string;
  hasNextStep?: boolean;
  description: string;
  estimateSize: boolean;
  features: string[];
}

interface FormatSelectionProps {
  onFormatSelect: (format: Format, config: any) => void;
  onQuickDownload?: (format: Format, config: any) => void;
  onBack?: () => void;
  totalRecords?: number;
}

// Size estimation constants from portal16
const EST_KB_DWCA = 0.355350332594235;
const EST_KB_CSV = 0.1161948717948718;
const UNZIP_FACTOR = 4.52617;

// Helper function to format file sizes
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Calculate estimated sizes based on format and record count
const getEstimatedSize = (type: string, totalRecords: number): string => {
  if (totalRecords === 0) return 'Unknown';

  let sizeKb: number;
  switch (type) {
    case 'SIMPLE_CSV':
      sizeKb = EST_KB_CSV * totalRecords * UNZIP_FACTOR;
      break;
    case 'DWCA':
      sizeKb = EST_KB_DWCA * totalRecords * UNZIP_FACTOR;
      break;
    case 'SPECIES_LIST':
      // Species list is much smaller as it's just unique species
      sizeKb = Math.min(EST_KB_CSV * totalRecords * 0.01 * UNZIP_FACTOR, 10000); // Max ~10MB
      break;
    default:
      sizeKb = 0;
  }

  return formatFileSize(sizeKb * 1024);
};

const formatCards: Format[] = [
  {
    id: 'SIMPLE_CSV',
    title: 'OCCURRENCE LIST',
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
    title: 'DARWIN CORE ARCHIVE',
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
    title: 'SPECIES LIST',
    description: 'A distinct list of species with occurrence counts.',
    estimateSize: true,
    features: ['Single CSV file', 'Interpreted data only', 'Occurrence counts'],
  },
  {
    id: 'SQL_TSV_ZIP',
    title: 'CUBE DATA',
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
  onQuickDownload,
  onBack,
  totalRecords = 0,
}: FormatSelectionProps) {
  const [configurations] = React.useState<Record<string, any>>({
    SIMPLE_CSV: { taxonomy: 'gbif' },
    SPECIES_LIST: { taxonomy: 'gbif' },
    DWCA: { taxonomy: 'gbif', extensions: [] },
    SQL_TSV_ZIP: { taxonomy: 'gbif' },
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
                        {totalRecords > 0 && format.estimateSize && (
                          <div className="g-text-sm g-text-slate-500 g-mb-2">
                            Estimated size: {getEstimatedSize(format.id, totalRecords)} unzipped
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
                        {format.id === 'SIMPLE_CSV' || format.id === 'SPECIES_LIST' ? (
                          <>
                            <Button
                              variant="ghost"
                              onClick={() => onFormatSelect(format, configurations[format.id])}
                            >
                              {/* <FiSettings className="g-inline g-mr-1" size={14} /> */}
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
                          <Button
                            size="default"
                            onClick={() => onFormatSelect(format, configurations[format.id])}
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
      {/* <div className="g-text-center g-mt-8">
        <p className="g-text-gray-600 g-text-sm">
          We also support{' '}
          <DynamicLink pageId="occurrenceDownloadSql" className="g-underline">
            SQL downloads
          </DynamicLink>
        </p>
        <p className="g-text-gray-600 g-text-sm g-mt-4">
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
        </p>
      </div> */}
    </div>
  );
}
