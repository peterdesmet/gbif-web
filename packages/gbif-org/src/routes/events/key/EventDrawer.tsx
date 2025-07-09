import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';
import { Event } from './Event';

// GraphQL query interfaces (you'll need to generate these from your schema)
interface EventQuery {
  event: {
    eventID: string;
    parentEventID?: string;
    eventType?: {
      concept: string;
    };
    eventName?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
    countryCode?: string;
    datasetKey: string;
    datasetTitle?: string;
    year?: number;
    month?: number;
    occurrenceCount?: number;
    measurementOrFactTypes?: string[];
    sampleSizeUnit?: string;
    sampleSizeValue?: number;
    samplingProtocol?: string;
    eventTypeHierarchyJoined?: string;
    eventHierarchyJoined?: string;
    eventTypeHierarchy?: string[];
    eventHierarchy?: string[];
    decimalLatitude?: number;
    decimalLongitude?: number;
    locality?: string;
    stateProvince?: string;
    locationID?: string;
    wktConvexHull?: string;
    temporalCoverage?: {
      gte?: string;
      lte?: string;
    };
  };
  eventSearch: {
    facet: {
      eventTypeHierarchyJoined: Array<{
        key: string;
        count: number;
      }>;
    };
  };
}

interface EventQueryVariables {
  eventId: string;
  datasetKey: string;
  predicate: any;
}

// graphql query for event
const GRAPHQL_EVENT = `
query event($eventId: ID, $datasetKey: ID, $predicate: Predicate){
  event(eventId: $eventId, datasetKey: $datasetKey) {
    eventID
    parentEventID
    eventType {
      concept
    }
    eventName
    coordinates
    countryCode
    datasetKey
    datasetTitle
    year
    month
    occurrenceCount
    measurementOrFactTypes
    sampleSizeUnit
    sampleSizeValue
    samplingProtocol
    eventTypeHierarchyJoined
    eventHierarchyJoined
    eventTypeHierarchy
    eventHierarchy    
    eventTypeHierarchy
    eventHierarchy
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
    wktConvexHull
    temporalCoverage {
      gte
      lte
    }
  }
  eventSearch(predicate: $predicate) {
    facet {
      eventTypeHierarchyJoined {
        key
        count
      }
    }
  }
}
`;

export default function EventDrawer({ entityKey }: { entityKey?: string }) {
  const { data, loading, error, load } = useQuery<EventQuery, EventQueryVariables>(GRAPHQL_EVENT, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (entityKey) {
      const datasetKey = entityKey.split('_')[0];
      const eventId = entityKey.substring(entityKey.indexOf('_') + 1);

      if (datasetKey && eventId) {
        load({
          variables: {
            eventId: eventId,
            datasetKey: datasetKey,
            predicate: {
              type: 'equals',
              key: 'datasetKey',
              value: datasetKey,
            },
          },
        });
      }
    }
  }, [entityKey, load]);

  if (!entityKey) {
    return null;
  }

  if (loading) {
    return (
      <div className="g-p-4">
        <div>Loading event data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="g-p-4">
        <div>Error loading event: {error.message}</div>
      </div>
    );
  }

  if (!data?.event) {
    return (
      <div className="g-p-4">
        <div>Event not found</div>
      </div>
    );
  }

  return <Event event={data.event} eventSearch={data.eventSearch} />;
}
