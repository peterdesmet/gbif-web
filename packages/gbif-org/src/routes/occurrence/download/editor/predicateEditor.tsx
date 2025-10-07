import { useStringParam } from '@/hooks/useParam';
import { PredicateDisplay } from '../key/predicate';
import { RestoredPredicateNotice } from '../request/create/components/restoredPredicateNotice';
import { getOriginalPredicate, usePredicate } from '../request/create/usePredicate';
import Editor, { EditorSkeleton } from './editor';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

//a hook to store content in textarea. per default it should store to url, but if above 1200 characters then use session storage instead
function useTextAreaContent(key: string): [string, (text: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get(key) ?? '';
  const sessionStorageKey = `textarea-${key}`;
  const sessionValue = window.sessionStorage.getItem(sessionStorageKey) ?? '';

  function setValue(text: string) {
    if (text.length > 1200) {
      window.sessionStorage.setItem(sessionStorageKey, text);
      searchParams.delete(key);
      setSearchParams(searchParams, { replace: true });
    } else {
      window.sessionStorage.removeItem(sessionStorageKey);
      searchParams.set(key, text);
      setSearchParams(searchParams, { replace: true });
    }
  }

  return [paramValue || sessionValue, setValue];
}

export default function PredicateEditor({
  onContinue,
}: {
  onContinue: (predicate?: string) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [predicate, setPredicate] = useTextAreaContent('predicate');
  // const [predicate, setPredicate] = useStringParam({ key: 'predicate', replace: true });

  useEffect(() => {
    if (predicate || !searchParams.get('queryId')) return;
    const controller = new AbortController();

    const initialize = async () => {
      try {
        const predicateFromQueryId = await getOriginalPredicate(searchParams, controller.signal);
        if (predicate || !searchParams.get('queryId')) return;
        setTimeout(() => {
          // set queryid to null and once that is done set predicate
          setPredicate(predicateFromQueryId ?? '');
        }, 1);
      } catch (e) {
        // ignore errors
      }
    };

    initialize();
    return () => controller.abort();
  }, [searchParams, setPredicate, predicate]);

  useEffect(() => {
    if (predicate && (searchParams.get('queryId') || searchParams.get('variablesId'))) {
      searchParams.delete('queryId');
      searchParams.delete('variablesId');
      setSearchParams(searchParams, { replace: true });
    }
  }, [predicate, searchParams, setSearchParams]);
  // const {
  //   loading,
  //   error: predicateError,
  //   predicate,
  //   setPredicate,
  //   wasLoadedFromSession,
  //   discardSessionPredicate,
  // } = usePredicate();

  return (
    <Editor
      title="Predicate Editor"
      documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
      PrettyDisplay={PredicateVisual}
      onContinue={onContinue}
      text={predicate ?? ''}
      setText={setPredicate}
    />
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
