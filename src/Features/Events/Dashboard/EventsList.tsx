import * as React from 'react';
import EventListItem from './EventListItem';
import type { EventInfo } from '../../../Shared/Types';

type Props = {
  events: EventInfo[];
};

const EventList: React.FC<Props> = (props: Props) => {
  const { events } = props;

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </>
  );
};

export default EventList;
