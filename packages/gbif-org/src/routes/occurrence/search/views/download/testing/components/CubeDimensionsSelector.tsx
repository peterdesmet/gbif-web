import { FaInfoCircle } from 'react-icons/fa';
import { FaCube as CubeIcon } from 'react-icons/fa6';

import { useState, useEffect } from 'react';
import { generateCubeSql, hasAllFilters, hasFilter } from './cubeService';
import { Checkbox } from '@/components/ui/checkbox';
import { FilterType } from '@/contexts/filter';
import { FormattedMessage } from 'react-intl';
import { Formatted } from 'maplibre-gl';

interface CubeDimensionsSelectorProps {
  cube: CubeDimensions;
  onChange: (dimensions: CubeDimensions) => void;
  isExpanded: boolean;
  onToggle: () => void;
  filter?: FilterType; // Current search filter to determine which filters to show
  onValidationChange?: (isValid: boolean) => void;
}

export interface CubeDimensions {
  // Core dimensions
  spatialResolution: string;
  temporalResolution: string;
  taxonomicLevel: string;

  // Spatial configuration
  spatial: string;
  resolution: number | string;
  randomize: 'YES' | 'NO';

  // Uncertainty options
  includeTemporalUncertainty: 'YES' | 'NO';
  includeSpatialUncertainty: 'YES' | 'NO';

  // Higher taxonomy groups
  selectedHigherTaxonomyGroups: string[];

  // Data quality filters
  removeRecordsWithGeospatialIssues: boolean;
  removeRecordsTaxonIssues: boolean;
  removeRecordsAtCentroids: boolean;
  removeFossilsAndLiving: boolean;
  removeAbsenceRecords: boolean;
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
];

const TEMPORAL_GROUPS = ['YEAR', 'YEARMONTH', 'DATE'];

const SPATIAL_GROUPS = [
  'EEA_REFERENCE_GRID',
  'EXTENDED_QUARTER_DEGREE_GRID',
  'ISEA3H_GRID',
  'MILITARY_GRID_REFERENCE_SYSTEM',
  'COUNTRY',
];

const HIGHER_TAXONOMIC_OPTIONS = ['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS'];

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

export default function CubeDimensionsSelector({
  cube,
  onChange,
  isExpanded,
  onToggle,
  filter,
  onValidationChange,
}: CubeDimensionsSelectorProps) {
  const [isGeneratingSql, setIsGeneratingSql] = useState(false);
  const [sqlError, setSqlError] = useState<string | null>(null);
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

  // Notify parent component of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [cube, onValidationChange]);

  const handleEditSql = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsGeneratingSql(true);
    setSqlError(null);

    try {
      const result = await generateCubeSql(cube, undefined);
      if (!result.sql) {
        // If no SQL generated, navigate to empty SQL editor
        window.location.href = '/occurrence/download/sql';
        return;
      }

      // Navigate to SQL editor with generated SQL

      const searchParams = new URLSearchParams({ sql: result.sql });
      window.location.href = `/occurrence/download/sql?${searchParams.toString()}`;
    } catch (error) {
      console.error('Failed to generate SQL:', error);
      setSqlError('Failed to generate SQL. Please try again.');
    } finally {
      setIsGeneratingSql(false);
    }
  };

  const getHigherTaxonomicGroups = () => {
    const index = TAXONOMIC_GROUPS.indexOf(cube.taxonomicLevel);
    if (!cube.taxonomicLevel || index === -1) {
      return [];
    }
    return HIGHER_TAXONOMIC_OPTIONS.slice(0, index);
  };

  const handleSpatialChange = (spatial: string) => {
    const resolution = RESOLUTION_DEFAULTS[spatial] || '';
    updateDimensions({ spatial, resolution });
  };

  const handleTaxonomicLevelChange = (taxonomicLevel: string) => {
    const higherGroups = getHigherTaxonomicGroups();
    // Reset selected higher groups to match available options
    const selectedHigherTaxonomyGroups = higherGroups.slice();
    updateDimensions({ taxonomicLevel, selectedHigherTaxonomyGroups });
  };

  const toggleHigherTaxonomyGroup = (group: string) => {
    const current = cube.selectedHigherTaxonomyGroups || [];
    const updated = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    updateDimensions({ selectedHigherTaxonomyGroups: updated });
  };

  const isFormValid = () => {
    const hasTaxonomic = cube.taxonomicLevel && cube.taxonomicLevel !== '';
    const hasTemporal = cube.temporalResolution && cube.temporalResolution !== '';
    const hasSpatial =
      cube.spatial &&
      cube.spatial !== '' &&
      (cube.spatial === 'COUNTRY' || (cube.resolution && cube.resolution !== ''));

    return hasTaxonomic || hasTemporal || hasSpatial;
  };

  const higherTaxonomicGroups = getHigherTaxonomicGroups();
  const disableHigherTaxonomy = higherTaxonomicGroups.length < 1;

  return (
    <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
      <button
        onClick={onToggle}
        className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
      >
        <div className="g-flex g-items-center g-gap-3">
          <CubeIcon size={20} className="g-text-primary-600" />
          <div>
            <h3 className="g-font-semibold g-text-gray-900">
              <FormattedMessage
                id="customSqlDownload.cubeConfiguration"
                defaultMessage="Cube configuration"
              />
            </h3>
            <p className="g-text-sm g-text-gray-600">
              <FormattedMessage
                id="customSqlDownload.cubeDescription"
                defaultMessage="Configure spatial, temporal, and taxonomic resolution"
              />
            </p>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="g-border-t g-border-gray-200 g-p-6 g-space-y-8">
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

          {/* Dimensions */}
          <fieldset className="g-space-y-6">
            <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-4">
              <FormattedMessage id="customSqlDownload.dimensions" defaultMessage="Dimensions" />
            </legend>

            {/* Taxonomic Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                <FormattedMessage
                  id="customSqlDownload.taxonomicDimension"
                  defaultMessage="Taxonomic dimension"
                />
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                <FormattedMessage
                  id="customSqlDownload.help.taxonomicDimension"
                  defaultMessage="This dimension aggregates occurrences by their taxonomic rank."
                />
              </p>
              <select
                value={cube.taxonomicLevel || ''}
                onChange={(e) => handleTaxonomicLevelChange(e.target.value)}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">
                  <FormattedMessage
                    id="customSqlDownload.noneSelected"
                    defaultMessage="None selected"
                  />
                </option>
                {TAXONOMIC_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    <FormattedMessage
                      id={`customSqlDownload.taxon.${group}`}
                      defaultMessage={group}
                    />
                  </option>
                ))}
              </select>
            </div>

            {/* Temporal Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                <FormattedMessage
                  id="customSqlDownload.temporalDimension"
                  defaultMessage="Temporal dimension"
                />
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                <FormattedMessage
                  id="customSqlDownload.help.temporalDimension"
                  defaultMessage="This dimension aggregates occurrences by time."
                />
              </p>
              <select
                value={cube.temporalResolution || ''}
                onChange={(e) => updateDimensions({ temporalResolution: e.target.value })}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">
                  <FormattedMessage
                    id="customSqlDownload.noneSelected"
                    defaultMessage="None selected"
                  />
                </option>
                {TEMPORAL_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    <FormattedMessage
                      id={`customSqlDownload.time.${group}`}
                      defaultMessage={group}
                    />
                  </option>
                ))}
              </select>
            </div>

            {/* Spatial Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                <FormattedMessage
                  id="customSqlDownload.spatialDimension"
                  defaultMessage="Spatial dimension"
                />
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                <FormattedMessage
                  id="customSqlDownload.help.grid"
                  defaultMessage="This dimension aggregates occurrences in a spatial grid."
                />
              </p>
              <select
                value={cube.spatial || ''}
                onChange={(e) => handleSpatialChange(e.target.value)}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">
                  <FormattedMessage
                    id="customSqlDownload.noneSelected"
                    defaultMessage="None selected"
                  />
                </option>
                {SPATIAL_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    <FormattedMessage
                      id={`customSqlDownload.grid.${group}`}
                      defaultMessage={group}
                    />
                  </option>
                ))}
              </select>

              {/* Spatial Resolution */}
              {cube.spatial && cube.spatial !== 'COUNTRY' && (
                <div className="g-mt-4">
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    <FormattedMessage
                      id="customSqlDownload.spatialResolution"
                      defaultMessage="Spatial resolution"
                    />
                  </label>
                  <p className="g-text-sm g-text-gray-600 g-mb-3">
                    <FormattedMessage
                      id="customSqlDownload.help.gridResolution"
                      defaultMessage="The size of each grid cell."
                    />
                  </p>
                  <select
                    value={cube.resolution || ''}
                    onChange={(e) => updateDimensions({ resolution: parseInt(e.target.value) })}
                    className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
                  >
                    <option value="" disabled>
                      <FormattedMessage
                        id="customSqlDownload.noneSelected"
                        defaultMessage="None selected"
                      />
                    </option>
                    {(RESOLUTION_OPTIONS[cube.spatial] || []).map((res) => (
                      <option key={res} value={res}>
                        <FormattedMessage
                          id={`customSqlDownload.resolution.${cube.spatial}.${res}`}
                          defaultMessage={res.toString()}
                        />
                      </option>
                    ))}
                  </select>
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
                  <div className="g-flex g-gap-4">
                    <label className="g-flex g-items-center g-gap-2">
                      <input
                        type="radio"
                        name="randomize"
                        value="YES"
                        checked={cube.randomize === 'YES'}
                        onChange={(e) =>
                          updateDimensions({ randomize: e.target.value as 'YES' | 'NO' })
                        }
                        className="g-h-4 g-w-4 g-text-primary-600"
                      />
                      <span className="g-text-sm">
                        <FormattedMessage id="customSqlDownload.boolean.YES" defaultMessage="Yes" />
                      </span>
                    </label>
                    <label className="g-flex g-items-center g-gap-2">
                      <input
                        type="radio"
                        name="randomize"
                        value="NO"
                        checked={cube.randomize === 'NO'}
                        onChange={(e) =>
                          updateDimensions({ randomize: e.target.value as 'YES' | 'NO' })
                        }
                        className="g-h-4 g-w-4 g-text-primary-600"
                      />
                      <span className="g-text-sm">
                        <FormattedMessage id="customSqlDownload.boolean.NO" defaultMessage="No" />
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Measurements */}
          <fieldset className="g-bg-white g-rounded g-shadow-lg g-border g-border-gray-200 g-p-4">
            <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-0 g-px-2">
              <FormattedMessage id="customSqlDownload.measurements" defaultMessage="Measures" />
            </legend>
            <div className="g-space-y-6">
              <div className="g-text-slate-500 g-text-sm g-mb-8">
                <FormattedMessage id="customSqlDownload.help.measurements" />
              </div>

              <div>
                <label className="g-flex g-items-start g-gap-3">
                  <Checkbox checked disabled className="g-mt-1 g-h-4 g-w-4" />
                  <div>
                    <span className="g-font-medium g-text-sm">
                      <FormattedMessage
                        id="customSqlDownload.occurrenceMeasurements"
                        defaultMessage="Occurrence count (always included)"
                      />
                    </span>
                    <p className="g-text-sm g-text-gray-600">
                      <FormattedMessage
                        id="customSqlDownload.help.occurrenceCount"
                        defaultMessage="The number of occurrences."
                      />
                    </p>
                  </div>
                </label>
              </div>

              {/* Higher Taxonomy Groups */}
              {!disableHigherTaxonomy && (
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
                      <label key={group} className="g-flex g-items-center g-gap-3">
                        <Checkbox
                          checked={(cube.selectedHigherTaxonomyGroups || []).includes(group)}
                          onCheckedChange={() => toggleHigherTaxonomyGroup(group)}
                          className="g-h-4 g-w-4 g-text-primary-600"
                        />
                        <span className="g-text-sm">
                          <FormattedMessage
                            id={`customSqlDownload.taxon.${group}`}
                            defaultMessage={group}
                          />
                        </span>
                      </label>
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
                <div className="g-flex g-gap-4">
                  <label className="g-flex g-items-center g-gap-2">
                    <input
                      type="radio"
                      name="includeSpatialUncertainty"
                      value="YES"
                      checked={cube.includeSpatialUncertainty === 'YES'}
                      onChange={(e) =>
                        updateDimensions({
                          includeSpatialUncertainty: e.target.value as 'YES' | 'NO',
                        })
                      }
                      className="g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.boolean.YES" defaultMessage="Yes" />
                    </span>
                  </label>
                  <label className="g-flex g-items-center g-gap-2">
                    <input
                      type="radio"
                      name="includeSpatialUncertainty"
                      value="NO"
                      checked={cube.includeSpatialUncertainty === 'NO'}
                      onChange={(e) =>
                        updateDimensions({
                          includeSpatialUncertainty: e.target.value as 'YES' | 'NO',
                        })
                      }
                      className="g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.boolean.NO" defaultMessage="No" />
                    </span>
                  </label>
                </div>
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
                <div className="g-flex g-gap-4">
                  <label className="g-flex g-items-center g-gap-2">
                    <input
                      type="radio"
                      name="includeTemporalUncertainty"
                      value="YES"
                      checked={cube.includeTemporalUncertainty === 'YES'}
                      onChange={(e) =>
                        updateDimensions({
                          includeTemporalUncertainty: e.target.value as 'YES' | 'NO',
                        })
                      }
                      className="g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.boolean.YES" defaultMessage="Yes" />
                    </span>
                  </label>
                  <label className="g-flex g-items-center g-gap-2">
                    <input
                      type="radio"
                      name="includeTemporalUncertainty"
                      value="NO"
                      checked={cube.includeTemporalUncertainty === 'NO'}
                      onChange={(e) =>
                        updateDimensions({
                          includeTemporalUncertainty: e.target.value as 'YES' | 'NO',
                        })
                      }
                      className="g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.boolean.NO" defaultMessage="No" />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* Data Quality */}
          {!hideDataQuality && (
            <fieldset className="g-space-y-4">
              <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-4">
                <FormattedMessage
                  id="customSqlDownload.dataQuality"
                  defaultMessage="Data quality"
                />
              </legend>
              <p className="g-text-sm g-text-gray-600 g-mb-4">
                <FormattedMessage
                  id="customSqlDownload.help.dataQuality"
                  defaultMessage="Apply quality filters to exclude problematic records"
                />
              </p>

              <div className="g-space-y-3">
                {!hasFilter(filter, 'hasGeospatialIssue') && (
                  <label className="g-flex g-items-start g-gap-3">
                    <Checkbox
                      checked={cube.removeRecordsWithGeospatialIssues}
                      onCheckedChange={(checked) =>
                        updateDimensions({ removeRecordsWithGeospatialIssues: checked as boolean })
                      }
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.removeRecordsWithGeospatialIssues" />
                    </span>
                  </label>
                )}
                {!hasFilter(filter, 'taxonomicIssue') && (
                  <label className="g-flex g-items-start g-gap-3">
                    <Checkbox
                      checked={cube.removeRecordsTaxonIssues}
                      onCheckedChange={(checked) =>
                        updateDimensions({ removeRecordsTaxonIssues: checked as boolean })
                      }
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.removeRecordsTaxonIssues" />
                    </span>
                  </label>
                )}

                {!hasFilter(filter, 'distanceFromCentroidInMeters') && (
                  <label className="g-flex g-items-start g-gap-3">
                    <Checkbox
                      checked={cube.removeRecordsAtCentroids}
                      onCheckedChange={(checked) =>
                        updateDimensions({ removeRecordsAtCentroids: checked as boolean })
                      }
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.removeRecordsAtCentroids" />
                    </span>
                  </label>
                )}

                {!hasFilter(filter, 'basisOfRecord') && (
                  <label className="g-flex g-items-start g-gap-3">
                    <Checkbox
                      checked={cube.removeFossilsAndLiving}
                      onCheckedChange={(checked) =>
                        updateDimensions({ removeFossilsAndLiving: checked as boolean })
                      }
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.removeFossilsAndLiving" />
                    </span>
                  </label>
                )}

                {!hasFilter(filter, 'occurrenceStatus') && (
                  <label className="g-flex g-items-start g-gap-3">
                    <Checkbox
                      checked={cube.removeAbsenceRecords}
                      onCheckedChange={(checked) =>
                        updateDimensions({ removeAbsenceRecords: checked as boolean })
                      }
                      className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                    />
                    <span className="g-text-sm">
                      <FormattedMessage id="customSqlDownload.removeAbsenceRecords" />
                    </span>
                  </label>
                )}
              </div>
            </fieldset>
          )}

          {/* Validation Message */}
          {!isFormValid() && (
            <div className="g-text-red-600 g-text-sm g-font-medium">
              <FormattedMessage
                id="customSqlDownload.errorMinimumDimension"
                defaultMessage="At least one dimension must be selected"
              />
            </div>
          )}

          {/* Edit SQL Link */}
          <div className="g-mt-6 g-pt-6 g-border-t g-border-gray-200">
            <div className="g-flex g-items-center g-justify-between">
              <div>
                <button
                  onClick={handleEditSql}
                  disabled={!isFormValid() || isGeneratingSql}
                  className="g-text-primary-600 hover:g-text-primary-700 g-text-sm g-font-medium g-underline disabled:g-text-gray-400 disabled:g-no-underline"
                >
                  {isGeneratingSql ? (
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
          </div>
        </div>
      )}
    </div>
  );
}
