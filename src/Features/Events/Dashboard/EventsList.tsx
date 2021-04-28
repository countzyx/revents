import * as React from 'react';
import EventListItem from './EventListItem';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectEvents } from '../eventsSlice';

const EventList: React.FC = () => {
  const events = useAppSelector(selectEvents);

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </>
  );
};

export default EventList;
