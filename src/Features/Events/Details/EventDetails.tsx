import * as React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  fetchSingleEvent,
  selectEventsDetailedEvent,
  selectEventsDetailedEventError,
  selectEventsIsLoadingDetailedEvent,
} from '../eventsSlice';
import EventDetailsChat from './EventDetailsChat';
import EventDetailsHeader from './EventDetailsHeader';
import EventDetailsInfo from './EventDetailsInfo';
import EventDetailsSidebar from './EventDetailsSidebar';

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const event = useAppSelector(selectEventsDetailedEvent);
  const eventError = useAppSelector(selectEventsDetailedEventError);
  const isLoadingEvent = useAppSelector(selectEventsIsLoadingDetailedEvent);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (!eventId) return undefined;

    const unsubscribed = fetchSingleEvent(dispatch, eventId);
    return unsubscribed;
  }, [dispatch, eventId]);

  if (isLoadingEvent) return <LoadingComponent />;

  if (eventError) return <Navigate to='/error' state={eventError} />;

  if (!event) {
    return <h1>No event found</h1>;
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailsHeader event={event} />
        <EventDetailsInfo event={event} />
        <EventDetailsChat eventId={event.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailsSidebar attendees={event.attendees} hostUid={event.hostUid} />
      </Grid.Column>
    </Grid>
  );
};

export default EventDetails;
