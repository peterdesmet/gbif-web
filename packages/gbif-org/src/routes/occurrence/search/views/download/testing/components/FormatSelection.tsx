import { Button } from '@/components/ui/button';
import { ChevronUpIcon } from '@radix-ui/react-icons';
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
import { FiChevronUp, FiSettings } from 'react-icons/fi';

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
  onFormatSelect: (format: Format, config: any) => void;
  onBack: () => void;
}

const darwinCoreExtensions = [
  { id: 'multimedia', name: 'Multimedia', description: 'Images, sounds, and videos' },
  {
    id: 'measurements',
    name: 'Measurements or Facts',
    description: 'Quantitative measurements and qualitative facts',
  },
  {
    id: 'resourceRelationship',
    name: 'Resource Relationship',
    description: 'Relationships between resources',
  },
  { id: 'identification', name: 'Identification', description: 'Taxonomic determinations' },
  {
    id: 'chronometricAge',
    name: 'Chronometric Age',
    description: 'Geological and archaeological age data',
  },
  { id: 'references', name: 'References', description: 'Literature and citation references' },
  { id: 'materialSample', name: 'Material Sample', description: 'Physical samples and specimens' },
  {
    id: 'amplification',
    name: 'Amplification',
    description: 'DNA amplification and sequencing data',
  },
  { id: 'loan', name: 'Loan', description: 'Specimen loan information' },
  { id: 'permit', name: 'Permit', description: 'Collection and export permits' },
  { id: 'preparation', name: 'Preparation', description: 'Specimen preparation methods' },
  { id: 'preservation', name: 'Preservation', description: 'Preservation methods and materials' },
  {
    id: 'geologicalContext',
    name: 'Geological Context',
    description: 'Geological and stratigraphic information',
  },
  {
    id: 'extendedMeasurements',
    name: 'Extended Measurements',
    description: 'Additional measurement data',
  },
  { id: 'audubon', name: 'Audubon Core', description: 'Multimedia metadata standard' },
  { id: 'germplasm', name: 'Germplasm', description: 'Genetic resource information' },
  { id: 'cloning', name: 'Cloning', description: 'Cloning and propagation data' },
  {
    id: 'distribution',
    name: 'Species Distribution',
    description: 'Species distribution and range data',
  },
  {
    id: 'description',
    name: 'Species Profile',
    description: 'Ecological and biological descriptions',
  },
  {
    id: 'vernacular',
    name: 'Vernacular Names',
    description: 'Common names in different languages',
  },
];

const taxonomyOptions = [
  {
    id: 'gbif',
    name: 'GBIF Backbone Taxonomy',
    description: 'Recommended for most users - comprehensive and regularly updated',
  },
  {
    id: 'col',
    name: 'Catalogue of Life',
    description: 'Global species checklist with expert-verified names',
  },
  {
    id: 'itis',
    name: 'ITIS',
    description: 'Integrated Taxonomic Information System - North American focus',
  },
];

const formatCards: Format[] = [
  {
    title: 'OCCURRENCE LIST',
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
  const [configurations, setConfigurations] = React.useState<Record<string, any>>({
    'OCCURRENCE LIST': { taxonomy: 'gbif' },
    'SPECIES LIST': { taxonomy: 'gbif' },
    'DARWIN CORE ARCHIVE': { taxonomy: 'gbif', extensions: [] },
    'CUBE DATA': { taxonomy: 'gbif' },
  });

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  const updateConfiguration = (formatTitle: string, key: string, value: any) => {
    setConfigurations((prev) => ({
      ...prev,
      [formatTitle]: {
        ...prev[formatTitle],
        [key]: value,
      },
    }));
  };

  const toggleExtension = (formatTitle: string, extensionId: string) => {
    setConfigurations((prev) => {
      const currentExtensions = prev[formatTitle]?.extensions || [];
      const newExtensions = currentExtensions.includes(extensionId)
        ? currentExtensions.filter((id: string) => id !== extensionId)
        : [...currentExtensions, extensionId];

      return {
        ...prev,
        [formatTitle]: {
          ...prev[formatTitle],
          extensions: newExtensions,
        },
      };
    });
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
        const config = configurations[format.title] || {};

        return (
          <div
            key={format.title}
            className={`g-relative g-bg-white g-rounded g-shadow-md g-border-2 g-transition-all g-duration-300 g-overflow-hidden g-border-gray-200`}
          >
            {/* Main Card Content */}
            <div className="g-p-6">
              <div className="g-flex g-items-center g-justify-between">
                <div className="g-flex-1">
                  <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-end lg:g-justify-between g-gap-4">
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

                        {/* Info Pills */}
                        <span className="g-inline-flex g-items-center g-gap-1 g-text-xs g-bg-blue-50 g-text-blue-700 g-px-2 g-py-1 g-rounded-full">
                          <FaInfoCircle size={12} className="g-text-blue-600" />
                          {config.taxonomy === 'gbif' && 'GBIF Backbone'}
                          {config.taxonomy === 'col' && 'Catalogue of Life'}
                          {config.taxonomy === 'itis' && 'ITIS'}
                        </span>

                        {format.title === 'DARWIN CORE ARCHIVE' &&
                          config.extensions?.length > 0 && (
                            <span className="g-inline-flex g-items-center g-gap-1 g-text-xs g-bg-blue-50 g-text-blue-700 g-px-2 g-py-1 g-rounded-full">
                              <FaInfoCircle size={12} className="g-text-blue-600" />
                              {config.extensions.length} extension
                              {config.extensions.length !== 1 ? 's' : ''}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="g-flex g-flex-col lg:g-flex-row g-items-stretch lg:g-items-center g-gap-3">
                      <Button
                        size="default"
                        onClick={() => onFormatSelect(format, configurations[format.title])}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Expand Action */}
            <div className="g-border-t g-border-gray-100 g-bg-gray-50">
              <button
                onClick={() => toggleCard(format.title)}
                className="g-w-full g-px-6 g-py-3 g-text-sm g-font-medium g-text-gray-600 hover:g-text-gray-900 hover:g-bg-gray-100 g-transition-colors g-flex g-items-center g-justify-center g-gap-2"
              >
                {isExpanded ? (
                  <>
                    <FiChevronUp size={16} />
                    Hide Configuration
                  </>
                ) : (
                  <>
                    <FiSettings size={16} />
                    Configure Options
                  </>
                )}
              </button>
            </div>

            {/* Configuration Content */}
            {isExpanded && (
              <div className="g-bg-white g-border-t g-border-gray-200">
                <div className="g-p-6">
                  <h4 className="g-font-semibold g-text-gray-900 g-mb-4 g-flex g-items-center g-gap-2">
                    <FiSettings size={16} className="g-text-blue-600" />
                    Configuration Options
                  </h4>

                  {/* Taxonomy Selection */}
                  <div>
                    <h5 className="g-font-medium g-text-gray-900 g-mb-3">Reference Taxonomy</h5>
                    <div className="g-space-y-2">
                      {taxonomyOptions.map((option) => (
                        <label
                          key={option.id}
                          className="g-flex g-items-start g-gap-3 g-p-3 g-rounded-lg g-border g-border-gray-200 hover:g-bg-gray-50 g-cursor-pointer g-transition-colors"
                        >
                          <input
                            type="radio"
                            name={`taxonomy-${format.title}`}
                            value={option.id}
                            checked={config.taxonomy === option.id}
                            onChange={(e) =>
                              updateConfiguration(format.title, 'taxonomy', e.target.value)
                            }
                            className="g-mt-1 g-h-4 g-w-4 g-text-blue-600 focus:g-ring-blue-500 g-border-gray-300"
                          />
                          <div className="g-flex-1">
                            <div className="g-flex g-items-center g-gap-2">
                              <span className="g-font-medium g-text-gray-900">{option.name}</span>
                              {option.id === 'gbif' && (
                                <span className="g-text-xs g-bg-green-100 g-text-green-700 g-px-2 g-py-0.5 g-rounded-full g-font-medium">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="g-text-sm g-text-gray-600 g-mt-1">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Darwin Core Extensions (only for Darwin Core Archive) */}
                  {format.title === 'DARWIN CORE ARCHIVE' && (
                    <div className="g-mt-6">
                      <h5 className="g-font-medium g-text-gray-900 g-mb-3">Data Extensions</h5>
                      <p className="g-text-sm g-text-gray-600 g-mb-4">
                        Select additional data types to include in your download. Extensions provide
                        specialized data beyond core occurrence records.
                      </p>
                      <div className="g-grid md:g-grid-cols-2 g-gap-2 g-max-h-64 g-overflow-y-auto">
                        {darwinCoreExtensions.map((extension) => (
                          <label
                            key={extension.id}
                            className="g-flex g-items-start g-gap-3 g-p-3 g-rounded-lg g-border g-border-gray-200 hover:g-bg-gray-50 g-cursor-pointer g-transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={config.extensions?.includes(extension.id) || false}
                              onChange={() => toggleExtension(format.title, extension.id)}
                              className="g-mt-1 g-h-4 g-w-4 g-text-blue-600 focus:g-ring-blue-500 g-border-gray-300 g-rounded"
                            />
                            <div className="g-flex-1">
                              <span className="g-font-medium g-text-gray-900 g-text-sm">
                                {extension.name}
                              </span>
                              <p className="g-text-xs g-text-gray-600 g-mt-1">
                                {extension.description}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                      {config.extensions?.length > 0 && (
                        <div className="g-mt-3 g-p-2 g-bg-blue-50 g-rounded-lg">
                          <p className="g-text-sm g-text-blue-700">
                            <strong>{config.extensions.length}</strong> extension
                            {config.extensions.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
