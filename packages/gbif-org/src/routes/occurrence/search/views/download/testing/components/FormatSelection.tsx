import React from 'react';
import {
  Check,
  Download,
  FileText,
  List,
  Archive,
  Grid,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  Shield,
  ChevronLeft,
} from 'lucide-react';

interface Format {
  title: string;
  hasNextStep?: boolean;
  description: string;
  icon: any;
  popular: boolean;
  size: string;
  compatibility: string;
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
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to quality filters
      </button>

      {formatCards.map((format) => {
        const IconComponent = format.icon;
        const isExpanded = expandedCard === format.title;

        return (
          <div
            key={format.title}
            className={`relative bg-white rounded-xl shadow-md border-2 transition-all duration-300 overflow-hidden ${
              format.popular
                ? 'border-blue-500 ring-2 ring-blue-100'
                : 'border-gray-200 hover:border-blue-300'
            } ${isExpanded ? 'shadow-xl' : 'hover:shadow-lg'}`}
          >
            {format.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                Most Popular
              </div>
            )}

            {/* Main Card Content */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900">{format.title}</h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {format.size}
                        </span>
                        <div className="flex items-center gap-1">
                          <Shield size={14} className="text-green-600" />
                          <span className="text-sm text-green-600 font-medium">
                            {format.compatibility}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{format.description}</p>

                      {/* Compact Features */}
                      <div className="flex flex-wrap gap-2">
                        {format.features.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full"
                          >
                            <Check size={12} className="text-green-600" />
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                      <button
                        onClick={() => onFormatSelect(format)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                          format.popular
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with Expand Action */}
            <div className="border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => toggleCard(format.title)}
                className="w-full px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
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
              <div className="bg-white border-t border-gray-200">
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Extended Features */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-blue-600" />
                      Advanced Features
                    </h4>
                    <ul className="space-y-2">
                      {format.extendedFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Info size={16} className="text-blue-600" />
                      Technical Specifications
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(format.technicalSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
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
