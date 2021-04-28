import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import { docToEventInfo, getEventsFromFirestore } from '../../../App/Firebase/FirestoreService';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { fetchEvents, selectEventsIsLoading } from '../eventsSlice';
import EventFilters from './EventFilters';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventList from './EventsList';

const EventDashboard: React.FC = () => {
  const isLoading = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const unsubscribed = getEventsFromFirestore({
      next: (snapshot) => {
        dispatch(fetchEvents(snapshot.docs.map((doc) => docToEventInfo(doc))));
      },
      error: (err) => console.error(err),
    });

    return unsubscribed;
  }, [dispatch]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {isLoading && (
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
