import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from './EventsList';

const EventDashboard: React.FC = () => (
  <Grid>
    <Grid.Column width={10}>
      <EventList />
    </Grid.Column>
    <Grid.Column width={6}>
      <h1>Event Filters</h1>
    </Grid.Column>
  </Grid>
);

export default EventDashboard;
