import { FaInfoCircle } from 'react-icons/fa';
import { FaCube as CubeIcon } from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { generateCubeSql, hasAllFilters, hasFilter } from './cubeService';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterType } from '@/contexts/filter';
import { FormattedMessage } from 'react-intl';
import ExpandableSection from './ExpandableSection';

// ============================================================================
// Types & Constants
// ============================================================================

export interface CubeDimensions {
  spatialResolution: string;
  temporalResolution: string;
  taxonomicLevel: string;
  spatial: string;
  resolution: number | string;
  randomize: 'YES' | 'NO';
  includeTemporalUncertainty: 'YES' | 'NO';
  includeSpatialUncertainty: 'YES' | 'NO';
  selectedHigherTaxonomyGroups: string[];
  removeRecordsWithGeospatialIssues: boolean;
  removeRecordsTaxonIssues: boolean;
  removeRecordsAtCentroids: boolean;
  removeFossilsAndLiving: boolean;
  removeAbsenceRecords: boolean;
}

interface CubeDimensionsSelectorProps {
  cube: CubeDimensions;
  onChange: (dimensions: CubeDimensions) => void;
  isExpanded: boolean;
  onToggle: () => void;
  filter?: FilterType;
  onValidationChange?: (isValid: boolean) => void;
}

const TAXONOMIC_GROUPS = [
  'KINGDOM',
  'PHYLUM',
  'CLASS',
  'ORDER',
  'FAMILY',
  'GENUS',
  'SPECIES',
  'ACCEPTED_TAXON',
  'EXACT_TAXON',
] as const;

const TEMPORAL_GROUPS = ['YEAR', 'YEARMONTH', 'DATE'] as const;

const SPATIAL_GROUPS = [
  'EEA_REFERENCE_GRID',
  'EXTENDED_QUARTER_DEGREE_GRID',
  'ISEA3H_GRID',
  'MILITARY_GRID_REFERENCE_SYSTEM',
  'COUNTRY',
] as const;

const HIGHER_TAXONOMIC_OPTIONS = [
  'KINGDOM',
  'PHYLUM',
  'CLASS',
  'ORDER',
  'FAMILY',
  'GENUS',
] as const;

const RESOLUTION_OPTIONS: Record<string, number[]> = {
  EEA_REFERENCE_GRID: [25, 100, 250, 1000, 10000, 50000, 100000],
  EXTENDED_QUARTER_DEGREE_GRID: [0, 1, 2, 3, 4, 5, 6],
  ISEA3H_GRID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  MILITARY_GRID_REFERENCE_SYSTEM: [0, 1, 10, 100, 1000, 10000, 100000],
};

const RESOLUTION_DEFAULTS: Record<string, number> = {
  EEA_REFERENCE_GRID: 1000,
  EXTENDED_QUARTER_DEGREE_GRID: 2,
  ISEA3H_GRID: 9,
  MILITARY_GRID_REFERENCE_SYSTEM: 1000,
};

// ============================================================================
// Custom Hooks
// ============================================================================

function useFormValidation(cube: CubeDimensions, onValidationChange?: (isValid: boolean) => void) {
  const isValid = () => {
    const hasTaxonomic = Boolean(cube.taxonomicLevel);
    const hasTemporal = Boolean(cube.temporalResolution);
    const hasSpatial =
      Boolean(cube.spatial) && (cube.spatial === 'COUNTRY' || Boolean(cube.resolution));

    return hasTaxonomic || hasTemporal || hasSpatial;
  };

  useEffect(() => {
    onValidationChange?.(isValid());
  }, [cube, onValidationChange]);

  return isValid();
}

function useSqlGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAndNavigate = async (cube: CubeDimensions) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCubeSql(cube, undefined);
      const url = result.sql
        ? `/occurrence/download/sql?${new URLSearchParams({ sql: result.sql })}`
        : '/occurrence/download/sql';
      window.location.href = url;
    } catch (err) {
      console.error('Failed to generate SQL:', err);
      setError('Failed to generate SQL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generateAndNavigate };
}

// ============================================================================
// Sub-components
// ============================================================================

interface RadioGroupProps {
  name: string;
  value: 'YES' | 'NO';
  onChange: (value: 'YES' | 'NO') => void;
}

function RadioGroup({ name, value, onChange }: RadioGroupProps) {
  return (
    <div className="g-flex g-gap-4">
      <label className="g-flex g-items-center g-gap-2">
        <input
          type="radio"
          name={name}
          value="YES"
          checked={value === 'YES'}
          onChange={(e) => onChange(e.target.value as 'YES' | 'NO')}
          className="g-h-4 g-w-4 g-text-primary-600"
        />
        <span className="g-text-sm">
          <FormattedMessage id="customSqlDownload.boolean.YES" defaultMessage="Yes" />
        </span>
      </label>
      <label className="g-flex g-items-center g-gap-2">
        <input
          type="radio"
          name={name}
          value="NO"
          checked={value === 'NO'}
          onChange={(e) => onChange(e.target.value as 'YES' | 'NO')}
          className="g-h-4 g-w-4 g-text-primary-600"
        />
        <span className="g-text-sm">
          <FormattedMessage id="customSqlDownload.boolean.NO" defaultMessage="No" />
        </span>
      </label>
    </div>
  );
}

interface CheckboxFieldProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  labelId: string;
  labelDefault?: string;
  helpText?: string;
  disabled?: boolean;
}

function CheckboxField({
  checked,
  onCheckedChange,
  labelId,
  labelDefault,
  helpText,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <label className="g-flex g-items-start g-gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
      />
      <div>
        <span className={`g-text-sm ${disabled ? '' : 'g-font-medium'}`}>
          <FormattedMessage id={labelId} defaultMessage={labelDefault || labelId} />
        </span>
        {helpText && (
          <p className="g-text-sm g-text-gray-600">
            <FormattedMessage id={helpText} />
          </p>
        )}
      </div>
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  helpText: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[] | number[];
  translationPrefix: string;
  noneSelectedText?: string;
  disableNone?: boolean;
}

function SelectField({
  label,
  helpText,
  value,
  onChange,
  options,
  translationPrefix,
  noneSelectedText = 'None selected',
  disableNone = false,
}: SelectFieldProps) {
  return (
    <div>
      <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
        <FormattedMessage id={label} defaultMessage={label} />
      </label>
      <p className="g-text-sm g-text-gray-600 g-mb-3">
        <FormattedMessage id={helpText} defaultMessage={helpText} />
      </p>
      <div className="g-w-full g-pe-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="g-w-full g-p-2 g-pe-0 g-rounded"
        >
          <option value="" disabled={disableNone}>
            <FormattedMessage
              id="customSqlDownload.noneSelected"
              defaultMessage={noneSelectedText}
            />
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              <FormattedMessage
                id={`${translationPrefix}.${option}`}
                defaultMessage={String(option)}
              />
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface FieldsetSectionProps {
  title: string;
  helpText?: string;
  children: React.ReactNode;
}

function FieldsetSection({ title, helpText, children }: FieldsetSectionProps) {
  return (
    <fieldset className="g-bg-white g-rounded g-shadow-lg g-border g-border-gray-200 g-p-4">
      <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-0 g-px-2">
        <FormattedMessage id={title} defaultMessage={title} />
      </legend>
      <div className="g-space-y-4">
        {helpText && (
          <div className="g-text-slate-500 g-text-sm g-mb-8">
            <FormattedMessage id={helpText} />
          </div>
        )}
        {children}
      </div>
    </fieldset>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CubeDimensionsSelector({
  cube,
  onChange,
  isExpanded,
  onToggle,
  filter,
  onValidationChange,
}: CubeDimensionsSelectorProps) {
  const isFormValid = useFormValidation(cube, onValidationChange);
  const { isGenerating, error: sqlError, generateAndNavigate } = useSqlGeneration();

  const hideDataQuality = hasAllFilters(filter, [
    'hasGeospatialIssue',
    'taxonomicIssue',
    'distanceFromCentroidInMeters',
    'basisOfRecord',
    'occurrenceStatus',
  ]);

  const updateDimensions = (updates: Partial<CubeDimensions>) => {
    onChange({ ...cube, ...updates });
  };

  const handleEditSql = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    generateAndNavigate(cube);
  };

  const getHigherTaxonomicGroups = () => {
    const index = TAXONOMIC_GROUPS.indexOf(cube.taxonomicLevel as any);
    return index === -1 ? [] : HIGHER_TAXONOMIC_OPTIONS.slice(0, index);
  };

  const handleSpatialChange = (spatial: string) => {
    const resolution = RESOLUTION_DEFAULTS[spatial] || '';
    updateDimensions({ spatial, resolution });
  };

  const handleTaxonomicLevelChange = (taxonomicLevel: string) => {
    const higherGroups = getHigherTaxonomicGroups();
    updateDimensions({
      taxonomicLevel,
      selectedHigherTaxonomyGroups: higherGroups.slice(),
    });
  };

  const toggleHigherTaxonomyGroup = (group: string) => {
    const current = cube.selectedHigherTaxonomyGroups || [];
    const updated = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    updateDimensions({ selectedHigherTaxonomyGroups: updated });
  };

  const higherTaxonomicGroups = getHigherTaxonomicGroups();

  return (
    <ExpandableSection
      icon={<CubeIcon size={20} className="g-text-primary-600" />}
      title={
        <FormattedMessage
          id="customSqlDownload.cubeConfiguration"
          defaultMessage="Cube configuration"
        />
      }
      description={
        <FormattedMessage
          id="customSqlDownload.cubeDescription"
          defaultMessage="Configure spatial, temporal, and taxonomic resolution"
        />
      }
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {isExpanded && (
        <div className="g-space-y-8">
          {/* Info Banner */}
          <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
            <div className="g-flex g-items-start g-gap-3">
              <FaInfoCircle size={16} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
              <p className="g-text-sm g-text-blue-800">
                <FormattedMessage
                  id="customSqlDownload.help.whatIsThis"
                  defaultMessage="This download format allows you to aggregate occurrences by their taxonomic, temporal and/or spatial properties."
                />
              </p>
            </div>
          </div>

          {/* Dimensions Section */}
          <FieldsetSection
            title="customSqlDownload.dimensions"
            helpText="customSqlDownload.help.dimensions"
          >
            {/* Taxonomic Dimension */}
            <SelectField
              label="customSqlDownload.taxonomicDimension"
              helpText="customSqlDownload.help.taxonomicDimension"
              value={cube.taxonomicLevel || ''}
              onChange={handleTaxonomicLevelChange}
              options={TAXONOMIC_GROUPS}
              translationPrefix="customSqlDownload.taxon"
            />

            {/* Temporal Dimension */}
            <SelectField
              label="customSqlDownload.temporalDimension"
              helpText="customSqlDownload.help.temporalDimension"
              value={cube.temporalResolution || ''}
              onChange={(value) => updateDimensions({ temporalResolution: value })}
              options={TEMPORAL_GROUPS}
              translationPrefix="customSqlDownload.time"
            />

            {/* Spatial Dimension */}
            <div>
              <SelectField
                label="customSqlDownload.spatialDimension"
                helpText="customSqlDownload.help.grid"
                value={cube.spatial || ''}
                onChange={handleSpatialChange}
                options={SPATIAL_GROUPS}
                translationPrefix="customSqlDownload.grid"
              />

              {/* Spatial Resolution */}
              {cube.spatial && cube.spatial !== 'COUNTRY' && (
                <div className="g-mt-4">
                  <SelectField
                    label="customSqlDownload.spatialResolution"
                    helpText="customSqlDownload.help.gridResolution"
                    value={String(cube.resolution || '')}
                    onChange={(value) => updateDimensions({ resolution: parseInt(value) })}
                    options={RESOLUTION_OPTIONS[cube.spatial] || []}
                    translationPrefix={`customSqlDownload.resolution.${cube.spatial}`}
                    disableNone
                  />
                </div>
              )}

              {/* Randomize Points */}
              {cube.spatial && (
                <div className="g-mt-4">
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    <FormattedMessage
                      id="customSqlDownload.randomPoints"
                      defaultMessage="Randomize points within uncertainty circle"
                    />
                  </label>
                  <p className="g-text-sm g-text-gray-600 g-mb-3">
                    <FormattedMessage
                      id="customSqlDownload.help.randomizePoints"
                      defaultMessage="For occurrence records with a coordinate uncertainty that covers more than one grid cell, should a random cell be chosen?"
                    />
                  </p>
                  <RadioGroup
                    name="randomize"
                    value={cube.randomize}
                    onChange={(value) => updateDimensions({ randomize: value })}
                  />
                </div>
              )}
            </div>
          </FieldsetSection>

          {/* Measurements Section */}
          <FieldsetSection
            title="customSqlDownload.measurements"
            helpText="customSqlDownload.help.measurements"
          >
            {/* Occurrence Count (Always Included) */}
            <CheckboxField
              checked={true}
              disabled={true}
              labelId="customSqlDownload.occurrenceMeasurements"
              labelDefault="Occurrence count (always included)"
              helpText="customSqlDownload.help.occurrenceCount"
            />

            {/* Higher Taxonomy Groups */}
            {higherTaxonomicGroups.length > 0 && (
              <div>
                <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                  <FormattedMessage
                    id="customSqlDownload.countHigherTaxonomy"
                    defaultMessage="Occurrence count at higher taxonomic level"
                  />
                </label>
                <p className="g-text-sm g-text-gray-600 g-mb-3">
                  <FormattedMessage
                    id="customSqlDownload.help.higherTaxonomy"
                    defaultMessage="Additional higher taxonomic ranks for which the number of occurrences should also be included."
                  />
                </p>
                <div className="g-space-y-2">
                  {higherTaxonomicGroups.map((group) => (
                    <CheckboxField
                      key={group}
                      checked={(cube.selectedHigherTaxonomyGroups || []).includes(group)}
                      onCheckedChange={() => toggleHigherTaxonomyGroup(group)}
                      labelId={`customSqlDownload.taxon.${group}`}
                      labelDefault={group}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coordinate Uncertainty */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                <FormattedMessage
                  id="customSqlDownload.coordinateUncertainty"
                  defaultMessage="Include minimum coordinate uncertainty"
                />
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                <FormattedMessage
                  id="customSqlDownload.help.minCoordinateUncertainty"
                  defaultMessage="The lowest recorded coordinate uncertainty (in meters)."
                />
              </p>
              <RadioGroup
                name="includeSpatialUncertainty"
                value={cube.includeSpatialUncertainty}
                onChange={(value) => updateDimensions({ includeSpatialUncertainty: value })}
              />
            </div>

            {/* Temporal Uncertainty */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                <FormattedMessage
                  id="customSqlDownload.temporalUncertainty"
                  defaultMessage="Include minimum temporal uncertainty"
                />
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                <FormattedMessage
                  id="customSqlDownload.help.minTemporalUncertainty"
                  defaultMessage="The lowest recorded temporal uncertainty (in seconds)."
                />
              </p>
              <RadioGroup
                name="includeTemporalUncertainty"
                value={cube.includeTemporalUncertainty}
                onChange={(value) => updateDimensions({ includeTemporalUncertainty: value })}
              />
            </div>
          </FieldsetSection>

          {/* Data Quality Section */}
          {!hideDataQuality && (
            <FieldsetSection
              title="customSqlDownload.dataQuality"
              helpText="customSqlDownload.help.dataQuality"
            >
              <div className="g-space-y-3">
                {!hasFilter(filter, 'hasGeospatialIssue') && (
                  <CheckboxField
                    checked={cube.removeRecordsWithGeospatialIssues}
                    onCheckedChange={(checked) =>
                      updateDimensions({ removeRecordsWithGeospatialIssues: checked as boolean })
                    }
                    labelId="customSqlDownload.removeRecordsWithGeospatialIssues"
                  />
                )}
                {!hasFilter(filter, 'taxonomicIssue') && (
                  <CheckboxField
                    checked={cube.removeRecordsTaxonIssues}
                    onCheckedChange={(checked) =>
                      updateDimensions({ removeRecordsTaxonIssues: checked as boolean })
                    }
                    labelId="customSqlDownload.removeRecordsTaxonIssues"
                  />
                )}
                {!hasFilter(filter, 'distanceFromCentroidInMeters') && (
                  <CheckboxField
                    checked={cube.removeRecordsAtCentroids}
                    onCheckedChange={(checked) =>
                      updateDimensions({ removeRecordsAtCentroids: checked as boolean })
                    }
                    labelId="customSqlDownload.removeRecordsAtCentroids"
                  />
                )}
                {!hasFilter(filter, 'basisOfRecord') && (
                  <CheckboxField
                    checked={cube.removeFossilsAndLiving}
                    onCheckedChange={(checked) =>
                      updateDimensions({ removeFossilsAndLiving: checked as boolean })
                    }
                    labelId="customSqlDownload.removeFossilsAndLiving"
                  />
                )}
                {!hasFilter(filter, 'occurrenceStatus') && (
                  <CheckboxField
                    checked={cube.removeAbsenceRecords}
                    onCheckedChange={(checked) =>
                      updateDimensions({ removeAbsenceRecords: checked as boolean })
                    }
                    labelId="customSqlDownload.removeAbsenceRecords"
                  />
                )}
              </div>
            </FieldsetSection>
          )}

          {/* Validation Message */}
          {!isFormValid && (
            <div className="g-text-red-600 g-text-sm g-font-medium">
              <FormattedMessage
                id="customSqlDownload.errorMinimumDimension"
                defaultMessage="At least one dimension must be selected"
              />
            </div>
          )}

          {/* Edit SQL Section */}
          <div className="g-mt-6 g-pt-6 g-border-t g-border-gray-200">
            <button
              onClick={handleEditSql}
              disabled={!isFormValid || isGenerating}
              className="g-text-primary-600 hover:g-text-primary-700 g-text-sm g-font-medium g-underline disabled:g-text-gray-400 disabled:g-no-underline"
            >
              {isGenerating ? (
                'Generating SQL...'
              ) : (
                <FormattedMessage id="customSqlDownload.editSql" defaultMessage="Edit as SQL" />
              )}
            </button>
            <p className="g-text-xs g-text-gray-600 g-mt-1">
              <FormattedMessage
                id="customSqlDownload.help.editSql"
                defaultMessage="The easiest way to download and explore data is via the occurrence search user interface. But for complex queries and aggregations, the SQL editor provides more freedom."
              />
            </p>
            {sqlError && <p className="g-text-xs g-text-red-600 g-mt-1">{sqlError}</p>}
          </div>
        </div>
      )}
    </ExpandableSection>
  );
}
