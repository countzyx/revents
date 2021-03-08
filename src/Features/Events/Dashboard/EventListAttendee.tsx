import * as React from 'react';
import { Image, List } from 'semantic-ui-react';
import type { EventAttendee } from '../../../App/Shared/Types';

type Props = {
  attendee: EventAttendee;
};

const EventListAttendee: React.FC<Props> = (props: Props) => {
  const { attendee } = props;

  return (
    <List.Item>
      <Image size='mini' circular src={attendee.photoUrl} />
    </List.Item>
  );
};

export default EventListAttendee;
