import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import {
  FaChevronLeft,
  FaCog,
  FaGlobe,
  FaFileAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaPuzzlePiece,
} from 'react-icons/fa';

interface ConfigurationStepProps {
  qualityFilters: any;
  selectedFormat: any;
  onBack: () => void;
  onContinue: (config: any) => void;
}

// Extension data with URLs

const AVAILABLE_EXTENSIONS = [
  {
    url: 'http://rs.tdwg.org/ac/terms/Multimedia',
    name: 'Multimedia',
    description:
      'Audubon Core extension for multimedia content including images, audio, video, and other digital media associated with specimens or observations',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Amplification',
    name: 'Amplification',
    description:
      'GGBN extension for DNA/RNA amplification data including PCR conditions, primers, and amplicon information',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
    name: 'GermplasmAccession',
    description:
      'Germplasm extension for plant genetic resource accession data including breeding lines, cultivars, and seed bank information',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementScore',
    name: 'MeasurementScore',
    description:
      'Germplasm extension for recording measurement scores and evaluation data from field trials and assessments',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
    name: 'MeasurementTrait',
    description:
      'Germplasm extension for defining measurable traits and characteristics evaluated in germplasm collections',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
    name: 'MeasurementTrial',
    description:
      'Germplasm extension for trial and experiment metadata where germplasm measurements and evaluations are conducted',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/Identification',
    name: 'Identification',
    description:
      'Darwin Core extension for taxonomic identifications, including determiner information, dates, and identification history',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Identifier',
    name: 'Identifier',
    description:
      'GBIF extension for alternative identifiers and cross-references to external databases and systems',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Image',
    name: 'Image',
    description:
      'GBIF extension specifically for image metadata including licensing, spatial resolution, and technical specifications',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    name: 'MeasurementOrFact',
    description:
      'Darwin Core extension for quantitative and qualitative measurements, facts, and characteristics of specimens or observations',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Multimedia',
    name: 'Multimedia',
    description:
      'GBIF-specific multimedia extension for digital media files with enhanced metadata and licensing information',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Reference',
    name: 'Reference',
    description:
      'GBIF extension for bibliographic references and literature citations associated with specimens or data records',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/ResourceRelationship',
    name: 'ResourceRelationship',
    description:
      'Darwin Core extension for expressing relationships between different resources, specimens, or data records',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Cloning',
    name: 'Cloning',
    description:
      'GGBN extension for molecular cloning procedures and vector information used in genetic research',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/GelImage',
    name: 'GelImage',
    description:
      'GGBN extension for gel electrophoresis images and associated metadata from molecular biology procedures',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Loan',
    name: 'Loan',
    description:
      'GGBN extension for tracking specimen and sample loans between institutions including terms and conditions',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
    name: 'MaterialSample',
    description:
      'GGBN extension for physical material samples including tissue samples, DNA extracts, and other derived materials',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Permit',
    name: 'Permit',
    description:
      'GGBN extension for permits and legal authorizations required for specimen collection, export, and research activities',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preparation',
    name: 'Preparation',
    description:
      'GGBN extension for specimen preparation methods and protocols used in processing biological samples',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preservation',
    name: 'Preservation',
    description:
      'GGBN extension for preservation methods, storage conditions, and long-term maintenance of biological samples',
  },
  {
    url: 'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
    name: 'ExtendedMeasurementOrFact',
    description:
      'OBIS extension for enhanced marine and aquatic measurements including environmental parameters and species-specific data',
  },
  {
    url: 'http://rs.tdwg.org/chrono/terms/ChronometricAge',
    name: 'ChronometricAge',
    description:
      'Chronometric Age extension for absolute age determinations using radiometric and other dating methods',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/DNADerivedData',
    name: 'DNADerivedData',
    description:
      'GBIF extension for DNA sequence data, genomic information, and molecular data derived from specimens',
  },
];

export default function ConfigurationStep({
  qualityFilters,
  selectedFormat,
  onBack,
  onContinue,
}: ConfigurationStepProps) {
  const [config, setConfig] = useState({
    taxonomy: 'gbif',
    extensions: [] as string[],
    delimiter: 'tab',
    encoding: 'utf8',
  });

  const [activeSection, setActiveSection] = useState<string | null>('taxonomy');

  const isDarwinCoreArchive =
    selectedFormat?.title === 'DARWIN CORE ARCHIVE' ||
    selectedFormat?.title?.includes('Darwin Core');

  const toggleExtension = (extensionUrl: string) => {
    setConfig((prev) => ({
      ...prev,
      extensions: prev.extensions.includes(extensionUrl)
        ? prev.extensions.filter((url) => url !== extensionUrl)
        : [...prev.extensions, extensionUrl],
    }));
  };

  const handleContinue = () => {
    onContinue(config);
  };

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-8">
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          Back to format selection
        </button>
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Configuration Sections */}
        <div className="lg:g-col-span-2 g-space-y-6">
          {/* Taxonomy Configuration */}
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <button
              onClick={() => setActiveSection(activeSection === 'taxonomy' ? null : 'taxonomy')}
              className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
            >
              <div className="g-flex g-items-center g-gap-3">
                <FaGlobe size={20} className="g-text-primary-600" />
                <div>
                  <h3 className="g-font-semibold g-text-gray-900">Taxonomic Reference</h3>
                  <p className="g-text-sm g-text-gray-600">
                    Select the taxonomic backbone for species names
                  </p>
                </div>
              </div>
              <div className="g-text-sm g-text-gray-500">{config.taxonomy.toUpperCase()}</div>
            </button>

            {activeSection === 'taxonomy' && (
              <div className="g-border-t g-border-gray-200 g-p-6">
                <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-3">
                  Taxonomic Backbone
                </label>
                <div className="g-space-y-2">
                  <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
                    <input
                      type="radio"
                      name="taxonomy"
                      value="gbif"
                      checked={config.taxonomy === 'gbif'}
                      onChange={(e) => setConfig((prev) => ({ ...prev, taxonomy: e.target.value }))}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">GBIF Backbone Taxonomy</span>
                      <p className="g-text-sm g-text-gray-600">Recommended - Most comprehensive</p>
                    </div>
                  </label>

                  <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
                    <input
                      type="radio"
                      name="taxonomy"
                      value="col"
                      checked={config.taxonomy === 'col'}
                      onChange={(e) => setConfig((prev) => ({ ...prev, taxonomy: e.target.value }))}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">Catalogue of Life</span>
                      <p className="g-text-sm g-text-gray-600">International standard reference</p>
                    </div>
                  </label>

                  <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
                    <input
                      type="radio"
                      name="taxonomy"
                      value="itis"
                      checked={config.taxonomy === 'itis'}
                      onChange={(e) => setConfig((prev) => ({ ...prev, taxonomy: e.target.value }))}
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                    />
                    <div className="g-ml-3">
                      <span className="g-font-medium g-text-gray-900">ITIS</span>
                      <p className="g-text-sm g-text-gray-600">
                        Integrated Taxonomic Information System
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Extensions Selection (Darwin Core Archive only) */}
          {isDarwinCoreArchive && (
            <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
              <button
                onClick={() =>
                  setActiveSection(activeSection === 'extensions' ? null : 'extensions')
                }
                className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
              >
                <div className="g-flex g-items-center g-gap-3">
                  <FaPuzzlePiece size={20} className="g-text-primary-600" />
                  <div>
                    <h3 className="g-font-semibold g-text-gray-900">Extensions</h3>
                    <p className="g-text-sm g-text-gray-600">
                      Select additional data extensions to include
                    </p>
                  </div>
                </div>
                <div className="g-text-sm g-text-gray-500">{config.extensions.length} selected</div>
              </button>

              {activeSection === 'extensions' && (
                <div className="g-border-t g-border-gray-200 g-p-6">
                  <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
                    <div className="g-flex g-items-start g-gap-3">
                      <FaInfoCircle
                        size={16}
                        className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0"
                      />
                      <p className="g-text-sm g-text-blue-800">
                        Extensions provide additional data fields beyond the core occurrence data.
                        Only select extensions that are relevant to your research needs.
                      </p>
                    </div>
                  </div>

                  <div className="g-grid g-gap-3">
                    {AVAILABLE_EXTENSIONS.map((extension) => (
                      <label
                        key={extension.url}
                        className="g-flex g-items-start g-p-3 g-rounded g-border g-border-gray-200 hover:g-bg-gray-50 g-cursor-pointer g-transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={config.extensions.includes(extension.url)}
                          onChange={() => toggleExtension(extension.url)}
                          className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
                        />
                        <div className="g-ml-3 g-flex-1">
                          <span className="g-font-medium g-text-gray-900 g-text-sm">
                            {extension.name}
                          </span>
                          <p className="g-text-xs g-text-gray-500 g-break-all g-mt-0.5">
                            {extension.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Format Configuration */}
          {/* <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
            <button
              onClick={() => setActiveSection(activeSection === 'format' ? null : 'format')}
              className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
            >
              <div className="g-flex g-items-center g-gap-3">
                <FaFileAlt size={20} className="g-text-primary-600" />
                <div>
                  <h3 className="g-font-semibold g-text-gray-900">File Format Options</h3>
                  <p className="g-text-sm g-text-gray-600">Configure output format and encoding</p>
                </div>
              </div>
            </button>

            {activeSection === 'format' && (
              <div className="g-border-t g-border-gray-200 g-p-6 g-space-y-4">
                <div>
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Field Delimiter
                  </label>
                  <select
                    value={config.delimiter}
                    onChange={(e) => setConfig((prev) => ({ ...prev, delimiter: e.target.value }))}
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded g-focus:ring-2 g-focus:ring-primary-500 g-focus:border-primary-500"
                  >
                    <option value="tab">Tab-delimited (recommended)</option>
                    <option value="comma">Comma-separated (CSV)</option>
                    <option value="pipe">Pipe-delimited</option>
                  </select>
                </div>

                <div>
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Character Encoding
                  </label>
                  <select
                    value={config.encoding}
                    onChange={(e) => setConfig((prev) => ({ ...prev, encoding: e.target.value }))}
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded g-focus:ring-2 g-focus:ring-primary-500 g-focus:border-primary-500"
                  >
                    <option value="utf8">UTF-8 (recommended)</option>
                    <option value="latin1">Latin-1 (ISO 8859-1)</option>
                    <option value="ascii">ASCII</option>
                  </select>
                </div>
              </div>
            )}
          </div> */}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Summary</h3>

            <div className="g-space-y-3 g-text-sm">
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Format:</span>
                <span className="g-font-medium">{selectedFormat.title}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Taxonomy:</span>
                <span className="g-font-medium">{config.taxonomy.toUpperCase()}</span>
              </div>
              {isDarwinCoreArchive && (
                <div className="g-flex g-justify-between">
                  <span className="g-text-gray-600">Extensions:</span>
                  <span className="g-font-medium">{config.extensions.length}</span>
                </div>
              )}
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Delimiter:</span>
                <span className="g-font-medium">{config.delimiter.toUpperCase()}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Encoding:</span>
                <span className="g-font-medium">{config.encoding.toUpperCase()}</span>
              </div>
            </div>

            <div className="g-mt-6 g-pt-4 g-border-t g-border-gray-200">
              <div className="g-flex g-items-center g-gap-2 g-text-sm g-text-amber-700 g-bg-amber-50 g-p-3 g-rounded g-mb-4">
                <FaExclamationTriangle size={16} />
                <span>
                  Estimated processing time:{' '}
                  {selectedFormat.technicalSpecs?.['Processing Time'] || '5-15 minutes'}
                </span>
              </div>

              <Button
                onClick={handleContinue}
                className="g-w-full g-flex g-items-center g-justify-center g-gap-2"
              >
                <FaCog size={16} />
                Continue to Terms
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
