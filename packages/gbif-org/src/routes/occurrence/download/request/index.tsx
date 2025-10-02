import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadAbout, occurrenceDownloadAboutLoader } from './about';
import { OccurrenceDownloadRequestCreate } from './create';
import { OccurrenceDownloadRequestCreateSkleton } from './create/skeleton';
import { OccurrenceDownloadPage } from './layout';
import { PredicateDownloadFlow } from '../../search/views/download/testing/app';

export const occurrenceDownloadRequestRoute: RouteObjectWithPlugins = {
  path: 'occurrence/download/request',
  element: <OccurrenceDownloadPage />,
  children: [
    {
      index: true,
      // The page uses session storage and can therefore not be server side rendered
      element: (
        <StaticRenderSuspence fallback={<OccurrenceDownloadRequestCreateSkleton />}>
          {/* <OccurrenceDownloadRequestCreate /> */}
          <div className="g-bg-slate-100">
            <PredicateDownloadFlow />
          </div>
        </StaticRenderSuspence>
      ),
    },
    {
      path: 'about',
      loader: occurrenceDownloadAboutLoader,
      element: <OccurrenceDownloadAbout />,
    },
  ],
};
