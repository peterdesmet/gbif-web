import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FeedbackQuery, FeedbackQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';
import { MdFeedback, MdArrowBack } from 'react-icons/md';
import { useMatches } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { DataProviderFeedback } from './DataProviderFeedback';
import { GbifFeedback } from './GbifFeedback';

type PageType = {
  type: 'occurrenceKey' | null;
  key: string | null;
  id: string | null;
};

type FeedbackOption = 'dataProvider' | 'gbif' | null;

function getPageType(matches: ReturnType<typeof useMatches>): PageType {
  const page = matches.find((match) => match.id.startsWith('occurrenceKey-'));
  if (!page) {
    return { type: null, key: null, id: null };
  }
  const key = page?.params?.key ?? null;
  return { type: 'occurrenceKey', key, id: `pageType:occurrenceKey key:${key}` };
}

export function FeedbackPopover({ trigger = <MdFeedback /> }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FeedbackOption>(null);
  const matches = useMatches();
  const [pageType, setPageType] = useState<PageType | null>(null);
  const {
    data: feedbackData,
    loading,
    error,
    load,
  } = useQuery<FeedbackQuery, FeedbackQueryVariables>(FEEDBACK_QUERY, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (open && pageType?.id) {
      load({ variables: { pageType: pageType.type, key: pageType.key } });
    }
  }, [pageType?.id, load, open]);

  useEffect(() => {
    // check if any of the matches has an id that matches "occurrenceKey"
    const newPageType = getPageType(matches);
    if (newPageType?.id !== pageType?.id) {
      setPageType(newPageType);
    }
  }, [matches, pageType?.id]);

  // Reset state when popover closes
  useEffect(() => {
    if (!open) {
      setSelectedOption(null);
    }
  }, [open]);

  const data = pageType?.id ? feedbackData : null;

  const hasDataProviderOptions =
    data?.feedbackOptions &&
    (data.feedbackOptions.contactEmail || data.feedbackOptions.externalServiceUrl);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  const getTitle = () => {
    if (!selectedOption) {
      return <FormattedMessage id="feedback.title" defaultMessage="Questions and comments" />;
    }
    if (selectedOption === 'dataProvider') {
      return (
        <FormattedMessage
          id="feedback.contactDataProvider"
          defaultMessage="Contact data provider"
        />
      );
    }
    return <FormattedMessage id="feedback.contactUs" defaultMessage="Contact GBIF" />;
  };

  const getDescription = () => {
    if (selectedOption === 'dataProvider') {
      return null;
    }
    return (
      <FormattedMessage
        id="feedback.seeAlsoFaq"
        defaultMessage="See also the {faqLink}"
        values={{
          faqLink: (
            <DynamicLink className="g-underline" to="/faq" onClick={() => setOpen(false)}>
              <FormattedMessage id="feedback.faq" defaultMessage="FAQ" />
            </DynamicLink>
          ),
        }}
      />
    );
  };

  const renderContent = () => {
    // Show loading state
    if (loading) {
      return (
        <Skeleton className="g-mt-4 g-w-full g-p-4 g-h-24 g-text-left g-border g-rounded-lg">
          <FormattedMessage id="feedback.loading" defaultMessage="Loading..." />
        </Skeleton>
      );
    }

    // Handle specific option selections
    if (selectedOption === 'dataProvider' && data?.feedbackOptions) {
      return <DataProviderFeedback feedbackOptions={data.feedbackOptions} onClose={handleClose} />;
    }

    if (selectedOption === 'gbif') {
      return <GbifFeedback pageType={pageType} onClose={handleClose} />;
    }

    // Handle main content based on data provider options availability
    const shouldShowOptions = !error && hasDataProviderOptions && !selectedOption;

    if (shouldShowOptions) {
      return renderOptionSelection();
    }

    // Default to GBIF feedback (covers error cases and no data provider options)
    return <GbifFeedback pageType={pageType} onClose={handleClose} />;
  };

  const renderOptionSelection = () => (
    <div className="g-space-y-4 g-mt-4">
      <div className="g-space-y-3">
        <button
          onClick={() => setSelectedOption('dataProvider')}
          className="g-w-full g-p-4 g-text-left g-border g-rounded-lg g-bg-gray-50 hover:g-bg-gray-100 g-transition-colors"
        >
          <h4 className="g-font-medium g-mb-1">
            <FormattedMessage
              id="feedback.contactDataProvider"
              defaultMessage="Contact data provider"
            />
          </h4>
          <p className="g-text-sm g-text-muted-foreground">
            <FormattedMessage
              id="feedback.contactDataProviderDescription"
              defaultMessage="For questions about data quality, species information, or dataset-specific issues"
            />
          </p>
        </button>
        <button
          onClick={() => setSelectedOption('gbif')}
          className="g-w-full g-p-4 g-text-left g-border g-rounded-lg g-bg-gray-50 hover:g-bg-gray-100 g-transition-colors"
        >
          <h4 className="g-font-medium g-mb-1">
            <FormattedMessage id="feedback.contactUs" defaultMessage="Contact GBIF" />
          </h4>
          <p className="g-text-sm g-text-muted-foreground">
            <FormattedMessage
              id="feedback.contactUsDescription"
              defaultMessage="For website issues, data processing problems, or general GBIF questions"
            />
          </p>
        </button>
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="g-w-96 g-shadow-2xl g-p-6">
        <div className="">
          <div className="g-space-y-2">
            <div className="g-flex g-items-center g-gap-2">
              {selectedOption && (
                <button
                  onClick={handleBack}
                  className="g-pe-1 hover:g-bg-gray-100 g-rounded g-flex g-items-center g-justify-center"
                >
                  <MdArrowBack className="g-w-4 g-h-4" />
                </button>
              )}
              <h4 className="g-font-medium g-leading-none">{getTitle()}</h4>
            </div>
            <p className="g-text-sm g-text-muted-foreground">{getDescription()}</p>
          </div>
        </div>

        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

const FEEDBACK_QUERY = /* GraphQL */ `
  query Feedback($pageType: String!, $key: ID!) {
    feedbackOptions(pageType: $pageType, key: $key) {
      contactEmail
      contactName
      externalServiceName
      externalServiceUrl
    }
  }
`;
