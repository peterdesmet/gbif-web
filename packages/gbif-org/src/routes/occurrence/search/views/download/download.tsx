import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import DownloadGbifOrg from './DownloadGbifOrg';
import DownloadGbifOrgVertical from './DownloadGbifOrg vertical';
import DownloadGbifOrgHorizontal from './DownloadGbifOrg horisontal';
import App from './testing/app';

export function Download() {
  const { isGBIFOrg } = useConfig();
  if (!isGBIFOrg) {
    return <DownloadHostedPortal />;
  } else {
    return (
      <>
        <App />
        {/* <DownloadGbifOrgVertical />
        <DownloadGbifOrgHorizontal /> */}
      </>
    );
  }
}
