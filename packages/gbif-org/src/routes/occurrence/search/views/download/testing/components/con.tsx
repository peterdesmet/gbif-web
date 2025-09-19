import React, { useState } from 'react';
import {
  ChevronLeft,
  Settings,
  Database,
  Globe,
  FileText,
  Check,
  Info,
  AlertCircle,
} from 'lucide-react';

interface ConfigurationStepProps {
  qualityFilters: any;
  selectedFormat: any;
  onBack: () => void;
  onContinue: (config: any) => void;
}

export default function ConfigurationStep({
  qualityFilters,
  selectedFormat,
  onBack,
  onContinue,
}: ConfigurationStepProps) {
  const [config, setConfig] = useState({
    fields: {
      core: ['scientificName', 'decimalLatitude', 'decimalLongitude', 'eventDate', 'basisOfRecord'],
      optional: [],
      custom: [],
    },
    taxonomy: 'gbif',
    coordinates: 'wgs84',
    dateFormat: 'iso8601',
    encoding: 'utf8',
    delimiter: 'tab',
  });

  const [activeSection, setActiveSection] = useState<string | null>('fields');

  const coreFields = [
    {
      id: 'scientificName',
      label: 'Scientific Name',
      description: 'The full scientific name',
      required: true,
    },
    {
      id: 'decimalLatitude',
      label: 'Decimal Latitude',
      description: 'Latitude in decimal degrees',
      required: true,
    },
    {
      id: 'decimalLongitude',
      label: 'Decimal Longitude',
      description: 'Longitude in decimal degrees',
      required: true,
    },
    { id: 'eventDate', label: 'Event Date', description: 'Date of the occurrence', required: true },
    {
      id: 'basisOfRecord',
      label: 'Basis of Record',
      description: 'Nature of the data record',
      required: true,
    },
  ];

  const optionalFields = [
    { id: 'kingdom', label: 'Kingdom', description: 'Taxonomic kingdom' },
    { id: 'phylum', label: 'Phylum', description: 'Taxonomic phylum' },
    { id: 'class', label: 'Class', description: 'Taxonomic class' },
    { id: 'order', label: 'Order', description: 'Taxonomic order' },
    { id: 'family', label: 'Family', description: 'Taxonomic family' },
    { id: 'genus', label: 'Genus', description: 'Taxonomic genus' },
    { id: 'species', label: 'Species', description: 'Taxonomic species' },
    { id: 'country', label: 'Country', description: 'Country of occurrence' },
    { id: 'stateProvince', label: 'State/Province', description: 'State or province' },
    { id: 'locality', label: 'Locality', description: 'Specific locality description' },
    { id: 'elevation', label: 'Elevation', description: 'Elevation in meters' },
    { id: 'depth', label: 'Depth', description: 'Depth in meters' },
    { id: 'institutionCode', label: 'Institution Code', description: 'Code for the institution' },
    { id: 'collectionCode', label: 'Collection Code', description: 'Code for the collection' },
    { id: 'catalogNumber', label: 'Catalog Number', description: 'Catalog number of specimen' },
    { id: 'recordedBy', label: 'Recorded By', description: 'Person who recorded the occurrence' },
  ];

  const toggleOptionalField = (fieldId: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        optional: prev.fields.optional.includes(fieldId)
          ? prev.fields.optional.filter((id) => id !== fieldId)
          : [...prev.fields.optional, fieldId],
      },
    }));
  };

  const handleContinue = () => {
    onContinue(config);
  };

  const IconComponent = selectedFormat.icon;

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-8">
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 g-hover:text-gray-900 g-mb-4 g-transition-colors"
        >
          <ChevronLeft size={20} />
          Back to format selection
        </button>

        <div className="g-flex g-items-center g-gap-4 g-mb-4">
          <div className="g-p-3 g-bg-blue-100 g-rounded-lg">
            <IconComponent size={24} className="g-text-blue-600" />
          </div>
          <div>
            <h1 className="g-text-2xl g-font-bold g-text-gray-900">
              Configure {selectedFormat.title} Download
            </h1>
            <p className="g-text-gray-600">{selectedFormat.description}</p>
          </div>
        </div>

        <div className="g-bg-blue-50 g-border g-border-blue-200 g-rounded-lg g-p-4">
          <div className="g-flex g-items-start g-gap-3">
            <Info size={20} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
            <div>
              <h3 className="g-font-semibold g-text-blue-900 g-mb-1">Estimated Download Size</h3>
              <p className="g-text-blue-800 g-text-sm">{selectedFormat.estimatedSize}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="g-grid g-lg:grid-cols-3 g-gap-8">
        {/* Configuration Sections */}
        <div className="g-lg:col-span-2 g-space-y-6">
          {/* Fields Selection */}
          <div className="g-bg-white g-rounded-xl g-shadow-md g-border g-border-gray-200">
            <button
              onClick={() => setActiveSection(activeSection === 'fields' ? null : 'fields')}
              className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between g-hover:bg-gray-50 g-transition-colors"
            >
              <div className="g-flex g-items-center g-gap-3">
                <Database size={20} className="g-text-blue-600" />
                <div>
                  <h3 className="g-font-semibold g-text-gray-900">Data Fields</h3>
                  <p className="g-text-sm g-text-gray-600">
                    Select which fields to include in your download
                  </p>
                </div>
              </div>
              <div className="g-text-sm g-text-gray-500">
                {config.fields.core.length + config.fields.optional.length} fields selected
              </div>
            </button>

            {activeSection === 'fields' && (
              <div className="g-border-t g-border-gray-200 g-p-6">
                {/* Core Fields */}
                <div className="g-mb-6">
                  <h4 className="g-font-medium g-text-gray-900 g-mb-3 g-flex g-items-center g-gap-2">
                    <Check size={16} className="g-text-green-600" />
                    Core Fields (Required)
                  </h4>
                  <div className="g-space-y-2">
                    {coreFields.map((field) => (
                      <div
                        key={field.id}
                        className="g-flex g-items-center g-justify-between g-p-3 g-bg-green-50 g-rounded-lg g-border g-border-green-200"
                      >
                        <div>
                          <span className="g-font-medium g-text-gray-900">{field.label}</span>
                          <p className="g-text-sm g-text-gray-600">{field.description}</p>
                        </div>
                        <Check size={16} className="g-text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Fields */}
                <div>
                  <h4 className="g-font-medium g-text-gray-900 g-mb-3">Optional Fields</h4>
                  <div className="g-grid g-md:grid-cols-2 g-gap-2">
                    {optionalFields.map((field) => (
                      <label
                        key={field.id}
                        className="g-flex g-items-center g-p-3 g-rounded-lg g-border g-border-gray-200 g-hover:bg-gray-50 g-cursor-pointer g-transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={config.fields.optional.includes(field.id)}
                          onChange={() => toggleOptionalField(field.id)}
                          className="g-mr-3 g-h-4 g-w-4 g-text-blue-600 g-focus:ring-blue-500 g-border-gray-300 g-rounded"
                        />
                        <div className="g-flex-1">
                          <span className="g-font-medium g-text-gray-900 g-text-sm">
                            {field.label}
                          </span>
                          <p className="g-text-xs g-text-gray-600">{field.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Taxonomy Configuration */}
          <div className="g-bg-white g-rounded-xl g-shadow-md g-border g-border-gray-200">
            <button
              onClick={() => setActiveSection(activeSection === 'taxonomy' ? null : 'taxonomy')}
              className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between g-hover:bg-gray-50 g-transition-colors"
            >
              <div className="g-flex g-items-center g-gap-3">
                <Globe size={20} className="g-text-blue-600" />
                <div>
                  <h3 className="g-font-semibold g-text-gray-900">Taxonomy & Standards</h3>
                  <p className="g-text-sm g-text-gray-600">
                    Configure taxonomic backbone and data standards
                  </p>
                </div>
              </div>
            </button>

            {activeSection === 'taxonomy' && (
              <div className="g-border-t g-border-gray-200 g-p-6 g-space-y-4">
                <div>
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Taxonomic Backbone
                  </label>
                  <select
                    value={config.taxonomy}
                    onChange={(e) => setConfig((prev) => ({ ...prev, taxonomy: e.target.value }))}
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded-lg g-focus:ring-2 g-focus:ring-blue-500 g-focus:border-blue-500"
                  >
                    <option value="gbif">GBIF Backbone Taxonomy</option>
                    <option value="col">Catalogue of Life</option>
                    <option value="itis">ITIS (Integrated Taxonomic Information System)</option>
                  </select>
                </div>

                <div>
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Coordinate Reference System
                  </label>
                  <select
                    value={config.coordinates}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, coordinates: e.target.value }))
                    }
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded-lg g-focus:ring-2 g-focus:ring-blue-500 g-focus:border-blue-500"
                  >
                    <option value="wgs84">WGS84 (World Geodetic System 1984)</option>
                    <option value="original">Original (as provided)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Format Configuration */}
          <div className="g-bg-white g-rounded-xl g-shadow-md g-border g-border-gray-200">
            <button
              onClick={() => setActiveSection(activeSection === 'format' ? null : 'format')}
              className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between g-hover:bg-gray-50 g-transition-colors"
            >
              <div className="g-flex g-items-center g-gap-3">
                <FileText size={20} className="g-text-blue-600" />
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
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded-lg g-focus:ring-2 g-focus:ring-blue-500 g-focus:border-blue-500"
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
                    className="g-w-full g-p-3 g-border g-border-gray-300 g-rounded-lg g-focus:ring-2 g-focus:ring-blue-500 g-focus:border-blue-500"
                  >
                    <option value="utf8">UTF-8 (recommended)</option>
                    <option value="latin1">Latin-1 (ISO 8859-1)</option>
                    <option value="ascii">ASCII</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="g-lg:col-span-1">
          <div className="g-bg-white g-rounded-xl g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Summary</h3>

            <div className="g-space-y-3 g-text-sm">
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Format:</span>
                <span className="g-font-medium">{selectedFormat.title}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Fields:</span>
                <span className="g-font-medium">
                  {config.fields.core.length + config.fields.optional.length}
                </span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Taxonomy:</span>
                <span className="g-font-medium">{config.taxonomy.toUpperCase()}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Coordinates:</span>
                <span className="g-font-medium">{config.coordinates.toUpperCase()}</span>
              </div>
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Encoding:</span>
                <span className="g-font-medium">{config.encoding.toUpperCase()}</span>
              </div>
            </div>

            <div className="g-mt-6 g-pt-4 g-border-t g-border-gray-200">
              <div className="g-flex g-items-center g-gap-2 g-text-sm g-text-amber-700 g-bg-amber-50 g-p-3 g-rounded-lg g-mb-4">
                <AlertCircle size={16} />
                <span>
                  Estimated processing time: {selectedFormat.technicalSpecs['Processing Time']}
                </span>
              </div>

              <button
                onClick={handleContinue}
                className="g-w-full g-bg-gradient-to-r g-from-blue-500 g-to-blue-600 g-hover:from-blue-600 g-hover:to-blue-700 g-text-white g-font-semibold g-py-3 g-px-4 g-rounded-lg g-transition-all g-duration-200 g-flex g-items-center g-justify-center g-gap-2"
              >
                <Settings size={16} />
                Continue to Terms
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
