import { PredicateDisplay } from '../key/predicate';
import { RestoredPredicateNotice } from '../request/create/components/restoredPredicateNotice';
import { usePredicate } from '../request/create/usePredicate';
import Editor, { EditorSkeleton } from './editor';

export default function PredicateEditor() {
  const {
    loading,
    error: predicateError,
    predicate,
    setPredicate,
    wasLoadedFromSession,
    discardSessionPredicate,
  } = usePredicate();

  return (
    <>
      {!loading && (
        <>
          <RestoredPredicateNotice
            show={!loading && wasLoadedFromSession}
            discard={discardSessionPredicate}
          />
          <Editor
            title="Predicate Editor"
            initialText={predicate}
            documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
            PrettyDisplay={PredicateVisual}
          />
        </>
      )}
      {loading && <EditorSkeleton />}
    </>
  );
}

function PredicateVisual({
  content,
  onError,
}: {
  content: string;
  onError: (error: Error) => void;
}) {
  return (
    <div className="gbif-predicates">
      <PredicateDisplay predicate={content} />
    </div>
  );
}
