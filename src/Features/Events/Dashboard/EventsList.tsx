import * as React from 'react';
import EventListItem from './EventListItem';
import { useAppSelector } from '../../../App/Store/hooks';

const EventList: React.FC = () => {
  const events = useAppSelector((state) => state.events.events);

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </>
  );
};

export default EventList;
