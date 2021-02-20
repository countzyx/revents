import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import EventForm from '../Form/EventForm';
import EventList from './EventsList';
import SampleData from '../../../App/Api/SampleData';

const EventDashboard: React.FC = () => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={SampleData} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventForm />
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
