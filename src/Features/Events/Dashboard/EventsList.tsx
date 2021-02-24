import * as React from 'react';
import EventListItem from './EventListItem';
import type { EventInfo } from '../../../Shared/Types';

type Props = {
  events: EventInfo[];
  onSelectEvent: (selectedEvent: EventInfo) => void;
};

const EventList: React.FC<Props> = (props: Props) => {
  const { events, onSelectEvent } = props;

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} onSelectEvent={onSelectEvent} />
      ))}
    </>
  );
};

export default EventList;
