import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { FaChevronLeft, FaCog, FaExclamationTriangle } from 'react-icons/fa';
import TaxonomySelector from './TaxonomySelector';
import ExtensionsSelector from './ExtensionsSelector';
import CubeDimensionsSelector from './CubeDimensionsSelector';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { FormattedMessage } from 'react-intl';

interface ConfigurationStepProps {
  selectedFormat: any;
  defaultChecklist: string;
  onBack: () => void;
  onContinue: (config: any) => void;
}

// Format-specific configuration interfaces
interface BaseConfig {
  checklistKey: string;
}

interface DarwinCoreConfig extends BaseConfig {
  extensions: string[];
}

interface CubeConfig extends BaseConfig {
  dimensions: {
    spatialResolution: string;
    temporalResolution: string;
    taxonomicLevel: string;
  };
}

export default function ConfigurationStep({
  defaultChecklist,
  selectedFormat,
  onBack,
  onContinue,
}: ConfigurationStepProps) {
  const { checklists, loading } = useSupportedChecklists();
  const currentContextChecklistKey = useChecklistKey();
  const formatTitle = selectedFormat?.title;
  const isDarwinCoreArchive =
    formatTitle === 'DARWIN CORE ARCHIVE' || formatTitle?.includes('Darwin Core');
  const isCubeData = formatTitle === 'CUBE DATA';

  // Initialize configuration based on format
  const getInitialConfig = () => {
    const baseConfig = {
      checklistKey: currentContextChecklistKey ?? defaultChecklist,
    };

    if (isDarwinCoreArchive) {
      return { ...baseConfig, extensions: [] } as DarwinCoreConfig;
    }

    if (isCubeData) {
      return {
        ...baseConfig,
        dimensions: {
          spatialResolution: '0.1deg',
          temporalResolution: 'year',
          taxonomicLevel: 'species',
        },
      } as CubeConfig;
    }

    return baseConfig;
  };

  const [config, setConfig] = useState(getInitialConfig());
  const [isCubeValid, setIsCubeValid] = useState(false);

  // Determine which section should be expanded initially
  const getInitialActiveSection = () => {
    if (isDarwinCoreArchive) {
      return 'extensions'; // Expand extensions for Darwin Core Archive
    }
    if (isCubeData) {
      return 'dimensions'; // Expand dimensions for Cube Data
    }
    return 'taxonomy'; // Default to taxonomy if no other options
  };

  const [activeSection, setActiveSection] = useState<string | null>(getInitialActiveSection());

  const handleTaxonomyChange = (checklistKey: string) => {
    setConfig((prev) => ({ ...prev, checklistKey }));
  };

  const handleExtensionsChange = (extensions: string[]) => {
    if (isDarwinCoreArchive) {
      setConfig((prev) => ({ ...prev, extensions }));
    }
  };

  const handleDimensionsChange = (dimensions: any) => {
    if (isCubeData) {
      setConfig((prev) => ({ ...prev, dimensions }));
    }
  };

  const handleCubeValidationChange = (isValid: boolean) => {
    setIsCubeValid(isValid);
  };

  const handleContinue = () => {
    onContinue(config);
  };

  // Validation logic for cube data
  const isCubeConfigValid = () => {
    if (!isCubeData) {
      return true; // Not cube data, so no validation needed
    }

    return isCubeValid;
  };

  const canContinue = isCubeConfigValid();

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Get configuration summary for sidebar
  const getConfigSummary = () => {
    const summary = [
      { label: 'Format', value: selectedFormat.title },
      {
        label: 'Taxonomy',
        value: checklists.find((x) => x.key === config.checklistKey)?.alias ?? '',
      },
    ];

    if (isDarwinCoreArchive && 'extensions' in config) {
      summary.push({ label: 'Extensions', value: config.extensions.length.toString() });
    }

    if (isCubeData && 'dimensions' in config) {
      const dims = config.dimensions;
      summary.push({
        label: 'Spatial Res.',
        value: dims.spatialResolution,
      });
      summary.push({
        label: 'Temporal Res.',
        value: dims.temporalResolution,
      });
      summary.push({
        label: 'Taxonomic Level',
        value: dims.taxonomicLevel,
      });
    }

    summary.push({ label: 'CSV delimiter', value: 'TAB' });

    return summary;
  };

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-4">
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
          {/* Taxonomy Configuration - Always shown */}
          <TaxonomySelector
            value={config.checklistKey}
            onChange={handleTaxonomyChange}
            isExpanded={activeSection === 'taxonomy'}
            onToggle={() => toggleSection('taxonomy')}
          />

          {/* Extensions Selection - Only for Darwin Core Archive */}
          {isDarwinCoreArchive && 'extensions' in config && (
            <ExtensionsSelector
              selectedExtensions={config.extensions}
              onChange={handleExtensionsChange}
              isExpanded={activeSection === 'extensions'}
              onToggle={() => toggleSection('extensions')}
            />
          )}

          {/* Cube Dimensions - Only for Cube Data */}
          {isCubeData && 'dimensions' in config && (
            <CubeDimensionsSelector
              dimensions={config.dimensions}
              onChange={handleDimensionsChange}
              isExpanded={activeSection === 'dimensions'}
              onToggle={() => toggleSection('dimensions')}
              onValidationChange={handleCubeValidationChange}
            />
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Download Summary</h3>

            <div className="g-space-y-3 g-text-sm">
              {getConfigSummary().map((item) => (
                <div key={item.label} className="g-flex g-justify-between">
                  <span className="g-text-gray-600">{item.label}:</span>
                  <span className="g-font-medium">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="g-mt-6 g-pt-4 g-border-t g-border-gray-200">
              {canContinue && (
                <div className="g-text-sm g-text-amber-700 g-bg-amber-50 g-p-3 g-rounded g-mb-4">
                  <FormattedMessage id="downloadKey.downloadExpectTime" />
                </div>
              )}

              {!canContinue && (
                <div className="g-text-red-600 g-text-sm g-font-medium g-mb-4">
                  At least one dimension must be selected for cube data
                </div>
              )}

              <Button
                onClick={handleContinue}
                disabled={!canContinue}
                className="g-w-full g-flex g-items-center g-justify-center g-gap-2 disabled:g-opacity-50 disabled:g-cursor-not-allowed"
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
