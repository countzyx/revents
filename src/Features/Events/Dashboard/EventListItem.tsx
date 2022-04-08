import * as React from 'react';
import { Button, Icon, Item, Label, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import EventListAttendee from './EventListAttendee';
import type { EventInfo } from '../../../App/Shared/Types';
import { deleteEventInFirestore } from '../../../App/Firebase/FirestoreEventService';

type Props = {
  event: EventInfo;
};

const EventListItem: React.FC<Props> = (props: Props) => {
  const { event } = props;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' src={event.hostPhotoURL} />
            <Item.Content>
              <Item.Header content={event.title} />
              <Item.Description>
                Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
              </Item.Description>
              {event.isCancelled && (
                <Label
                  color='red'
                  content='This event has been cancelled'
                  ribbon='right'
                  style={{ top: '-40px' }}
                />
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {event.date}
          <Icon name='marker' /> {event.venue.address}
        </span>
      </Segment>
      <Segment secondary>
        <List horizontal>
          {event.attendees?.map((a) => (
            <EventListAttendee key={a.id} attendee={a} />
          ))}
        </List>
      </Segment>
      <Segment clearing>
        <div>{event.description}</div>
        <Button
          color='red'
          floated='right'
          content='Delete'
          onClick={() => deleteEventInFirestore(event.id)}
        />
        <Button color='teal' floated='right' content='View' as={Link} to={`${event.id}`} />
      </Segment>
    </Segment.Group>
  );
};

export default EventListItem;
