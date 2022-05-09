import * as React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthIsAuthed } from '../../Auth/authSlice';
import { getAllEvents, selectEventsIsLoading } from '../eventsSlice';
import EventFilters from './EventFilters';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventNewsFeed from './EventNewsFeed';
import EventList from './EventsList';

const EventDashboard: React.FC = () => {
  const isAuthed = useAppSelector(selectAuthIsAuthed);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  const handleMoreButtonClick = () => {
    dispatch(getAllEvents());
  };

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
        <Button color='green' content='More...' floated='right' onClick={handleMoreButtonClick} />
      </Grid.Column>
      <Grid.Column width={6}>
        {isAuthed && <EventNewsFeed />}
        <EventFilters />
      </Grid.Column>
    </Grid>
  );
};

export default EventDashboard;
