import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import DownloadGbifOrg from './DownloadGbifOrg';
import DownloadGbifOrgVertical from './DownloadGbifOrg vertical';
import DownloadGbifOrgHorizontal from './DownloadGbifOrg horisontal';

export function Download() {
  const { isGBIFOrg } = useConfig();
  if (!isGBIFOrg) {
    return <DownloadHostedPortal />;
  } else {
    return (
      <>
        <DownloadGbifOrg />
        <DownloadGbifOrgVertical />
        <DownloadGbifOrgHorizontal />
      </>
    );
  }
}
