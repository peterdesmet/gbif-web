import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import App from './testing/app';
import PredicateEditor from '@/routes/occurrence/download/editor/predicateEditor';
import SqlEditor from '@/routes/occurrence/download/editor/sqlEDitor';

export function Download() {
  const { isGBIFOrg } = useConfig();
  if (!isGBIFOrg) {
    return <DownloadHostedPortal />;
  } else {
    return (
      <>
        <PredicateEditor />
        <SqlEditor />
        <App />
        {/* <DownloadGbifOrgVertical />
        <DownloadGbifOrgHorizontal /> */}
      </>
    );
  }
}
