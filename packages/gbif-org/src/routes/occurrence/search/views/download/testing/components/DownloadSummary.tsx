import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';

export function DownloadSummary({
  selectedFormat,
  configuration,
}: {
  selectedFormat: any;
  configuration: any;
}) {
  const { checklists } = useSupportedChecklists();
  // Get configuration summary for sidebar
  const getConfigSummary = () => {
    const isDarwinCoreArchive = selectedFormat?.id === 'DWCA';
    const summary = [
      { label: 'Format', value: selectedFormat.title },
      { label: 'CSV delimiter', value: 'TAB' },
      {
        label: 'Taxonomy',
        value: checklists.find((x) => x.key === configuration.checklistKey)?.alias ?? '',
      },
    ];

    if (isDarwinCoreArchive && 'extensions' in configuration) {
      summary.push({ label: 'Extensions', value: configuration.extensions.length.toString() });
    }

    return summary;
  };

  return (
    <div className="g-space-y-3 g-text-sm">
      {getConfigSummary().map((item) => (
        <div key={item.label} className="g-flex g-justify-between">
          <span className="g-text-gray-600">{item.label}:</span>
          <span className="g-font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
