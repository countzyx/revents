import * as React from 'react';
import type { NewsFeedPost } from '@functions/Types';
import { Feed } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getDateTimeStringFromDate } from 'src/App/Shared/Utils';

type Props = { post: NewsFeedPost };

const EventNewsFeedItem: React.FC<Props> = (props) => {
  const { post } = props;
  const { code, date, displayName, eventId, eventTitle, photoURL, userId } = post;

  const getSummaryContent = (): React.ReactElement => {
    switch (code) {
      case 'joined-event': {
        return (
          <>
            <Link to={`/profile/${userId}`}>{displayName}</Link> signed up for{' '}
            <Link to={`/events/${eventId}`}>{eventTitle}</Link>
          </>
        );
      }
      case 'left-event': {
        return (
          <>
            <Link to={`/profile/${userId}`}>{displayName}</Link> canceled attending{' '}
            <Link to={`/events/${eventId}`}>{eventTitle}</Link>
          </>
        );
      }
      default: {
        return (
          <>
            <Link to={`/profile/${userId}`}>{displayName}</Link> {code}{' '}
            <Link to={`/events/${eventId}`}>{eventTitle}</Link>
          </>
        );
      }
    }
  };

  return (
    <Feed.Event>
      <Feed.Label image={photoURL} />
      <Feed.Content>
        <Feed.Date>
          {typeof date === 'number' ? getDateTimeStringFromDate(new Date(date)) : 'no date'}
        </Feed.Date>
        <Feed.Summary>{getSummaryContent()}</Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
};

export default EventNewsFeedItem;
