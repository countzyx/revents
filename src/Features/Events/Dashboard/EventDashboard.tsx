import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { fetchAllEvents, selectEventsIsLoading } from '../eventsSlice';
import EventFilters from './EventFilters';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventList from './EventsList';

const EventDashboard: React.FC = () => {
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const unsubscribed = fetchAllEvents(dispatch);
    return unsubscribed;
  }, [dispatch]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {isLoadingEvents && (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        )}
        <EventList />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventFilters />
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
