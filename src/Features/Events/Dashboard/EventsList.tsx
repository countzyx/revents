import * as React from 'react';
import EventListItem from './EventListItem';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { fetchEvents, selectEvents } from '../eventsSlice';

const EventList: React.FC = () => {
  const events = useAppSelector(selectEvents);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      {events.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </>
  );
};

export default EventList;
