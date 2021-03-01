import * as React from 'react';
import { Button, Header, Image, Item, Segment } from 'semantic-ui-react';
import styles from './EventDetailsHeader.module.css';

const EventDetailsHeader: React.FC = () => {
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image src='/assets/categoryImages/drinks.jpg' fluid className={styles.eventImage} />

        <Segment basic className={styles.eventImageText}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size='huge' content='Event Title' style={{ color: 'white' }} />
                <p>Event Date</p>
                <p>
                  Hosted by <strong>Bob</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached='bottom'>
        <Button>Cancel My Place</Button>
        <Button color='teal'>JOIN THIS EVENT</Button>

        <Button color='orange' floated='right'>
          Manage Event
        </Button>
      </Segment>
    </Segment.Group>
  );
};

export default EventDetailsHeader;
