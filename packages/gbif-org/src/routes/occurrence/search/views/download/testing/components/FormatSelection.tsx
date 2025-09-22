import { Button } from '@/components/ui/button';
import React from 'react';
import {
  FaCheck,
  FaDownload,
  FaFileAlt,
  FaListUl,
  FaArchive,
  FaThLarge,
  FaChevronDown,
  FaChevronUp,
  FaInfoCircle,
  FaBolt,
  FaShieldAlt,
  FaChevronLeft,
} from 'react-icons/fa';

interface Format {
  title: string;
  hasNextStep?: boolean;
  description: string;
  icon: any;
  size: string;
  features: string[];
  extendedFeatures: string[];
  technicalSpecs: Record<string, string>;
  rawData: boolean;
  interpretedData: boolean;
  multimedia: boolean;
  coordinates: boolean;
  estimatedSize: string;
}

interface FormatSelectionProps {
  qualityFilters: any;
  onFormatSelect: (format: Format) => void;
  onBack: () => void;
}

const formatCards: Format[] = [
  {
    title: 'SIMPLE',
    description: 'Basic occurrence data with interpreted fields only',
    icon: FaFileAlt,
    size: '417 GB',
    features: ['Interpreted data only', 'Single CSV file', 'Coordinates included'],
    extendedFeatures: [
      'Tab-delimited CSV format optimized for Excel',
      'Pre-processed and cleaned occurrence records',
      'Standardized coordinate reference system (WGS84)',
      'Quality flags and data validation indicators',
      'Optimized for statistical analysis workflows',
      'Minimal storage footprint with maximum usability',
    ],
    technicalSpecs: {
      'File Format': 'Tab-delimited CSV',
      Compression: 'ZIP (83% reduction)',
      Encoding: 'UTF-8',
      'Coordinate System': 'WGS84',
      'Processing Time': '< 30 minutes',
      'Data Fields': '~50 core fields',
    },
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: true,
    estimatedSize: '2 TB (417 GB zipped)',
  },
  {
    title: 'SPECIES LIST',
    description: 'Taxonomic checklist with occurrence counts',
    icon: FaListUl,
    size: '2 MB',
    features: ['Species aggregation', 'Occurrence counts', 'Single CSV file'],
    extendedFeatures: [
      'Species-level taxonomic aggregation with full hierarchy',
      'Occurrence count statistics by taxon',
      'Geographic and temporal occurrence summaries',
      'Taxonomic backbone integration with current names',
      'Perfect for biodiversity assessments and checklists',
      'Lightweight format for rapid analysis',
    ],
    technicalSpecs: {
      'File Format': 'Tab-delimited CSV',
      Compression: 'ZIP (95% reduction)',
      Encoding: 'UTF-8',
      'Taxonomic Levels': 'All ranks included',
      'Processing Time': '< 15 minutes',
      'Data Fields': '~20 taxonomic fields',
    },
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: false,
    estimatedSize: 'Variable',
  },
  {
    title: 'DARWIN CORE ARCHIVE',
    hasNextStep: true,
    description: 'Complete biodiversity data package with all available information',
    icon: FaArchive,
    size: '1 TB',
    features: ['Raw + interpreted data', 'Multimedia links', 'Multiple csv files'],
    extendedFeatures: [
      'Full Darwin Core Archive format compliance',
      'Customizable data extensions and vocabularies',
      'Multimedia resource links and metadata',
      'Complete provenance and attribution tracking',
      'Suitable for data republishing and preservation',
      'Machine-readable metadata and structure',
    ],
    technicalSpecs: {
      'File Format': 'Darwin Core Archive',
      Compression: 'ZIP with metadata',
      Encoding: 'UTF-8',
      Standards: 'Darwin Core, GBIF',
      'Processing Time': '1-3 hours',
      'Data Fields': '200+ possible fields',
    },
    rawData: true,
    interpretedData: true,
    multimedia: true,
    coordinates: true,
    estimatedSize: '6 TB (1 TB zipped)',
  },
  {
    title: 'CUBE DATA',
    hasNextStep: true,
    description: 'Gridded occurrence counts by taxonomic, spatial and temporal dimensions',
    icon: FaThLarge,
    size: 'Compressed',
    features: [
      'Grid aggregation',
      'Multi-dimensional',
      'Statistical summaries',
      'Customizable resolution',
    ],
    extendedFeatures: [
      'Configurable spatial grid resolution (0.1° to 10°)',
      'Temporal aggregation by year, month, or decade',
      'Taxonomic dimension breakdown to species level',
      'Statistical measures including uncertainty estimates',
      'Optimized for large-scale ecological modeling',
      'Integration with environmental data layers',
    ],
    technicalSpecs: {
      'File Format': 'Tab-delimited CSV',
      Compression: 'ZIP (99% reduction)',
      Encoding: 'UTF-8',
      'Grid Resolution': 'User configurable',
      'Processing Time': '30 minutes - 2 hours',
      Dimensions: 'Space × Time × Taxonomy',
    },
    rawData: false,
    interpretedData: true,
    multimedia: false,
    coordinates: true,
    estimatedSize: 'Variable (highly compressed)',
  },
];

export default function FormatSelection({
  qualityFilters,
  onFormatSelect,
  onBack,
}: FormatSelectionProps) {
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  return (
    <div className="g-max-w-4xl g-mx-auto g-space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-6 g-transition-colors"
      >
        <FaChevronLeft size={20} />
        Back to quality filters
      </button>

      {formatCards.map((format) => {
        const isExpanded = expandedCard === format.title;

        return (
          <div
            key={format.title}
            className={`g-relative g-bg-white g-rounded g-shadow-md g-border-2 g-transition-all g-duration-300 g-overflow-hidden g-border-gray-200`}
          >
            {/* Main Card Content */}
            <div className="g-p-6">
              <div className="g-flex g-items-center g-justify-between">
                <div className="g-flex-1">
                  <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-center lg:g-justify-between g-gap-4">
                    <div className="g-flex-1">
                      <div className="g-flex g-items-center g-gap-3 g-mb-1">
                        <h3 className="g-text-base g-font-bold g-text-gray-900">{format.title}</h3>
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
                            <FaCheck size={12} className="g-text-green-600" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="g-flex g-flex-col lg:g-flex-row g-items-stretch lg:g-items-center g-gap-3">
                      <Button size="default" onClick={() => onFormatSelect(format)}>
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Expand Action */}
            {/* <div className="g-border-t g-border-gray-100 g-bg-gray-50">
              <button
                onClick={() => toggleCard(format.title)}
                className="g-w-full g-px-6 g-py-3 g-text-sm g-font-medium g-text-gray-600 hover:g-text-gray-900 hover:g-bg-gray-100 g-transition-colors g-flex g-items-center g-justify-center g-gap-2"
              >
                {isExpanded ? (
                  <>
                    <FaChevronUp size={16} />
                    Hide Details
                  </>
                ) : (
                  <>
                    <FaInfoCircle size={16} />
                    View Details & Specifications
                  </>
                )}
              </button>
            </div> */}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="g-bg-white g-border-t g-border-gray-200">
                <div className="g-p-6 g-grid md:g-grid-cols-2 g-gap-6">
                  {/* Extended Features */}
                  <div>
                    <h4 className="g-font-semibold g-text-gray-900 g-mb-3 g-flex g-items-center g-gap-2">
                      <FaBolt size={16} className="g-text-primary-600" />
                      Advanced Features
                    </h4>
                    <ul className="g-space-y-2">
                      {format.extendedFeatures.map((feature, index) => (
                        <li key={index} className="g-flex g-items-start g-gap-2 g-text-sm">
                          <FaCheck
                            size={14}
                            className="g-text-green-600 g-mt-0.5 g-flex-shrink-0"
                          />
                          <span className="g-text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <h4 className="g-font-semibold g-text-gray-900 g-mb-3 g-flex g-items-center g-gap-2">
                      <FaInfoCircle size={16} className="g-text-primary-600" />
                      Technical Specifications
                    </h4>
                    <div className="g-space-y-2">
                      {Object.entries(format.technicalSpecs).map(([key, value]) => (
                        <div
                          key={key}
                          className="g-flex g-justify-between g-items-center g-text-sm"
                        >
                          <span className="g-text-gray-600">{key}:</span>
                          <span className="g-font-medium g-text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
