import { useState, useEffect } from 'react';
import { generateCubeSql } from '../cubeService';
import { CubeDimensions } from './types';

export function useFormValidation(
  cube: CubeDimensions,
  onValidationChange?: (isValid: boolean) => void
) {
  const isValid = () => {
    const hasTaxonomic = Boolean(cube.taxonomicLevel);
    const hasTemporal = Boolean(cube.temporalResolution);
    const hasSpatial =
      Boolean(cube.spatial) && (cube.spatial === 'COUNTRY' || Boolean(cube.resolution));

    return hasTaxonomic || hasTemporal || hasSpatial;
  };

  useEffect(() => {
    onValidationChange?.(isValid());
  }, [cube, onValidationChange]);

  return isValid();
}

export function useSqlGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAndNavigate = async (cube: CubeDimensions) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateCubeSql(cube, undefined);
      const url = result.sql
        ? `/occurrence/download/sql?${new URLSearchParams({ sql: result.sql })}`
        : '/occurrence/download/sql';
      window.location.href = url;
    } catch (err) {
      console.error('Failed to generate SQL:', err);
      setError('Failed to generate SQL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, error, generateAndNavigate };
}