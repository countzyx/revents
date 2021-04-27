import * as React from 'react';
import { Button, Grid, Icon, Segment } from 'semantic-ui-react';
import { EventInfo } from '../../../App/Shared/Types';
import EventDetailsMap from './EventDetailsMap';

type Props = {
  event: EventInfo;
};

const EventDetailsInfo: React.FC<Props> = (props: Props) => {
  const { event } = props;
  const [isMapOpen, setIsMapOpen] = React.useState(false);

  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{event.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{event.date}</span>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='marker' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={11}>
            <span>{event.venue.address}</span>
          </Grid.Column>
          <Grid.Column width={4}>
            <Button
              color='teal'
              size='tiny'
              content={isMapOpen ? 'Hide Map' : 'Show Map'}
              onClick={() => setIsMapOpen((prevState) => !prevState)}
            />
          </Grid.Column>
        </Grid>
      </Segment>
      {isMapOpen && <EventDetailsMap center={event.venue.latLng} />}
    </Segment.Group>
  );
};

export default EventDetailsInfo;
