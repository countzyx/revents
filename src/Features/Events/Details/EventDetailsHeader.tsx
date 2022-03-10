import * as React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Header, Image, Item, Label, Segment } from 'semantic-ui-react';
import { EventInfo } from '../../../App/Shared/Types';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  addCurrentUserAsAttendeeToEvent,
  selectEventsIsUpdatingAttendees,
  seletcEventsUpdateAttendeesError,
} from '../eventsSlice';
import styles from './EventDetailsHeader.module.css';

type Props = {
  event: EventInfo;
};

const EventDetailsHeader: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const user = useAppSelector(selectAuthUserInfo);
  const isUpdatingAttendees = useAppSelector(selectEventsIsUpdatingAttendees);
  const updateAttendeesError = useAppSelector(seletcEventsUpdateAttendeesError);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (!updateAttendeesError) return;
    toast.error(updateAttendeesError.message);
  }, [updateAttendeesError]);

  const userIsHost = event.hostUid === user?.uid;
  const userIsAttending = event.attendeeIds.some((id) => id === user?.uid);

  const onAddCurrentUserAsAttendee = () => {
    dispatch(addCurrentUserAsAttendeeToEvent(event));
  };

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${event.category}.jpg`}
          fluid
          className={styles.eventImage}
        />
        {event.isCancelled && (
          <Label
            color='red'
            content='This event has been cancelled'
            ribbon='right'
            style={{ position: 'absolute', transform: 'translateX(-15.5rem) translateY(-4rem)' }}
          />
        )}
        <Segment basic className={styles.eventImageText}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size='huge' content={event.title} style={{ color: 'white' }} />
                <p>{event.date}</p>
                <p>
                  Hosted by <strong>{event.hostedBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached='bottom' clearing>
        {!userIsHost &&
          (userIsAttending ? (
            <Button>Cancel My Place</Button>
          ) : (
            <Button color='teal' loading={isUpdatingAttendees} onClick={onAddCurrentUserAsAttendee}>
              JOIN THIS EVENT
            </Button>
          ))}

        {userIsHost && (
          <Button as={Link} to={`/editEvent/${event.id}`} color='orange' floated='right'>
            Manage Event
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailsHeader;
