import React from 'react';
import { FaThLarge, FaInfoCircle } from 'react-icons/fa';

interface CubeDimensions {
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

interface CubeDimensionsSelectorProps {
  dimensions: CubeDimensions;
  onChange: (dimensions: CubeDimensions) => void;
  isExpanded: boolean;
  onToggle: () => void;
  query?: any; // Current search query to determine which filters to show
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
  'EXACT_TAXON'
];

const TEMPORAL_GROUPS = [
  'YEAR',
  'YEARMONTH',
  'DATE'
];

const SPATIAL_GROUPS = [
  'EEA_REFERENCE_GRID',
  'EXTENDED_QUARTER_DEGREE_GRID',
  'ISEA3H_GRID',
  'MILITARY_GRID_REFERENCE_SYSTEM',
  'COUNTRY'
];

const HIGHER_TAXONOMIC_OPTIONS = [
  'KINGDOM',
  'PHYLUM',
  'CLASS',
  'ORDER',
  'FAMILY',
  'GENUS'
];

const RESOLUTION_OPTIONS: Record<string, number[]> = {
  EEA_REFERENCE_GRID: [25, 100, 250, 1000, 10000, 50000, 100000],
  EXTENDED_QUARTER_DEGREE_GRID: [0, 1, 2, 3, 4, 5, 6],
  ISEA3H_GRID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
  MILITARY_GRID_REFERENCE_SYSTEM: [0, 1, 10, 100, 1000, 10000, 100000]
};

const RESOLUTION_DEFAULTS: Record<string, number> = {
  EEA_REFERENCE_GRID: 1000,
  EXTENDED_QUARTER_DEGREE_GRID: 2,
  ISEA3H_GRID: 9,
  MILITARY_GRID_REFERENCE_SYSTEM: 1000
};

export default function CubeDimensionsSelector({
  dimensions,
  onChange,
  isExpanded,
  onToggle,
  query = {}
}: CubeDimensionsSelectorProps) {
  
  const updateDimensions = (updates: Partial<CubeDimensions>) => {
    onChange({ ...dimensions, ...updates });
  };

  const getHigherTaxonomicGroups = () => {
    const index = TAXONOMIC_GROUPS.indexOf(dimensions.taxonomicLevel);
    if (!dimensions.taxonomicLevel || index === -1) {
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
    const current = dimensions.selectedHigherTaxonomyGroups || [];
    const updated = current.includes(group)
      ? current.filter(g => g !== group)
      : [...current, group];
    updateDimensions({ selectedHigherTaxonomyGroups: updated });
  };

  const isFormValid = () => {
    return !!(dimensions.taxonomicLevel || dimensions.temporalResolution || (dimensions.spatial && dimensions.resolution));
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
          <FaThLarge size={20} className="g-text-primary-600" />
          <div>
            <h3 className="g-font-semibold g-text-gray-900">Cube Dimensions</h3>
            <p className="g-text-sm g-text-gray-600">
              Configure spatial, temporal, and taxonomic resolution
            </p>
          </div>
        </div>
        <div className="g-text-sm g-text-gray-500">
          {dimensions.spatial || 'None'} × {dimensions.temporalResolution || 'None'} × {dimensions.taxonomicLevel || 'None'}
        </div>
      </button>

      {isExpanded && (
        <div className="g-border-t g-border-gray-200 g-p-6 g-space-y-8">
          <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
            <div className="g-flex g-items-start g-gap-3">
              <FaInfoCircle size={16} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
              <p className="g-text-sm g-text-blue-800">
                Cube data aggregates occurrence records across three dimensions. At least one dimension must be selected.
              </p>
            </div>
          </div>

          {/* Dimensions */}
          <fieldset className="g-space-y-6">
            <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-4">Dimensions</legend>
            
            {/* Taxonomic Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                Taxonomic dimension
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                Group occurrences by taxonomic level
              </p>
              <select
                value={dimensions.taxonomicLevel || ''}
                onChange={(e) => handleTaxonomicLevelChange(e.target.value)}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">None selected</option>
                {TAXONOMIC_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Temporal Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                Temporal dimension
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                Group occurrences by time period
              </p>
              <select
                value={dimensions.temporalResolution || ''}
                onChange={(e) => updateDimensions({ temporalResolution: e.target.value })}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">None selected</option>
                {TEMPORAL_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Spatial Dimension */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                Grid
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                Spatial grid system for aggregation
              </p>
              <select
                value={dimensions.spatial || ''}
                onChange={(e) => handleSpatialChange(e.target.value)}
                className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
              >
                <option value="">None selected</option>
                {SPATIAL_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>

              {/* Spatial Resolution */}
              {dimensions.spatial && dimensions.spatial !== 'COUNTRY' && (
                <div className="g-mt-4">
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Spatial resolution
                  </label>
                  <p className="g-text-sm g-text-gray-600 g-mb-3">
                    Grid cell size or resolution level
                  </p>
                  <select
                    value={dimensions.resolution || ''}
                    onChange={(e) => updateDimensions({ resolution: parseInt(e.target.value) })}
                    className="g-w-full g-p-2 g-border g-border-gray-300 g-rounded g-focus:ring-primary-500 g-focus:border-primary-500"
                  >
                    <option value="" disabled>None selected</option>
                    {(RESOLUTION_OPTIONS[dimensions.spatial] || []).map((res) => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Randomize Points */}
              {dimensions.spatial && (
                <div className="g-mt-4">
                  <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                    Randomize Points within Uncertainty Circle
                  </label>
                  <p className="g-text-sm g-text-gray-600 g-mb-3">
                    Add random offset to coordinates within uncertainty radius
                  </p>
                  <div className="g-flex g-gap-4">
                    <label className="g-flex g-items-center g-gap-2">
                      <input
                        type="radio"
                        name="randomize"
                        value="YES"
                        checked={dimensions.randomize === 'YES'}
                        onChange={(e) => updateDimensions({ randomize: e.target.value as 'YES' | 'NO' })}
                        className="g-h-4 g-w-4 g-text-primary-600"
                      />
                      <span className="g-text-sm">Yes</span>
                    </label>
                    <label className="g-flex g-items-center g-gap-2">
                      <input
                        type="radio"
                        name="randomize"
                        value="NO"
                        checked={dimensions.randomize === 'NO'}
                        onChange={(e) => updateDimensions({ randomize: e.target.value as 'YES' | 'NO' })}
                        className="g-h-4 g-w-4 g-text-primary-600"
                      />
                      <span className="g-text-sm">No</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          {/* Measurements */}
          <fieldset className="g-space-y-6">
            <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-4">Measurements</legend>
            
            <div>
              <label className="g-flex g-items-start g-gap-3">
                <input type="checkbox" checked disabled className="g-mt-1 g-h-4 g-w-4" />
                <div>
                  <span className="g-font-medium">Occurrence count (always included)</span>
                  <p className="g-text-sm g-text-gray-600">
                    Number of occurrence records in each cube cell
                  </p>
                </div>
              </label>
            </div>

            {/* Higher Taxonomy Groups */}
            {!disableHigherTaxonomy && (
              <div>
                <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                  Occurrence count at higher taxonomic level
                </label>
                <p className="g-text-sm g-text-gray-600 g-mb-3">
                  Include counts aggregated at broader taxonomic levels
                </p>
                <div className="g-space-y-2">
                  {higherTaxonomicGroups.map((group) => (
                    <label key={group} className="g-flex g-items-center g-gap-3">
                      <input
                        type="checkbox"
                        checked={(dimensions.selectedHigherTaxonomyGroups || []).includes(group)}
                        onChange={() => toggleHigherTaxonomyGroup(group)}
                        className="g-h-4 g-w-4 g-text-primary-600"
                      />
                      <span className="g-text-sm">{group}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Coordinate Uncertainty */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                Include minimum coordinate uncertainty
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                Include the minimum spatial uncertainty for records in each cell
              </p>
              <div className="g-flex g-gap-4">
                <label className="g-flex g-items-center g-gap-2">
                  <input
                    type="radio"
                    name="includeSpatialUncertainty"
                    value="YES"
                    checked={dimensions.includeSpatialUncertainty === 'YES'}
                    onChange={(e) => updateDimensions({ includeSpatialUncertainty: e.target.value as 'YES' | 'NO' })}
                    className="g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Yes</span>
                </label>
                <label className="g-flex g-items-center g-gap-2">
                  <input
                    type="radio"
                    name="includeSpatialUncertainty"
                    value="NO"
                    checked={dimensions.includeSpatialUncertainty === 'NO'}
                    onChange={(e) => updateDimensions({ includeSpatialUncertainty: e.target.value as 'YES' | 'NO' })}
                    className="g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">No</span>
                </label>
              </div>
            </div>

            {/* Temporal Uncertainty */}
            <div>
              <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
                Include minimum temporal uncertainty
              </label>
              <p className="g-text-sm g-text-gray-600 g-mb-3">
                Include the minimum temporal uncertainty for records in each cell
              </p>
              <div className="g-flex g-gap-4">
                <label className="g-flex g-items-center g-gap-2">
                  <input
                    type="radio"
                    name="includeTemporalUncertainty"
                    value="YES"
                    checked={dimensions.includeTemporalUncertainty === 'YES'}
                    onChange={(e) => updateDimensions({ includeTemporalUncertainty: e.target.value as 'YES' | 'NO' })}
                    className="g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Yes</span>
                </label>
                <label className="g-flex g-items-center g-gap-2">
                  <input
                    type="radio"
                    name="includeTemporalUncertainty"
                    value="NO"
                    checked={dimensions.includeTemporalUncertainty === 'NO'}
                    onChange={(e) => updateDimensions({ includeTemporalUncertainty: e.target.value as 'YES' | 'NO' })}
                    className="g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">No</span>
                </label>
              </div>
            </div>
          </fieldset>

          {/* Data Quality */}
          <fieldset className="g-space-y-4">
            <legend className="g-text-lg g-font-medium g-text-gray-900 g-mb-4">Data quality</legend>
            <p className="g-text-sm g-text-gray-600 g-mb-4">
              Apply quality filters to exclude problematic records
            </p>
            
            <div className="g-space-y-3">
              {!query.has_geospatial_issue && (
                <label className="g-flex g-items-start g-gap-3">
                  <input
                    type="checkbox"
                    checked={dimensions.removeRecordsWithGeospatialIssues}
                    onChange={(e) => updateDimensions({ removeRecordsWithGeospatialIssues: e.target.checked })}
                    className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Remove records with known geospatial issues</span>
                </label>
              )}
              
              <label className="g-flex g-items-start g-gap-3">
                <input
                  type="checkbox"
                  checked={dimensions.removeRecordsTaxonIssues}
                  onChange={(e) => updateDimensions({ removeRecordsTaxonIssues: e.target.checked })}
                  className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                />
                <span className="g-text-sm">Remove records matched to a higher taxon</span>
              </label>
              
              {!query.distance_from_centroid_in_meters && (
                <label className="g-flex g-items-start g-gap-3">
                  <input
                    type="checkbox"
                    checked={dimensions.removeRecordsAtCentroids}
                    onChange={(e) => updateDimensions({ removeRecordsAtCentroids: e.target.checked })}
                    className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Remove records located at country centroids</span>
                </label>
              )}
              
              {!query.basis_of_record && (
                <label className="g-flex g-items-start g-gap-3">
                  <input
                    type="checkbox"
                    checked={dimensions.removeFossilsAndLiving}
                    onChange={(e) => updateDimensions({ removeFossilsAndLiving: e.target.checked })}
                    className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Remove records that are fossils or living specimens</span>
                </label>
              )}
              
              {!query.occurrence_status && (
                <label className="g-flex g-items-start g-gap-3">
                  <input
                    type="checkbox"
                    checked={dimensions.removeAbsenceRecords}
                    onChange={(e) => updateDimensions({ removeAbsenceRecords: e.target.checked })}
                    className="g-mt-1 g-h-4 g-w-4 g-text-primary-600"
                  />
                  <span className="g-text-sm">Remove absence records</span>
                </label>
              )}
            </div>
          </fieldset>

          {/* Validation Message */}
          {!isFormValid() && (
            <div className="g-text-red-600 g-text-sm g-font-medium">
              At least one dimension must be selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}