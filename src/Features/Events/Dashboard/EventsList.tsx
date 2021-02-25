import * as React from 'react';
import EventListItem from './EventListItem';
import type { EventInfo } from '../../../Shared/Types';

type Props = {
  events: EventInfo[];
  onSelectEvent: (selectedEvent: EventInfo) => void;
  onDeleteEvent: (eventId: string) => void;
};

const EventList: React.FC<Props> = (props: Props) => {
  const { events, onDeleteEvent, onSelectEvent } = props;

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} onDeleteEvent={onDeleteEvent} onSelectEvent={onSelectEvent} />
      ))}
    </>
  );
};

export default EventList;
