import * as React from 'react';
import { Grid, GridColumn, Loader } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthIsAuthed } from '../../Auth/authSlice';
import { clearEvents, getAllEvents, selectEventsIsLoading } from '../eventsSlice';
import EventFilters from './EventFilters';
import EventListItemPlaceholder from './EventListItemPlaceholder';
import EventNewsFeed from './EventNewsFeed';
import EventList from './EventsList';

const EventDashboard: React.FC = () => {
  const isAuthed = useAppSelector(selectAuthIsAuthed);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();
  const [isLoadingInitial, setIsLoadingInitial] = React.useState(true);

  React.useEffect(() => {
    dispatch(getAllEvents());
    setIsLoadingInitial(false);
    return () => {
      dispatch(clearEvents());
    };
  }, [dispatch]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {isLoadingInitial && (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        )}
        <EventList />
      </Grid.Column>
      <Grid.Column width={6}>
        {isAuthed && <EventNewsFeed />}
        <EventFilters />
      </Grid.Column>
      <GridColumn width={10}>
        <Loader active={isLoadingEvents} />
      </GridColumn>
    </Grid>
  );
};

export default EventDashboard;
