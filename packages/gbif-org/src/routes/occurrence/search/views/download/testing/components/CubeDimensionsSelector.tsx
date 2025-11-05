import { FaInfoCircle } from 'react-icons/fa';
import { FaCube as CubeIcon } from 'react-icons/fa6';
import { hasAllFilters, hasFilter } from './cubeService';
import { FormattedMessage } from 'react-intl';
import ExpandableSection from './ExpandableSection';

// Import types
import {
  CubeDimensions,
  CubeDimensionsSelectorProps,
  TAXONOMIC_GROUPS,
  TEMPORAL_GROUPS,
  SPATIAL_GROUPS,
  RESOLUTION_OPTIONS,
  RESOLUTION_DEFAULTS,
} from './cube/types';

// Import hooks
import { useFormValidation, useSqlGeneration } from './cube/hooks';

// Import components
import { RadioGroup, CheckboxField, SelectField, FieldsetSection } from './cube/components';

// Import utils
import { getHigherTaxonomicGroups } from './cube/utils';

// Re-export types for external consumers
export type { CubeDimensions };

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

  const handleSpatialChange = (spatial: string) => {
    const resolution = RESOLUTION_DEFAULTS[spatial] || '';
    updateDimensions({ spatial, resolution });
  };

  const handleTaxonomicLevelChange = (taxonomicLevel: string) => {
    const higherGroups = getHigherTaxonomicGroups(taxonomicLevel);
    updateDimensions({
      taxonomicLevel,
      selectedHigherTaxonomyGroups: Array.from(higherGroups),
    });
  };

  const toggleHigherTaxonomyGroup = (group: string) => {
    const current = cube.selectedHigherTaxonomyGroups || [];
    const updated = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    updateDimensions({ selectedHigherTaxonomyGroups: updated });
  };

  const higherTaxonomicGroups = getHigherTaxonomicGroups(cube.taxonomicLevel);

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
