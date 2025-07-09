import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterSuggestConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';

export const eventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventId.name',
  allowExistence: true,
  allowNegations: true,
  about: () => <Message id="filters.eventId.description" />,
  facetQuery: /* GraphQL */ `
    query EventEventIdFacet($predicate: Predicate) {
      search: eventSearch(predicate: $predicate) {
        facet {
          field: eventId(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  group: 'event',
};

export const fieldNumberConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'fieldNumber',
  displayName: IdentityLabel,
  filterTranslation: 'filters.fieldNumber.name',
  allowExistence: true,
  allowNegations: true,
  about: () => <Message id="filters.fieldNumber.description" />,
  facetQuery: /* GraphQL */ `
    query EventFieldNumberFacet($predicate: Predicate) {
      search: eventSearch(predicate: $predicate) {
        facet {
          field: fieldNumber(size: 10) {
            name: key
            count
          }
        }
      }
    }
  `,
  group: 'event',
};
