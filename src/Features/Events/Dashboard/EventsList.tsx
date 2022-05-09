import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import EventListItem from './EventListItem';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  getAllEvents,
  selectEvents,
  selectEventsAreMoreAvailable,
  selectEventsIsLoading,
} from '../eventsSlice';

const EventList: React.FC = () => {
  const areMoreEventsAvailable = useAppSelector(selectEventsAreMoreAvailable);
  const events = useAppSelector(selectEvents);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();

  const handleLoadMore = (_: number) => {
    dispatch(getAllEvents());
  };

  if (events.length === 0) return <div />;

  return (
    <InfiniteScroll
      hasMore={!isLoadingEvents && areMoreEventsAvailable}
      initialLoad={false}
      loadMore={handleLoadMore}
    >
      {events.map((e) => (
        <EventListItem key={e.id} event={e} />
      ))}
    </InfiniteScroll>
  );
};

export default EventList;
