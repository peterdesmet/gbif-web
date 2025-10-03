import { useEffect, useState } from 'react';
import { CurrentFilterCard, JSONValidationError } from './components/currentFilterCard';
import { RestoredPredicateNotice } from './components/restoredPredicateNotice';
import { usePredicate } from './usePredicate';
import { Button } from '@/components/ui/button';
import { useNormalizedPredicate } from '@/routes/occurrence/search/views/download/testing/components/usePredicateInformation';
import PredicateEditor from '../../editor/predicateEditor';

export type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadRequestCreate({
  onContinue,
  text,
}: {
  onContinue: (predicate?: string) => void;
  text?: string | JSON;
}) {
  return (
    <>
      {/* <RestoredPredicateNotice
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
      </div> */}
      <PredicateEditor
        onContinue={onContinue}
        content={typeof text === 'string' ? text : JSON.stringify(text)}
      />
    </>
  );
}
