import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { PredicateType } from '@/gql/graphql';

const config: FilterConfigType = {
  fields: {
    q: {
      hoist: true,
      singleValue: true,
      defaultType: PredicateType.Fuzzy,
      v1: {
        supportedTypes: ['fuzzy'],
      },
    },
    geometry: {
      defaultType: PredicateType.Within,
      v1: {
        supportedTypes: ['within'],
      },
    },
    year: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    depth: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    elevation: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
    eventDate: {
      v1: {
        supportedTypes: ['range', 'equals'],
      },
    },
  },
};

const otherParams = [
  'gadmGid',
  'country',

  'license',
  'mediaType',
  'month',
  'continent',
  'protocol',
  'dwcaExtension',
  'typeStatus',
  'issue',

  'projectId',
  'higherGeography',
  'eventId',
  'fieldNumber',
  'preparations',
  'lithostratigraphy',
  'biostratigraphy',
  'geologicalTime',
  'locality',
  'waterBody',
  'stateProvince',
  'samplingProtocol',

  'islandGroup',
  'island',
  'georeferencedBy',

  'geometry',
  'hasCoordinate',
  'hasGeospatialIssue'
];

otherParams.forEach((filter) => {
  config.fields = config.fields ?? {};
  config.fields[filter] = config.fields[filter] || {};
});

export const searchConfig = config;
