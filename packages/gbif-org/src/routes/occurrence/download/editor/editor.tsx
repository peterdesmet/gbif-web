import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import React, { useState, useEffect, useCallback } from 'react';
import {
  LuFileEdit as Edit3,
  LuStopCircle as StopCircle,
  LuFileText as FileText,
  LuArrowRight as ArrowRight,
  LuAlertCircle as AlertCircle,
} from 'react-icons/lu';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from '@/components/ui/skeleton';

export default function Editor({
  documentationUrl,
  title,
  initialText,
  PrettyDisplay,
  onContinue,
}: {
  title: string;
  initialText?: string;
  documentationUrl?: string;
  PrettyDisplay: React.FC<{ content: string; onError: (error: Error) => void }>;
  onContinue: (predicate?: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleFormat = () => {
    console.log('Format SQL - functionality to be implemented');
  };

  const handleError = useCallback((error: Error) => {
    setErrorMessage(error.message);
    // setIsEditing(true);
  }, []);

  useEffect(() => {
    if (isEditing) setErrorMessage(null);
  }, [text, isEditing]);

  return (
    <div className="g-flex g-justify-center g-p-6 g-transition-colors g-duration-300">
      <Card className="g-w-full g-max-w-4xl">
        <div className="g-p-6 g-border-b dark:g-border-slate-700 g-border-slate-200">
          <div className="g-flex g-items-end g-justify-between">
            <h1 className="g-text-2xl g-font-bold dark:g-text-white g-text-slate-900 g-flex g-items-center g-gap-3">
              {title}
            </h1>

            <div className="g-flex g-items-center g-gap-3">
              <div className="g-flex g-items-center g-gap-2 g-h-8 g-mr-auto g-flex-none">
                <Label htmlFor="occurrence-download-sql-editing">
                  {isEditing && (
                    <FormattedMessage id="download.stopEditing" defaultMessage="Stop Editing" />
                  )}
                  {!isEditing && (
                    <FormattedMessage id="download.startEditing" defaultMessage="Start Editing" />
                  )}
                </Label>
                <Switch
                  checked={isEditing}
                  onCheckedChange={() => setIsEditing(!isEditing)}
                  id="occurrence-download-sql-editing"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`dark:g-bg-slate-900 g-bg-slate-50 focus:g-ring-2 ${
            isEditing
              ? 'g-border-blue-500 g-shadow-lg g-shadow-blue-500/20 focus:g-ring-blue-500'
              : 'g-border-transparent focus:g-ring-slate-500'
          } ${errorMessage && !isEditing ? 'g-border-red-500' : ''}`}
        >
          <div
            className="g-relative"
            onClick={() => {
              errorMessage ? setIsEditing(true) : null;
            }}
          >
            {(isEditing || !text) && (
              <textarea
                placeholder="Enter SQL here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!isEditing}
                className={`g-block g-font-[monospace] g-border-transparent g-w-full g-h-96 g-p-4 g-border g-bg-slate-50  dark:g-text-slate-100 g-text-slate-900 g-font-mono g-text-sm g-leading-relaxed g-resize-none g-transition-all g-duration-200 focus:g-outline-none`}
                spellCheck={false}
              />
            )}
            {!isEditing && text && (
              <div
                className={`g-w-full g-min-h-96 g-p-4 dark:g-bg-slate-900 g-border g-border-transparent g-bg-slate-50 dark:g-text-slate-100 g-text-slate-900 g-font-mono g-text-sm g-leading-relaxed g-overflow-auto ${
                  errorMessage ? 'g-border-red-500' : ''
                }`}
              >
                <ErrorBoundary
                  invalidateOn={text}
                  fallback={<ErrorFallback text={text} />}
                  onError={handleError}
                >
                  <PrettyDisplay content={text} onError={() => {}} />
                </ErrorBoundary>
              </div>
            )}

            {isEditing && (
              <div className="g-absolute g-top-2 g-right-4 g-hidden md:g-block">
                <button
                  onClick={handleFormat}
                  className="g-px-2 g-py-1 dark:g-bg-slate-700 g-bg-slate-200 dark:hover:g-bg-slate-600 hover:g-bg-slate-300 dark:g-text-white g-text-slate-900 g-text-sm g-rounded-md g-transition-colors g-duration-200 g-border dark:g-border-slate-600 g-border-slate-300"
                >
                  Format
                </button>
              </div>
            )}
          </div>

          <div className="g-mt-3 g-min-h-4 g-px-2 g-flex g-items-center g-gap-2 dark:g-text-red-400 g-text-red-600 g-text-sm">
            {errorMessage && (
              <>
                <AlertCircle className="g-w-4 g-h-4" />
                <span>Invalid SQL: {errorMessage}</span>
              </>
            )}
          </div>
        </div>

        <div className="g-p-6 g-border-t dark:g-border-slate-700 g-border-slate-200 g-flex g-items-start g-justify-between">
          {documentationUrl && (
            <Button asChild variant="ghost">
              <a href={documentationUrl} target="_blank" rel="noopener noreferrer" className="">
                <FileText className="g-w-5 g-h-5 g-me-1" />
                Read the Documentation
              </a>
            </Button>
          )}

          <div className="g-flex g-flex-col g-items-end g-gap-2">
            <Button disabled={!!isEditing || !!errorMessage} onClick={() => onContinue(text)}>
              Next
            </Button>
            {isEditing && (
              <span className="g-text-sm dark:g-text-amber-400 g-text-amber-600 g-flex g-items-center g-gap-1.5">
                <AlertCircle className="g-w-4 g-h-4" />
                Stop editing before proceeding
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function EditorSkeleton() {
  return <Skeleton className="g-h-96 g-w-full g-max-w-4xl g-mx-auto g-my-6" />;
}

const ErrorFallback = ({ text }: { text: string }) => {
  return <code className="g-block g-whitespace-pre-wrap g-font-[monospace]">{text}</code>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  invalidateOn?: string | number | boolean | object | null;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps | Readonly<ErrorBoundaryProps>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // We do not have a service to do client logging. Could be nice at some point.
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    // invalidate the error if the invalidateOn prop changes. Typical use will be the key of the item. Or a filter. Whatever would trigger a new fetch typically
    if (prevProps.invalidateOn !== this.props.invalidateOn) {
      this.setState({
        ...this.state,
        error: null,
      });
    }
  }

  render() {
    const { error } = this.state;

    // if there is no error then just return the children
    if (!error) {
      return this.props.children;
    }

    return (
      this.props.fallback ?? (
        <code className="g-block g-whitespace-pre-wrap g-font-[monospace]">
          Unable to parse input
        </code>
      )
    );
  }
}
