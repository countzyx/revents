import * as React from 'react';
import { Button, Icon, Item, List, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import EventListAttendee from './EventListAttendee';
import type { EventInfo } from '../../../App/Shared/Types';

type Props = {
  event: EventInfo;
  onDeleteEvent: (eventId: string) => void;
};

const EventListItem: React.FC<Props> = (props: Props) => {
  const { event, onDeleteEvent } = props;

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' src={event.hostPhotoUrl} />
            <Item.Content>
              <Item.Header content={event.title} />
              <Item.Description>Hosted by {event.hostedBy}</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {event.date}
          <Icon name='marker' /> {event.venue}
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
        <Button color='red' floated='right' content='Delete' onClick={() => onDeleteEvent(event.id)} />
        <Button color='teal' floated='right' content='View' as={Link} to={`/events/${event.id}`} />
      </Segment>
    </Segment.Group>
  );
};

export default EventListItem;
