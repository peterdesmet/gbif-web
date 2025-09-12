import { Button } from '@/components/ui/button';
import { FeedbackQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import { MdLink } from 'react-icons/md';

interface DataProviderFeedbackProps {
  feedbackOptions: NonNullable<FeedbackQuery['feedbackOptions']>;
  onClose: () => void;
}

export function DataProviderFeedback({ feedbackOptions }: DataProviderFeedbackProps) {
  if (feedbackOptions.externalServiceUrl) {
    return (
      <div className="g-space-y-4 g-mt-6">
        <p className="g-text-sm g-text-muted-foreground">
          <FormattedMessage
            id="feedback.publisherHasWebsite"
            defaultMessage="This publisher has a website for handling feedback. We recommend using that."
          />
        </p>
        <Button asChild>
          <a
            href={feedbackOptions.externalServiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="g-w-full"
          >
            {feedbackOptions.externalServiceName || (
              <FormattedMessage
                id="feedback.datasetFeedbackSystem"
                defaultMessage="Dataset feedback system"
              />
            )}
            <MdLink className="g-ms-2" />
          </a>
        </Button>
        {feedbackOptions.contactEmail && (
          <div className="g-text-xs g-text-muted-foreground">
            <FormattedMessage
              id="feedback.orWriteMailTo"
              defaultMessage="Or write a mail to {contactLink}"
              values={{
                contactLink: (
                  <a href={`mailto:${feedbackOptions.contactEmail}`} className="g-underline">
                    {feedbackOptions.contactName ?? feedbackOptions.contactEmail}
                  </a>
                ),
              }}
            />
          </div>
        )}
      </div>
    );
  }

  if (feedbackOptions.contactEmail) {
    return (
      <div className="g-space-y-4">
        <p className="g-text-sm g-text-muted-foreground">
          <FormattedMessage
            id="feedback.contactDatasetProviderDirectly"
            defaultMessage="Contact the dataset provider directly for questions about this data:"
          />
        </p>
        <div className="g-p-4 g-border g-rounded-lg g-bg-gray-50">
          {feedbackOptions.contactName && (
            <div className="g-mb-2">
              <strong>{feedbackOptions.contactName}</strong>
            </div>
          )}
          <Button asChild>
            <a
              href={`mailto:${feedbackOptions.contactEmail}?subject=GBIF.org feedback&body=Feedback from GBIF.org regarding: ${window.location.href}`}
            >
              <FormattedMessage id="feedback.sendEmail" defaultMessage="Send email" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
