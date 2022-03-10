import * as React from 'react';
import { Link } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react';
import type { EventAttendee } from '../../../App/Shared/Types';

type Props = {
  attendee: EventAttendee;
};

const EventListAttendee: React.FC<Props> = (props: Props) => {
  const { attendee } = props;

  return (
    <List.Item>
      <Link to={`/profile/${attendee.id}`}>
        <Image size='mini' circular src={attendee.photoUrl} />
      </Link>
    </List.Item>
  );
};

export default EventListAttendee;
