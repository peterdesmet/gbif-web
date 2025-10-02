import { useEffect, useState } from 'react';
import { CurrentFilterCard, JSONValidationError } from './components/currentFilterCard';
import { RestoredPredicateNotice } from './components/restoredPredicateNotice';
import { usePredicate } from './usePredicate';
import { Button } from '@/components/ui/button';
import { useNormalizedPredicate } from '@/routes/occurrence/search/views/download/testing/components/usePredicateInformation';

export type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadRequestCreate({
  onContinue,
}: {
  onContinue: (predicate?: string) => void;
}) {
  const {
    loading,
    error: predicateError,
    predicate,
    setPredicate,
    wasLoadedFromSession,
    discardSessionPredicate,
  } = usePredicate();
  const [validationError, setValidationError] = useState<JSONValidationError>();
  const [mode, setMode] = useState<Mode>('viewing');
  const { error: normalizationError } = useNormalizedPredicate({
    predicate: mode === 'viewing' ? predicate : undefined,
  });

  useEffect(() => {
    if (normalizationError) {
      setValidationError({ type: 'invalid-predicate', message: 'Invalid predicate' });
    } else if (predicateError) {
      setValidationError({ type: 'faild-to-load-predicate', message: predicateError });
    }
  }, [predicateError, normalizationError]);

  return (
    <>
      <RestoredPredicateNotice
        show={!loading && wasLoadedFromSession}
        discard={discardSessionPredicate}
      />

      <CurrentFilterCard
        loading={loading}
        predicate={predicate}
        setPredicate={setPredicate}
        mode={mode}
        setMode={setMode}
        validationError={validationError}
        setValidationError={setValidationError}
      />
      <div>
        <Button
          disabled={
            !!validationError || !predicate || (predicate?.length ?? 0) < 10 || mode === 'editing'
          }
          onClick={() => onContinue(predicate)}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
