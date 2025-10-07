import { useMemo } from 'react';
import { PredicateDisplay } from '../key/predicate';
import { RestoredPredicateNotice } from '../request/create/components/restoredPredicateNotice';
import { usePredicate } from '../request/create/usePredicate';
import Editor, { EditorSkeleton } from './editor';
import { highlight } from 'sql-highlight';
import { useStringParam } from '@/hooks/useParam';

export default function SqlEditor() {
  const [sql, setSql] = useStringParam({ key: 'sql', replace: true });

  return (
    <Editor
      title="SQL Editor"
      initialText={''}
      documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
      PrettyDisplay={SqlVisual}
      text={sql ?? ''}
      setText={setSql}
    />
  );
}

function SqlVisual({
  content: sql,
  onError,
}: {
  content: string;
  onError: (error: Error) => void;
}) {
  const highlightedHtml = useMemo(() => {
    if (!sql) return null;
    return highlight(sql, {
      html: true,
    });
  }, [sql]);

  return (
    <code
      className="gbif-sqlInput g-block g-bg-white g-p-4"
      dangerouslySetInnerHTML={{ __html: highlightedHtml ?? '' }}
    />
  );
}
