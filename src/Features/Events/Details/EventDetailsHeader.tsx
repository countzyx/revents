import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Item, Segment } from 'semantic-ui-react';
import { EventInfo } from '../../../App/Shared/Types';
import styles from './EventDetailsHeader.module.css';

type Props = {
  event: EventInfo;
};

const EventDetailsHeader: React.FC<Props> = (props: Props) => {
  const { event } = props;

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid className={styles.eventImage} />

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

      <Segment attached='bottom'>
        <Button>Cancel My Place</Button>
        <Button color='teal'>JOIN THIS EVENT</Button>

        <Button as={Link} to={`/editEvent/${event.id}`} color='orange' floated='right'>
          Manage Event
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailsHeader;
