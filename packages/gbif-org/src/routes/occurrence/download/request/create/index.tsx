import { useEffect, useState } from 'react';
import { CurrentFilterCard, JSONValidationError } from './components/currentFilterCard';
import { RestoredPredicateNotice } from './components/restoredPredicateNotice';
import { usePredicate } from './usePredicate';
import { Button } from '@/components/ui/button';
import { useNormalizedPredicate } from '@/routes/occurrence/search/views/download/testing/components/usePredicateInformation';
import PredicateEditor from '../../editor/predicateEditor';
import SqlEditor from '../../editor/sqlEDitor';

export type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadRequestCreate({
  onContinue,
  text,
}: {
  onContinue: (predicate: string) => void;
  text?: string | JSON;
}) {
  return (
    <>
      <PredicateEditor
        onContinue={onContinue}
        content={typeof text === 'string' ? text : JSON.stringify(text)}
      />
    </>
  );
}
