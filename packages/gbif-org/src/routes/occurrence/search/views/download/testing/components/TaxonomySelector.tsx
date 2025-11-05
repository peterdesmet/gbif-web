import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { TaxonomyIcon } from '@/components/highlights';
import ExpandableSection from './ExpandableSection';

interface TaxonomySelectorProps {
  value: string;
  onChange: (taxonomy: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TaxonomySelector({
  value,
  onChange,
  isExpanded,
  onToggle,
}: TaxonomySelectorProps) {
  const { checklists, loading } = useSupportedChecklists();

  return (
    <ExpandableSection
      icon={<TaxonomyIcon size={20} className="g-text-primary-600 g-flex-none" />}
      title="Taxonomic Reference"
      description="Select the taxonomic reference for interpretation of species names"
      summary={checklists.find((x) => x.key === value)?.alias ?? ''}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {!loading && (
        <div className="g-grid g-gap-3">
          {checklists.map((checklist) => (
            <label className="g-bg-white g-flex g-items-start g-p-4 g-rounded g-border g-border-gray-200 g-cursor-pointer">
              <input
                type="radio"
                name="taxonomy"
                value={checklist.key}
                checked={value === checklist.key}
                onChange={() => onChange(checklist.key)}
                className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300 g-rounded"
              />
              <div className="g-ml-3 g-flex-1">
                <span className="g-font-medium g-text-gray-900 g-text-sm">{checklist.title}</span>
                {checklist.isDefault && (
                  <p className="g-text-xs g-text-gray-500 g-mt-0.5">
                    Default and recommended for most users
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </ExpandableSection>
  );
}
