import * as React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import { fetchSingleEvent, selectEventsError, selectEventsIsLoading } from '../eventsSlice';
import EventDetailsChat from './EventDetailsChat';
import EventDetailsHeader from './EventDetailsHeader';
import EventDetailsInfo from './EventDetailsInfo';
import EventDetailsSidebar from './EventDetailsSidebar';

const EventDetails: React.FC = () => {
  const { eventId } = useParams();
  const user = useAppSelector(selectAuthUserInfo);
  const event = useAppSelector((state) => state.events.events.find((e) => e.id === eventId));
  const eventsError = useAppSelector(selectEventsError);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    if (event) return undefined;
    if (!eventId) return undefined;

    const unsubscribed = fetchSingleEvent(dispatch, eventId);
    return unsubscribed;
  }, [dispatch, event, eventId]);

  if (isLoadingEvents) return <LoadingComponent />;

  if (eventsError) return <Navigate to='/error' state={eventsError} />;

  if (!event) {
    return <h1>No event found</h1>;
  }

  const isHost = event.hostUid === user?.uid;
  const isAttending = event.attendeeIds.some((id) => id === user?.uid);

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailsHeader event={event} userIsHost={isHost} userIsAttending={isAttending} />
        <EventDetailsInfo event={event} />
        <EventDetailsChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailsSidebar attendees={event.attendees} />
      </Grid.Column>
    </Grid>
  );
};

export default EventDetails;
