import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { fetchEvents, selectEventsIsLoading } from '../eventsSlice';
import EventList from './EventsList';

const EventDashboard: React.FC = () => {
  const isLoading = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h1>Event Filters</h1>
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
