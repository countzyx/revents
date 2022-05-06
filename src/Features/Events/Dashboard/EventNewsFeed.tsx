import * as React from 'react';
import { toast } from 'react-toastify';
import { Feed, Header, Segment } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from 'src/App/Store/hooks';
import {
  fetchNewsFeedForCurrentUser,
  selectEventsIsLoadingNewsFeed,
  selectEventsNewsFeed,
  selectEventsNewsFeedError,
} from '../eventsSlice';
import EventNewsFeedItem from './EventNewsFeedItem';

const EventNewsFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingNewsFeed = useAppSelector(selectEventsIsLoadingNewsFeed);
  const newsFeed = useAppSelector(selectEventsNewsFeed);
  const newsFeedError = useAppSelector(selectEventsNewsFeedError);

  React.useEffect(() => {
    const unsubscribe = fetchNewsFeedForCurrentUser(dispatch);
    return unsubscribe;
  }, [dispatch]);

  React.useEffect(() => {
    if (!newsFeedError) return;
    toast.error(newsFeedError.message);
  }, [newsFeedError]);

  return (
    <>
      <Header attached color='teal' content='News Feed' icon='newspaper' />
      <Segment attached='bottom' loading={isLoadingNewsFeed}>
        <Feed>
          {newsFeed.map((post) => post.id && <EventNewsFeedItem key={post.id} post={post} />)}
        </Feed>
      </Segment>
    </>
  );
};

export default EventNewsFeed;
