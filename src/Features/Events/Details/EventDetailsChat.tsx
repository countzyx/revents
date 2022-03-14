import * as React from 'react';
import { Link } from 'react-router-dom';
import { Comment, Header, Segment } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { clearChat, fetchChatCommentsForEvent, selectEventsChatComments } from '../eventsSlice';
import EventDetailsChatForm from './EventDetailsChatForm';

type Props = {
  eventId: string;
};

const EventDetailsChat: React.FC<Props> = (props) => {
  const { eventId } = props;
  const dispatch = useAppDispatch();
  const chatComments = useAppSelector(selectEventsChatComments);

  React.useEffect(() => {
    const unsubscribe = fetchChatCommentsForEvent(dispatch, eventId);
    return () => {
      unsubscribe();
      dispatch(clearChat());
    };
  }, [dispatch, eventId]);
  return (
    <>
      <Segment textAlign='center' attached='top' inverted color='teal' style={{ border: 'none' }}>
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <EventDetailsChatForm eventId={eventId} />
        <Comment.Group>
          {chatComments.map((c) => (
            <Comment key={c.id || c.datetime}>
              <Comment.Avatar src={c.photoUrl || kUnknownUserImageUrl} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profile/${c.uid}`}>
                  {c.name}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{c.datetime}</div>
                </Comment.Metadata>
                <Comment.Text>
                  {c.text.split('\n').map((s, i) => (
                    // disabling eslint check because we are just breaking down string in to an array of chunks
                    // eslint-disable-next-line react/no-array-index-key
                    <span key={`${c.id}-${i}`}>
                      {s}
                      <br />
                    </span>
                  ))}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
};

export default EventDetailsChat;
