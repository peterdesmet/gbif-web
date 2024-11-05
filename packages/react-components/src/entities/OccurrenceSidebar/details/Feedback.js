import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import { Properties, OptImage as Image, GalleryTiles, GalleryTile, Prose, Button } from "../../../components";
import { Header } from './Header';
import { HyperText } from '../../../components';
import { Group } from './Groups';
import { Card, CardHeader2, CardHeader3 } from '../../shared';
const { Term, Value } = Properties;

export function Feedback({
  data,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  if (!data?.occurrence) {
    return <div>Loading</div>
  }
  const feedback = data?.occurrence?.volatile?.feedback;

  return <div style={{ padding: '12px 0' }}>
    <Header data={data} />
    <section css={css`
        padding: 2rem;
        background: #f8f8f8;
      `}>
      
      {feedback.publisherFeedbackSystem && <Card style={{marginBottom: 12 }}>
        <CardHeader3><FormattedMessage id="feedback.occurrence.publisherFeedbackSystem.title" deafultMessage="Feedback system" /></CardHeader3>
        <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
          <FormattedMessage id="feedback.occurrence.publisherFeedbackSystem.description" deafultMessage="Feedback system" />
        </Prose>
        <Button as="a" href={feedback.publisherFeedbackSystem.value}>{feedback.publisherFeedbackSystem.title}</Button>
      </Card>}

      {feedback.datasetContactEmail && <Card style={{marginBottom: 12 }}>
        <CardHeader3><FormattedMessage id="feedback.occurrence.datasetContact.title" deafultMessage="Dataset" /></CardHeader3>
        <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
          <FormattedMessage id="feedback.occurrence.datasetContact.description" deafultMessage="Feedback system" />
        </Prose>
        <Button as="a" href={`mailto:${feedback.datasetContactEmail.value}`}>{feedback.datasetContactEmail.value}</Button>
      </Card>}
      
      <Card style={{marginBottom: 12 }}>
        <CardHeader3><FormattedMessage id="feedback.occurrence.gbifGithub.title" deafultMessage="GBIF" /></CardHeader3>
        <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
          <FormattedMessage id="feedback.occurrence.gbifGithub.description" deafultMessage="Feedback system" />
        </Prose>
        <Button as="a" href={feedback.gbifGithub}>Github</Button>
      </Card>
    </section>
  </div>
};