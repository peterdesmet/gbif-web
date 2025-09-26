import { CubeDimensions } from '@/routes/occurrence/search/views/download/testing/components/CubeDimensionsSelector';

export interface CubeSqlGenerationOptions {
  taxonomy?: string;
  temporal?: string;
  spatial?: string;
  resolution?: number | string;
  randomize?: 'YES' | 'NO';
  higherGroups?: string[];
  includeTemporalUncertainty?: 'YES' | 'NO';
  includeSpatialUncertainty?: 'YES' | 'NO';
  predicate?: any;
  removeRecordsWithGeospatialIssues?: boolean;
  removeRecordsTaxonIssues?: boolean;
  removeRecordsAtCentroids?: boolean;
  removeFossilsAndLiving?: boolean;
  removeAbsenceRecords?: boolean;
}

export interface CubeSqlResponse {
  sql: string;
  machineDescription?: string;
}

/**
 * Converts CubeDimensions to the format expected by the SQL generation API
 */
export function convertCubeDimensionsToSqlOptions(
  dimensions: CubeDimensions,
  predicate?: any,
  query?: any
): CubeSqlGenerationOptions {
  const options: CubeSqlGenerationOptions = {
    taxonomy: dimensions.taxonomicLevel,
    temporal: dimensions.temporalResolution,
    spatial: dimensions.spatial,
    resolution: dimensions.resolution,
    randomize: dimensions.randomize,
    higherGroups: dimensions.selectedHigherTaxonomyGroups,
    includeTemporalUncertainty: dimensions.includeTemporalUncertainty,
    includeSpatialUncertainty: dimensions.includeSpatialUncertainty,
    predicate,
  };

  // Apply data quality filters
  const hasQualityFilter =
    dimensions.removeRecordsWithGeospatialIssues ||
    dimensions.removeRecordsTaxonIssues ||
    dimensions.removeRecordsAtCentroids ||
    dimensions.removeFossilsAndLiving ||
    dimensions.removeAbsenceRecords;

  if (hasQualityFilter) {
    const qualityPredicates: any[] = [];
    if (predicate) {
      qualityPredicates.push(predicate);
    }

    if (dimensions.removeRecordsWithGeospatialIssues && !query?.has_geospatial_issue) {
      qualityPredicates.push({
        type: 'equals',
        key: 'HAS_GEOSPATIAL_ISSUE',
        value: 'false',
      });
    }

    if (dimensions.removeRecordsTaxonIssues) {
      qualityPredicates.push({
        type: 'not',
        predicate: {
          type: 'in',
          key: 'ISSUE',
          values: ['TAXON_MATCH_FUZZY'],
        },
      });
    }

    if (dimensions.removeRecordsAtCentroids && !query?.distance_from_centroid_in_meters) {
      qualityPredicates.push({
        type: 'equals',
        key: 'DISTANCE_FROM_CENTROID_IN_METERS',
        value: '2000,*',
      });
    }

    if (dimensions.removeFossilsAndLiving && !query?.basis_of_record) {
      qualityPredicates.push({
        type: 'not',
        predicate: {
          type: 'in',
          key: 'BASIS_OF_RECORD',
          values: ['FOSSIL_SPECIMEN', 'LIVING_SPECIMEN'],
        },
      });
    }

    if (dimensions.removeAbsenceRecords && !query?.occurrence_status) {
      qualityPredicates.push({
        type: 'equals',
        key: 'OCCURRENCE_STATUS',
        value: 'present',
      });
    }

    options.predicate = {
      type: 'and',
      predicates: qualityPredicates,
    };
  }

  return options;
}

/**
 * Generate SQL from cube dimensions
 */
export async function generateCubeSql(
  dimensions: CubeDimensions,
  predicate?: any,
  query?: any
): Promise<CubeSqlResponse> {
  const options = convertCubeDimensionsToSqlOptions(dimensions, predicate, query);

  const response = await fetch('https://graphql.gbif.org/unstable-api/generate-sql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate SQL: ${response.statusText}`);
  }

  return response.json();
}
