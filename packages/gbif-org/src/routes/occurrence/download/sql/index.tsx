import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { OccurrenceDownloadSqlAbout, occurrenceDownloadSqlAboutLoader } from './about';
import { OccurrenceDownloadSqlCreate } from './create';
import { OccurrenceDownloadSqlPage } from './sql';
import { SqlDownloadFlow } from '../../search/views/download/testing/app';

export const occurrenceDownloadSqlRoute: RouteObjectWithPlugins = {
  id: 'occurrenceDownloadSql',
  path: 'occurrence/download/sql',
  element: <OccurrenceDownloadSqlPage />,
  children: [
    {
      index: true,
      // element: <OccurrenceDownloadSqlCreate />,
      element: (
        <div className="g-bg-slate-100">
          <SqlDownloadFlow />
        </div>
      ),
    },
    {
      path: 'about',
      loader: occurrenceDownloadSqlAboutLoader,
      element: <OccurrenceDownloadSqlAbout />,
    },
  ],
};
