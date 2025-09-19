import {
  MdCheck as Check2,
  MdDownload as Download,
  MdFileDownload as FileText,
  MdArchive as Archive,
  MdList as List,
  MdGridOn as Grid,
  MdExpandMore as ChevronDown,
  MdExpandLess as ChevronUp,
  MdInfo as Info,
  MdSecurity as Zap,
  MdSecurity as Shield,
} from 'react-icons/md';

import { LuCheckCheck as Check } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import QualityFilters from './testing/components/QualityFilters';

const verbatimExtensions = [
  'http://rs.tdwg.org/ac/terms/Multimedia',
  'http://data.ggbn.org/schemas/ggbn/terms/Amplification',
  'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
  'http://purl.org/germplasm/germplasmTerm#MeasurementScore',
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
  'http://rs.tdwg.org/dwc/terms/Identification',
  'http://rs.gbif.org/terms/1.0/Identifier',
  'http://rs.gbif.org/terms/1.0/Image',
  'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
  'http://rs.gbif.org/terms/1.0/Multimedia',
  'http://rs.gbif.org/terms/1.0/Reference',
  'http://rs.tdwg.org/dwc/terms/ResourceRelationship',
  'http://data.ggbn.org/schemas/ggbn/terms/Cloning',
  'http://data.ggbn.org/schemas/ggbn/terms/GelImage',
  'http://data.ggbn.org/schemas/ggbn/terms/Loan',
  'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
  'http://data.ggbn.org/schemas/ggbn/terms/Permit',
  'http://data.ggbn.org/schemas/ggbn/terms/Preparation',
  'http://data.ggbn.org/schemas/ggbn/terms/Preservation',
  'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
  'http://rs.tdwg.org/chrono/terms/ChronometricAge',
  'http://rs.gbif.org/terms/1.0/DNADerivedData',
];

// Mock record counts for each extension
const extensionCounts: Record<string, number> = {
  'http://rs.tdwg.org/ac/terms/Multimedia': 2456789,
  'http://data.ggbn.org/schemas/ggbn/terms/Amplification': 0,
  'http://purl.org/germplasm/germplasmTerm#GermplasmAccession': 45231,
  'http://purl.org/germplasm/germplasmTerm#MeasurementScore': 12847,
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrait': 23591,
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrial': 8934,
  'http://rs.tdwg.org/dwc/terms/Identification': 5847293,
  'http://rs.gbif.org/terms/1.0/Identifier': 3274815,
  'http://rs.gbif.org/terms/1.0/Image': 1842637,
  'http://rs.tdwg.org/dwc/terms/MeasurementOrFact': 8963421,
  'http://rs.gbif.org/terms/1.0/Multimedia': 3847291,
  'http://rs.gbif.org/terms/1.0/Reference': 742856,
  'http://rs.tdwg.org/dwc/terms/ResourceRelationship': 284739,
  'http://data.ggbn.org/schemas/ggbn/terms/Cloning': 0,
  'http://data.ggbn.org/schemas/ggbn/terms/GelImage': 15847,
  'http://data.ggbn.org/schemas/ggbn/terms/Loan': 0,
  'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample': 947382,
  'http://data.ggbn.org/schemas/ggbn/terms/Permit': 28475,
  'http://data.ggbn.org/schemas/ggbn/terms/Preparation': 584729,
  'http://data.ggbn.org/schemas/ggbn/terms/Preservation': 392847,
  'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact': 1847293,
  'http://rs.tdwg.org/chrono/terms/ChronometricAge': 94738,
  'http://rs.gbif.org/terms/1.0/DNADerivedData': 247583,
};

const formatCount = (count: number): string => {
  if (count === 0) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

const getExtensionName = (url: string): string => {
  const parts = url.split(/[/#]/);
  return parts[parts.length - 1];
};

const formatCards = [
  {
    title: 'SIMPLE',
    description: 'Basic occurrence data with interpreted fields only',
    icon: FileText,
    popular: true,
    size: '417 GB',
    compatibility: 'Excel Ready',
    features: ['Interpreted data only', 'CSV format', 'Coordinates included', 'Quick processing'],
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
    icon: List,
    popular: false,
    size: 'Variable',
    compatibility: 'Universal',
    features: ['Species aggregation', 'Occurrence counts', 'CSV format', 'No coordinates'],
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
    icon: Archive,
    popular: false,
    size: '1 TB',
    compatibility: 'Standards Compliant',
    features: [
      'Raw + interpreted data',
      'Multimedia links',
      'Darwin Core standard',
      'Extensible format',
    ],
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
    icon: Grid,
    popular: false,
    size: 'Compressed',
    compatibility: 'Analysis Ready',
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

function DownloadGbifOrg() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showDarwinCoreConfig, setShowDarwinCoreConfig] = useState(false);
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);

  const toggleCard = (title: string) => {
    setExpandedCard(expandedCard === title ? null : title);
  };

  const handleExtensionToggle = (extension: string) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension) ? prev.filter((ext) => ext !== extension) : [...prev, extension]
    );
  };

  const handleDarwinCoreConfig = () => {
    setShowDarwinCoreConfig(true);
  };

  const handleDownloadDarwinCore = () => {
    console.log('Downloading Darwin Core Archive with extensions:', selectedExtensions);
    // Implementation for actual download would go here
  };

  return (
    <div className="g-min-h-screen g-bg-gradient-to-br g-from-slate-50 g-to-slate-100 g-py-12 g-px-4">
      <div className="g-max-w-6xl g-mx-auto">
        <div className="g-text-center g-mb-12">
          <p className="g-text-lg g-text-gray-600 g-max-w-3xl g-mx-auto">
            Choose the format that best suits your research needs. Each option provides different
            levels of data completeness and processing.
          </p>
        </div>

        <QualityFilters onContinue={() => {}} />

        <div className="g-space-y-4">
          {formatCards.map((format) => {
            const IconComponent = format.icon;
            const isExpanded = expandedCard === format.title;

            return (
              <div
                key={format.title}
                className={`g-relative g-bg-white g-rounded-xl g-shadow-md g-border-2 g-transition-all g-duration-300 g-overflow-hidden ${
                  format.popular
                    ? 'g-border-primary-500 g-ring-2 g-ring-primary-100'
                    : 'g-border-gray-200 hover:g-border-primary-300'
                } ${isExpanded ? 'g-shadow-xl' : 'hover:g-shadow-lg'}`}
              >
                {format.popular && (
                  <div className="g-absolute g-top-0 g-right-0 g-bg-gradient-to-l g-from-primary-500 g-to-primary-600 g-text-white g-px-3 g-py-1 g-text-xs g-font-semibold g-rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                {/* Main Card Content */}
                <div className="g-p-6">
                  <div className="g-flex g-items-center g-justify-between">
                    <div className="g-flex-1">
                      <div className="g-flex g-flex-col lg:g-flex-row lg:g-items-center lg:g-justify-between g-gap-4">
                        <div className="g-flex-1">
                          <div className="g-flex g-items-center g-gap-3 g-mb-1">
                            <h3 className="g-text-xl g-font-bold g-text-gray-900">
                              {format.title}
                            </h3>
                            <span className="g-text-sm g-text-gray-500 g-bg-gray-100 g-px-2 g-py-1 g-rounded">
                              {format.size}
                            </span>
                            <div className="g-flex g-items-center g-gap-1">
                              <Shield size={14} className="g-text-primary-600" />
                              <span className="g-text-sm g-text-primary-600 g-font-medium">
                                {format.compatibility}
                              </span>
                            </div>
                          </div>
                          <p className="g-text-gray-600 g-text-sm g-mb-3">{format.description}</p>

                          {/* Compact Features */}
                          <div className="g-flex g-flex-wrap g-gap-2">
                            {format.features.map((feature, index) => (
                              <span
                                key={index}
                                className="g-inline-flex g-items-center g-gap-1 g-text-xs g-bg-gray-50 g-text-gray-700 g-px-2 g-py-1 g-rounded-full"
                              >
                                <Check size={12} className="g-text-primary-600" />
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="g-flex g-flex-col lg:g-flex-row g-items-stretch lg:g-items-center g-gap-3">
                          <button
                            onClick={() =>
                              format.hasNextStep && format.title === 'DARWIN CORE ARCHIVE'
                                ? handleDarwinCoreConfig()
                                : undefined
                            }
                            className={`g-px-6 g-py-2 g-rounded-lg g-font-semibold g-transition-all g-duration-200 g-flex g-items-center g-gap-2 ${
                              format.popular
                                ? 'g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 hover:g-from-primary-600 hover:g-to-primary-700 g-text-white g-shadow-md hover:g-shadow-lg'
                                : 'g-bg-gray-900 hover:g-bg-gray-800 g-text-white'
                            }`}
                          >
                            {format.hasNextStep && 'Configure'}
                            {!format.hasNextStep && (
                              <>
                                <Download size={16} />
                                Download
                              </>
                            )}
                          </button>
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
                        <ChevronUp size={16} />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Info size={16} />
                        View Details & Specifications
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="g-bg-white g-border-t g-border-gray-200">
                    <div className="g-p-6 g-grid md:g-grid-cols-2 g-gap-6">
                      {/* Extended Features */}
                      <div>
                        <h4 className="g-font-semibold g-text-gray-900 g-mb-3 g-flex g-items-center g-gap-2">
                          <Zap size={16} className="g-text-primary-600" />
                          Advanced Features
                        </h4>
                        <ul className="g-space-y-2">
                          {format.extendedFeatures.map((feature, index) => (
                            <li key={index} className="g-flex g-items-start g-gap-2 g-text-sm">
                              <Check
                                size={14}
                                className="g-text-primary-600 g-mt-0.5 g-flex-shrink-0"
                              />
                              <span className="g-text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technical Specifications */}
                      <div>
                        <h4 className="g-font-semibold g-text-gray-900 g-mb-3 g-flex g-items-center g-gap-2">
                          <Info size={16} className="g-text-primary-600" />
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

        {/* Darwin Core Archive Configuration Card */}
        {showDarwinCoreConfig && (
          <div className="g-mt-8 g-bg-white g-rounded-xl g-shadow-md g-border-2 g-border-primary-300 g-overflow-hidden">
            <div className="g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 g-text-white g-px-6 g-py-4">
              <h3 className="g-text-xl g-font-bold g-flex g-items-center g-gap-2">
                <Archive size={20} />
                Configure Darwin Core Archive
              </h3>
              <p className="g-text-primary-100 g-text-sm g-mt-1">
                Select the extensions you want to include in your download
              </p>
            </div>

            <div className="g-p-6">
              <div className="g-mb-6">
                <div className="g-flex g-items-center g-justify-between g-mb-4">
                  <h4 className="g-font-semibold g-text-gray-900">Available Extensions</h4>
                  <div className="g-flex g-gap-2">
                    <button
                      onClick={() =>
                        setSelectedExtensions(
                          verbatimExtensions.filter((ext) => (extensionCounts[ext] || 0) > 0)
                        )
                      }
                      className="g-text-sm g-text-primary-600 hover:g-text-primary-700 g-font-medium"
                    >
                      Select All
                    </button>
                    <span className="g-text-gray-300">|</span>
                    <button
                      onClick={() => setSelectedExtensions([])}
                      className="g-text-sm g-text-gray-600 hover:g-text-gray-700 g-font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 lg:g-grid-cols-3 g-gap-3 g-max-h-96 g-overflow-y-auto g-pr-2">
                  {verbatimExtensions.map((extension) => {
                    const extensionName = getExtensionName(extension);
                    const isSelected = selectedExtensions.includes(extension);
                    const recordCount = extensionCounts[extension] || 0;
                    const hasData = recordCount > 0;

                    return (
                      <label
                        key={extension}
                        className={`g-flex g-items-start g-gap-3 g-p-3 g-rounded-lg g-border-2 g-transition-all g-duration-200 ${
                          !hasData
                            ? 'g-border-gray-100 g-bg-gray-50 g-cursor-not-allowed g-opacity-60'
                            : isSelected
                            ? 'g-border-primary-300 g-bg-primary-50 g-cursor-pointer'
                            : 'g-border-gray-200 hover:g-border-gray-300 hover:g-bg-gray-50 g-cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!hasData}
                          onChange={() => hasData && handleExtensionToggle(extension)}
                          className={`g-mt-0.5 g-w-4 g-h-4 g-border-gray-300 g-rounded focus:g-ring-2 ${
                            !hasData
                              ? 'g-text-gray-300 g-cursor-not-allowed'
                              : 'g-text-primary-600 focus:g-ring-primary-500'
                          }`}
                        />
                        <div className="g-flex-1 g-min-w-0">
                          <div className="g-flex g-items-center g-justify-between g-gap-2">
                            <div
                              className={`g-font-medium g-text-sm g-leading-tight ${
                                hasData ? 'g-text-gray-900' : 'g-text-gray-400'
                              }`}
                            >
                              {extensionName}
                            </div>
                            <div
                              className={`g-text-xs g-px-2 g-py-1 g-rounded-full g-font-medium ${
                                !hasData
                                  ? 'g-bg-gray-100 g-text-gray-400'
                                  : recordCount >= 1000000
                                  ? 'g-bg-green-100 g-text-green-700'
                                  : recordCount >= 100000
                                  ? 'g-bg-blue-100 g-text-blue-700'
                                  : 'g-bg-yellow-100 g-text-yellow-700'
                              }`}
                            >
                              {formatCount(recordCount)}
                            </div>
                          </div>
                          <div
                            className={`g-text-xs g-mt-1 g-break-all ${
                              hasData ? 'g-text-gray-500' : 'g-text-gray-300'
                            }`}
                          >
                            {extension}
                          </div>
                          {!hasData && (
                            <div className="g-text-xs g-text-gray-400 g-mt-1 g-italic">
                              No records available
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="g-border-t g-border-gray-200 g-pt-6">
                <div className="g-flex g-items-center g-justify-between">
                  <div className="g-text-sm g-text-gray-600">
                    <span className="g-font-medium">{selectedExtensions.length}</span> of{' '}
                    {verbatimExtensions.filter((ext) => (extensionCounts[ext] || 0) > 0).length}{' '}
                    available extensions selected
                  </div>
                  <div className="g-flex g-gap-3">
                    <button
                      onClick={() => setShowDarwinCoreConfig(false)}
                      className="g-px-4 g-py-2 g-text-gray-600 hover:g-text-gray-700 g-font-medium g-transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDownloadDarwinCore}
                      className="g-px-6 g-py-2 g-bg-gradient-to-r g-from-primary-500 g-to-primary-600 hover:g-from-primary-600 hover:g-to-primary-700 g-text-white g-rounded-lg g-font-semibold g-transition-all g-duration-200 g-flex g-items-center g-gap-2 g-shadow-md hover:g-shadow-lg"
                    >
                      <Download size={16} />
                      Download Darwin Core Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="g-text-center g-mt-12">
          <p className="g-text-gray-600 g-text-sm g-max-w-4xl g-mx-auto">
            All downloads are provided in tab-delimited CSV format for compatibility with Excel and
            other analysis tools. Darwin Core Archive format follows international biodiversity data
            standards and allows for extension selection in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DownloadGbifOrg;
