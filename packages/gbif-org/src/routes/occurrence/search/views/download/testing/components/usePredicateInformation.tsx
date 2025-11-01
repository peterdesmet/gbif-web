import {
  NormalizePredicateAndCountQuery,
  NormalizePredicateAndCountQueryVariables,
  NormalizePredicateQuery,
  NormalizePredicateQueryVariables,
  Predicate,
} from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useEffect } from 'react';

const PREDICATE_COUNT_QUERY = /* GraphQL */ `
  query normalizePredicateAndCount($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
      documents {
        total
      }
    }
  }
`;

const PREDICATE_QUERY = /* GraphQL */ `
  query normalizePredicate($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
    }
  }
`;

export function usePredicateInformation({ predicate }: { predicate?: Predicate }) {
  const { data, loading, error, load } = useQuery<
    NormalizePredicateAndCountQuery,
    NormalizePredicateAndCountQueryVariables
  >(PREDICATE_COUNT_QUERY, { lazyLoad: false });

  useEffect(() => {
    load({ variables: { predicate } });
  }, [predicate, load]);

  return {
    total: data?.occurrenceSearch?.documents?.total ?? 0,
    predicate: data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate,
    loading,
    error:
      error ?? !data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate
        ? new Error('Invalid predicate')
        : null,
  };
}

export function useNormalizedPredicate({ predicate }: { predicate?: Predicate | string }) {
  const { data, loading, error, load } = useQuery<
    NormalizePredicateQuery,
    NormalizePredicateQueryVariables
  >(PREDICATE_QUERY);

  useEffect(() => {
    if (predicate) {
      try {
        const pred = typeof predicate === 'string' ? JSON.parse(predicate) : predicate;
        load({ variables: { predicate: pred } });
      } catch (e) {
        console.error('Failed to parse predicate', e);
      }
    }
  }, [predicate, load]);

  console.log(error);
  console.log(loading);

  return {
    predicate: data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate,
    loading,
    error: !loading ? error : null,
  };
}
