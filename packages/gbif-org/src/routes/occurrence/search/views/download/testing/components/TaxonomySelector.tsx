import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { TaxonomyIcon } from '@/components/highlights';

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
    <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200">
      <button
        onClick={onToggle}
        className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
      >
        <div className="g-flex g-items-start g-gap-3">
          <TaxonomyIcon size={20} className="g-text-primary-600 g-flex-none" />
          <div>
            <h3 className="g-font-semibold g-text-gray-900">Taxonomic Reference</h3>
            <p className="g-text-sm g-text-gray-600">
              Select the taxonomic reference for interpretation of species names
            </p>
          </div>
        </div>
        <div className="g-hidden md:g-block g-text-sm g-text-gray-500">
          {checklists.find((x) => x.key === value)?.alias ?? ''}
        </div>
      </button>

      {isExpanded && !loading && (
        <div className="g-border-t g-border-gray-200 g-p-6">
          <div className="g-space-y-2">
            {checklists.map((checklist) => (
              <label className="g-flex g-items-start g-p-4 g-border g-border-gray-300 g-rounded g-cursor-pointer hover:g-bg-gray-50 g-transition-colors">
                <input
                  type="radio"
                  name="taxonomy"
                  value={checklist.key}
                  checked={value === checklist.key}
                  onChange={() => onChange(checklist.key)}
                  className="g-mt-1 g-h-4 g-w-4 g-text-primary-600 g-focus:ring-primary-500 g-border-gray-300"
                />
                <div className="g-ml-3">
                  <span className="g-font-medium g-text-gray-900">{checklist.title}</span>
                  {checklist.isDefault && (
                    <p className="g-text-sm g-text-gray-600">
                      Default and recommended for most users
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
