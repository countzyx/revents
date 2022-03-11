import * as React from 'react';
import { Link } from 'react-router-dom';
import { Item, Label, Segment } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { EventAttendee } from '../../../App/Shared/Types';

type Props = {
  attendees: EventAttendee[] | undefined;
  hostUid: string;
};

const EventDetailsSidebar: React.FC<Props> = (props: Props) => {
  const { attendees, hostUid } = props;

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
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {getPeopleCountMessage()} Going
      </Segment>
      <Segment attached>
        <Item.Group relaxed divided>
          {attendees?.map((a) => (
            <Item as={Link} key={a.id} style={{ position: 'relative' }} to={`/profile/${a.id}`}>
              {hostUid === a.id && (
                <Label
                  color='orange'
                  content='Host'
                  ribbon='right'
                  style={{ position: 'absolute' }}
                />
              )}
              <Item.Image size='tiny' src={a.photoUrl || kUnknownUserImageUrl} />
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
