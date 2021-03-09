import * as React from 'react';
import { Item, Segment } from 'semantic-ui-react';
import { EventAttendee } from '../../../App/Shared/Types';

type Props = {
  attendees: EventAttendee[] | undefined;
};

const EventDetailsSidebar: React.FC<Props> = (props: Props) => {
  const { attendees } = props;

  const getPeopleCountMessage = () => {
    if (attendees) {
      if (attendees.length === 1) {
        return '1 Person';
      }

      if (attendees.length > 1) {
        return `${attendees.length} People`;
      }
    }

    return 'No one';
  };

  return (
    <>
      <Segment textAlign='center' style={{ border: 'none' }} attached='top' secondary inverted color='teal'>
        {getPeopleCountMessage()} Going
      </Segment>
      <Segment attached>
        <Item.Group relaxed divided>
          {attendees?.map((a) => (
            <Item key={a.id} style={{ position: 'relative' }}>
              <Item.Image size='tiny' src={a.photoUrl || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <span>{a.name}</span>
                </Item.Header>
              </Item.Content>
            </Item>
          ))}
        </Item.Group>
      </Segment>
    </>
  );
};

export default EventDetailsSidebar;
