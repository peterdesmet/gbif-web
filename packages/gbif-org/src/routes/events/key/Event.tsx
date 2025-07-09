import { DataHeader } from '@/components/dataHeader';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Location } from '@/components/highlights';
import { GeoJsonMap } from '@/components/maps/geojsonMap';
import { FormattedDateRange } from '@/components/message';
import Properties, { Property } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { MdDataset, MdEvent, MdLocationOn } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

interface EventProps {
  event: {
    eventID: ID;
    parentEventID?: ID;
    eventType?: {
      concept: string;
    };
    eventName?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
    countryCode?: string;
    datasetKey: ID;
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
  eventSearch?: {
    facet: {
      eventTypeHierarchyJoined: Array<{
        key: string;
        count: number;
      }>;
    };
  };
}

const AboutContent = () => (
  <div>
    <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
      <h3>What is a sampling event?</h3>
      <p>
        A sampling event represents a specific occurrence in time and space where biological
        sampling activities took place. Events can be hierarchical and may contain multiple
        occurrences or sub-events.
      </p>
    </div>
  </div>
);

// Helper function to parse WKT geometry (supports both POINT and POLYGON)
function parseWktGeometry(
  wkt: string
): { type: 'Point' | 'Polygon'; coordinates: number[] | number[][][] } | null {
  try {
    // Check if it's a POINT
    const pointMatch = wkt.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (pointMatch) {
      const [, x, y] = pointMatch;
      return {
        type: 'Point',
        coordinates: [Number(x), Number(y)],
      };
    }

    // Check if it's a POLYGON
    const polygonMatch = wkt.match(/POLYGON\s*\(\s*\((.*?)\)\s*\)/i);
    if (polygonMatch) {
      const coordsString = polygonMatch[1];
      const coordPairs = coordsString.split(',').map((pair) => {
        const [x, y] = pair.trim().split(/\s+/).map(Number);
        return [x, y];
      });

      return {
        type: 'Polygon',
        coordinates: [coordPairs],
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing WKT geometry:', error);
    return null;
  }
}

const ApiContent = ({ eventID, datasetKey }: { eventID?: string; datasetKey?: string }) => (
  <div className="g-text-sm g-prose">
    <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
      <h3>API Access</h3>
      <p>Access event data programmatically through the GBIF API.</p>
    </div>
    <h4>Examples</h4>
    <Card className="g-p-2 g-mb-2">
      Single event <br />
      <a href={`https://api.gbif.org/v1/event/${eventID}?datasetKey=${datasetKey}`}>
        https://api.gbif.org/v1/event/{eventID}?datasetKey={datasetKey}
      </a>
    </Card>
    <Card className="g-p-2 g-mb-2">
      Search events <br />
      <a href={`https://api.gbif.org/v1/event/search?datasetKey=${datasetKey}`}>
        https://api.gbif.org/v1/event/search?datasetKey={datasetKey}
      </a>
    </Card>
  </div>
);

export function Event({ event, eventSearch }: EventProps) {
  // Create title from eventType and eventID
  const eventTypeDisplay = event.eventType?.concept || 'Event';
  const title = `${eventTypeDisplay}: ${event.eventID}`;

  // Format date for display - use temporalCoverage if available, otherwise construct from year/month
  const eventDate = event.temporalCoverage
    ? `${event.temporalCoverage.gte || ''}/${event.temporalCoverage.lte || ''}`
    : event.year
    ? `${event.year}${event.month ? `-${event.month.toString().padStart(2, '0')}` : ''}`
    : undefined;

  return (
    <article>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent eventID={event.eventID} datasetKey={event.datasetKey} />}
      />

      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <ArticlePreTitle
            secondary={
              eventDate ? (
                <FormattedDateRange date={eventDate} />
              ) : (
                <FormattedMessage id="phrases.unknownDate" />
              )
            }
          >
            <FormattedMessage id="event.header.event" defaultMessage="Event" />
          </ArticlePreTitle>

          <ArticleTitle>{title}</ArticleTitle>

          {event.eventName && (
            <div className="g-text-lg g-text-slate-600 g-mb-4">{event.eventName}</div>
          )}

          <HeaderInfo>
            <HeaderInfoMain>
              <FeatureList>
                {eventDate && (
                  <GenericFeature>
                    <MdEvent />
                    <FormattedDateRange date={eventDate} />
                  </GenericFeature>
                )}

                {event.countryCode && (
                  <Location countryCode={event.countryCode} city={event.stateProvince} />
                )}

                {event.locality && (
                  <GenericFeature>
                    <MdLocationOn />
                    <span>{event.locality}</span>
                  </GenericFeature>
                )}

                {event.occurrenceCount !== undefined && event.occurrenceCount > 0 && (
                  <GenericFeature>
                    <span>
                      <FormattedMessage
                        id="counts.nOccurrences"
                        values={{ total: event.occurrenceCount }}
                        defaultMessage="{total} occurrences"
                      />
                    </span>
                  </GenericFeature>
                )}

                {event.datasetTitle && (
                  <GenericFeature>
                    <MdDataset />
                    <span>{event.datasetTitle}</span>
                  </GenericFeature>
                )}
              </FeatureList>
            </HeaderInfoMain>
          </HeaderInfo>
        </ArticleTextContainer>
      </PageContainer>

      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <Card className="g-mb-4">
            <CardHeader>
              <CardTitle>
                <FormattedMessage
                  id="phrases.headers.eventDetails"
                  defaultMessage="Event Details"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Properties>
                <Property labelId="event.eventID" value={event.eventID} />

                {event.parentEventID && (
                  <Property labelId="event.parentEventID" value={event.parentEventID} />
                )}

                {event.eventType?.concept && (
                  <Property labelId="event.eventType" value={event.eventType.concept} />
                )}

                {event.eventTypeHierarchy && event.eventTypeHierarchy.length > 0 && (
                  <Property
                    labelId="event.structure"
                    value={event.eventTypeHierarchy.join(' > ')}
                  />
                )}

                {event.temporalCoverage && (
                  <Property
                    labelId="event.temporalCoverage"
                    value={`${event.temporalCoverage.gte || ''} - ${
                      event.temporalCoverage.lte || ''
                    }`.trim()}
                  />
                )}

                {(event.sampleSizeValue || event.sampleSizeUnit) && (
                  <Property
                    labelId="event.sampleSize"
                    value={`${event.sampleSizeValue || ''} ${event.sampleSizeUnit || ''}`.trim()}
                  />
                )}
              </Properties>

              <div className="g-mt-6">
                <Button variant="outline">
                  <FormattedMessage id="event.viewChildEvents" defaultMessage="View child events" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="g-mb-4">
            <CardHeader>
              <CardTitle>
                <FormattedMessage id="phrases.headers.location" defaultMessage="Location" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Map component */}
              <div className="g-mb-6">
                {(() => {
                  const wktGeometry = event.wktConvexHull
                    ? parseWktGeometry(event.wktConvexHull)
                    : null;
                  const hasLocationData =
                    wktGeometry || (event.decimalLatitude && event.decimalLongitude);

                  if (!hasLocationData) {
                    return (
                      <div className="g-h-64 g-bg-gray-100 g-rounded g-flex g-items-center g-justify-center g-text-gray-500">
                        <span>No location data available</span>
                      </div>
                    );
                  }

                  let geoJson;
                  let initialCenter: [number, number] = [0, 0];
                  let initialZoom = 8;

                  if (wktGeometry) {
                    geoJson = {
                      type: 'Feature',
                      geometry: wktGeometry,
                      properties: {},
                    };

                    // Set initial center based on geometry type
                    if (wktGeometry.type === 'Point') {
                      initialCenter = wktGeometry.coordinates as [number, number];
                      initialZoom = 8;
                    } else if (wktGeometry.type === 'Polygon') {
                      // For polygons, use the first coordinate as center (could be improved with centroid calculation)
                      const coords = wktGeometry.coordinates as number[][][];
                      if (coords[0] && coords[0][0]) {
                        initialCenter = [coords[0][0][0], coords[0][0][1]];
                      }
                      initialZoom = 6;
                    }
                  } else {
                    // Fallback to lat/lon point
                    geoJson = {
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [event.decimalLongitude!, event.decimalLatitude!],
                      },
                      properties: {},
                    };
                    initialCenter = [event.decimalLongitude!, event.decimalLatitude!];
                  }

                  return (
                    <GeoJsonMap
                      geoJson={geoJson}
                      initialCenter={initialCenter}
                      initialZoom={initialZoom}
                      rasterStyle="gbif-natural"
                      height="350px"
                    />
                  );
                })()}
              </div>

              <Properties>
                <Property labelId="event.locationID" value={event.locationID} />

                {event.countryCode && (
                  <Property
                    labelId="event.countryCode"
                    value={<FormattedMessage id={`enums.countryCode.${event.countryCode}`} />}
                  />
                )}

                <Property labelId="event.stateProvince" value={event.stateProvince} />

                <Property labelId="event.locality" value={event.locality} />

                <Property labelId="event.decimalLatitude" value={event.decimalLatitude} />

                <Property labelId="event.decimalLongitude" value={event.decimalLongitude} />
              </Properties>
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
    </article>
  );
}
