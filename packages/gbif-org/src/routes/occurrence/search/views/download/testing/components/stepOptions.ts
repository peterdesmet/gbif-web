import { FaCog, FaFileAlt, FaDownload, FaFilter } from 'react-icons/fa';
import { ComponentType } from 'react';

export interface Step {
  ordering: number;
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}

export const stepOptions: Record<string, Step> = {
  QUALITY: {
    ordering: 0,
    id: 'QUALITY',
    name: 'Quality',
    icon: FaFilter,
    description: 'Apply quality filters',
  },
  PREDICATE: {
    ordering: 1,
    id: 'PREDICATE',
    name: 'Filter',
    icon: FaFilter,
    description: 'Compose a filter predicate',
  },
  SQL: { ordering: 2, id: 'SQL', name: 'SQL', icon: FaFilter, description: 'Write SQL query' },
  FORMAT: {
    ordering: 3,
    id: 'FORMAT',
    name: 'Format',
    icon: FaFileAlt,
    description: 'Choose download format',
  },
  CONFIGURE: {
    ordering: 4,
    id: 'CONFIGURE',
    name: 'Configure',
    icon: FaCog,
    description: 'Set options and fields',
  },
  TERMS: {
    ordering: 5,
    id: 'TERMS',
    name: 'Terms',
    icon: FaDownload,
    description: 'Accept terms and download',
  },
};

export const occurrenceDownloadSteps: Step[] = [
  // stepOptions.QUALITY,
  stepOptions.FORMAT,
  stepOptions.CONFIGURE,
  stepOptions.TERMS,
];

export const sqlDownloadSteps: Step[] = [stepOptions.SQL, stepOptions.TERMS];

export const predicateDownloadSteps: Step[] = [
  stepOptions.PREDICATE,
  stepOptions.FORMAT,
  stepOptions.CONFIGURE,
  stepOptions.TERMS,
];
