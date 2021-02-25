import * as React from 'react';
import EventListItem from './EventListItem';
import type { EventInfo } from '../../../Shared/Types';

type Props = {
  events: EventInfo[];
  onDeleteEvent: (eventId: string) => void;
};

const EventList: React.FC<Props> = (props: Props) => {
  const { events, onDeleteEvent } = props;

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} onDeleteEvent={onDeleteEvent} />
      ))}
    </>
  );
};

export default EventList;
