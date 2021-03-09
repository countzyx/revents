import * as React from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { useAppSelector } from '../../../App/Store/hooks';
import EventDetailsChat from './EventDetailsChat';
import EventDetailsHeader from './EventDetailsHeader';
import EventDetailsInfo from './EventDetailsInfo';
import EventDetailsSidebar from './EventDetailsSidebar';

type EventDetailsParams = {
  id: string;
};

const EventDetails: React.FC = () => {
  const eventId = useParams<EventDetailsParams>().id;
  const event = useAppSelector((state) => state.events.events.find((e) => e.id === eventId));
  if (!event) {
    return <h1>No event found</h1>;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailsHeader event={event} />
        <EventDetailsInfo event={event} />
        <EventDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailsSidebar attendees={event.attendees} />
      </Grid.Column>
    </Grid>
  );
};

export default withRouter(EventDetails);
