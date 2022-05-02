import * as React from 'react';
import { Feed, Header, Segment } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';

const EventsFeed: React.FC = () => {
  const date = '3 days ago';
  const summary = 'Diana joined an event';

  return (
    <>
      <Header attached color='teal' content='News Feed' icon='newspaper' />
      <Segment attached='bottom'>
        <Feed>
          <Feed.Event date={date} image={kUnknownUserImageUrl} summary={summary} />
          <Feed.Event date={date} image={kUnknownUserImageUrl} summary={summary} />
          <Feed.Event date={date} image={kUnknownUserImageUrl} summary={summary} />
        </Feed>
      </Segment>
    </>
  );
};

export default EventsFeed;
