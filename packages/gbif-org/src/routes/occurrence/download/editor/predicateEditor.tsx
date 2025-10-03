import { PredicateDisplay } from '../key/predicate';
import { RestoredPredicateNotice } from '../request/create/components/restoredPredicateNotice';
import { usePredicate } from '../request/create/usePredicate';
import Editor, { EditorSkeleton } from './editor';

export default function PredicateEditor({
  onContinue,
  content,
}: {
  onContinue: (predicate?: string) => void;
  content?: string;
}) {
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
            initialText={predicate ?? content}
            documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
            PrettyDisplay={PredicateVisual}
            onContinue={onContinue}
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
