import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from './EventsList';
import type { EventInfo } from '../../../App/Shared/Types';

type Props = {
  events: EventInfo[];
  onDeleteEvent: (eventId: string) => void;
};

const EventDashboard: React.FC<Props> = (props: Props) => {
  const { events, onDeleteEvent } = props;

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} onDeleteEvent={onDeleteEvent} />
      </Grid.Column>
      <Grid.Column width={6}>
        <h1>Event Filters</h1>
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
