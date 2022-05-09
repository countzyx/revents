import * as React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Comment, Header, Segment } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  clearChat,
  listenToChatCommentsForEvent,
  selectEventsChatComments,
  selectEventsChatError,
  selectEventsIsLoadingChat,
} from '../eventsSlice';
import EventDetailsChatForm from './EventDetailsChatForm';

type Props = {
  eventId: string;
};

const EventDetailsChat: React.FC<Props> = (props) => {
  const { eventId } = props;
  const dispatch = useAppDispatch();
  const chatComments = useAppSelector(selectEventsChatComments);
  const chatError = useAppSelector(selectEventsChatError);
  const isLoadingChat = useAppSelector(selectEventsIsLoadingChat);
  const [replyFormTarget, setReplyFormTarget] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const unsubscribe = listenToChatCommentsForEvent(dispatch, eventId);
    return () => {
      unsubscribe();
      dispatch(clearChat());
    };
  }, [dispatch, eventId]);

  React.useEffect(() => {
    if (!chatError) return;
    toast.error(chatError.message);
  }, [chatError]);

  const handleCloseReplyForm = () => {
    setReplyFormTarget(undefined);
  };

  const handleOpenReplyForm = (commentId?: string) => {
    if (commentId) setReplyFormTarget(commentId);
  };

  return (
    <>
      <Segment textAlign='center' attached='top' inverted color='teal' style={{ border: 'none' }}>
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached loading={isLoadingChat}>
        <EventDetailsChatForm eventId={eventId} />
        <Comment.Group>
          {chatComments.map(
            (c) =>
              c.id && ( // c.id is not undefined or null
                <Comment key={c.id}>
                  <Comment.Avatar src={c.photoURL || kUnknownUserImageUrl} />
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
                      <Comment.Action onClick={() => handleOpenReplyForm(c.id)}>
                        Reply
                      </Comment.Action>
                      {replyFormTarget === c.id && (
                        <EventDetailsChatForm
                          eventId={eventId}
                          onClose={handleCloseReplyForm}
                          parentCommentId={c.id}
                        />
                      )}
                    </Comment.Actions>
                  </Comment.Content>
                  {c.children && c.children.length > 0 && (
                    <Comment.Group>
                      {c.children.map((child) => (
                        <Comment key={child.id}>
                          <Comment.Avatar src={child.photoURL || kUnknownUserImageUrl} />
                          <Comment.Content>
                            <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                              {child.name}
                            </Comment.Author>
                            <Comment.Metadata>
                              <div>{child.datetime}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                              {child.text.split('\n').map((s, i) => (
                                // disabling eslint check because we are just breaking down string in to an array of chunks
                                // eslint-disable-next-line react/no-array-index-key
                                <span key={`${child.id}-${i}`}>
                                  {s}
                                  <br />
                                </span>
                              ))}
                            </Comment.Text>
                            <Comment.Actions>
                              <Comment.Action onClick={() => handleOpenReplyForm(child.id)}>
                                Reply
                              </Comment.Action>
                              {replyFormTarget === child.id && (
                                <EventDetailsChatForm
                                  eventId={eventId}
                                  onClose={handleCloseReplyForm}
                                  parentCommentId={child.parentId}
                                />
                              )}
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      ))}
                    </Comment.Group>
                  )}
                </Comment>
              ),
          )}
        </Comment.Group>
      </Segment>
    </>
  );
};

export default EventDetailsChat;
