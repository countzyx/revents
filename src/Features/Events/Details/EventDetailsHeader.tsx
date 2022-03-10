import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Item, Label, Segment } from 'semantic-ui-react';
import { EventInfo } from '../../../App/Shared/Types';
import styles from './EventDetailsHeader.module.css';

type Props = {
  event: EventInfo;
  userIsHost: boolean;
  userIsAttending: boolean;
};

const EventDetailsHeader: React.FC<Props> = (props: Props) => {
  const { event, userIsAttending, userIsHost } = props;

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
            <Button color='teal'>JOIN THIS EVENT</Button>
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
