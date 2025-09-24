import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
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
  onQuickDownload?: (format: Format, config: any) => void;
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
      <button
        onClick={onBack}
        className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-6 g-transition-colors"
      >
        <FaChevronLeft size={20} />
        Back to quality filters
      </button>

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
                              <FaCheck size={12} className="g-text-green-600" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="g-flex g-flex-col g-items-stretch g-gap-3">
                        {format.title === 'OCCURRENCE LIST' || format.title === 'SPECIES LIST' ? (
                          <>
                            <Button
                              variant="subtle"
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
    </div>
  );
}
