import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicLink } from '@/reactRouterPlugins';
import { FaChevronLeft } from 'react-icons/fa';
import { formatFileSize, getEstimatedSizeInBytes } from './utils';

interface Format {
  id: string;
  title: string;
  hasNextStep?: boolean;
  description: string;
  estimateSize: boolean;
  features: string[];
}

interface FormatSelectionProps {
  onFormatSelect: (format: Format, estimatedSizeInBytes: number) => void;
  onBack?: () => void;
  totalRecords?: number;
  loadingCounts?: boolean;
}

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
  return (
    <div className="g-max-w-4xl g-mx-auto g-space-y-4">
      {/* Back Button */}
      {onBack && (
        <div className="g-mb-4">
          <button
            onClick={onBack}
            className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
          >
            <FaChevronLeft size={20} />
            Back to filter
          </button>
        </div>
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
                          <h3
                            className="g-text-base g-font-bold g-text-gray-900 g-cursor-pointer hover:g-text-primary-600 g-transition-colors"
                            onClick={() =>
                              onFormatSelect(
                                format,
                                getEstimatedSizeInBytes(format.id, totalRecords)
                              )
                            }
                          >
                            {format.title}
                          </h3>
                        </div>
                        {loadingCounts && (
                          <Skeleton className="g-text-sm g-mb-2 g-block g-w-36">Loading</Skeleton>
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
                        <Button
                          size="default"
                          onClick={() =>
                            onFormatSelect(format, getEstimatedSizeInBytes(format.id, totalRecords))
                          }
                        >
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
