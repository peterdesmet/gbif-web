import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { EventSearchPage } from './eventSearchPage';

export const eventSearchRouteId = 'eventSearch';

export const eventSearchRoute: RouteObjectWithPlugins = {
  id: eventSearchRouteId,
  gbifRedirect: (_, { gbifOrgLocalePrefix = '' }) => {
    return `${import.meta.env.PUBLIC_GBIF_ORG}${gbifOrgLocalePrefix}/event/search`;
  },
  path: 'event/search',
  element: <EventSearchPage />,
};
