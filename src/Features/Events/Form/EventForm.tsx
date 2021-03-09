import * as React from 'react';
import _ from 'lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import type { EventInfo } from '../../../App/Shared/Types';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { createEvent, updateEvent } from '../eventsSlice';

type EventFormState = {
  title: string;
  category: string;
  description: string;
  city: string;
  venue: string;
  date: string;
};

const initialState: EventFormState = {
  title: '',
  category: '',
  description: '',
  city: '',
  venue: '',
  date: '',
};

const blankEvent: EventInfo = {
  id: '',
  category: '',
  city: '',
  date: '',
  description: '',
  hostPhotoUrl: '',
  hostedBy: '',
  title: '',
  venue: '',
  attendees: [],
};

type EditEventParams = {
  id: string;
};

const EventForm: React.FC = () => {
  const history = useHistory();
  const eventId = useParams<EditEventParams>().id;
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.events);
  const selectedEvent = eventId ? events.find((e) => e.id === eventId) : undefined;
  const [formState, setFormState] = React.useState<EventFormState>(selectedEvent ?? initialState);

  const onFormSubmitHandler: React.FormEventHandler<HTMLFormElement> = (formEvent) => {
    formEvent.preventDefault();

    if (selectedEvent) {
      const updatedEvent: EventInfo = { ...blankEvent, ...formState };
      dispatch(updateEvent(updatedEvent));
      history.push(`/events/${updatedEvent.id}`);
    } else {
      const newEvent: EventInfo = {
        ...blankEvent,
        id: _.uniqueId(),
        hostedBy: 'Bobbie',
        hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        ...formState,
      };
      dispatch(createEvent(newEvent));
      history.push(`/events/${newEvent.id}`);
    }
  };

  const onCancel = () => {
    if (selectedEvent) {
      history.push(`/events/${selectedEvent.id}`);
    } else {
      history.push('/events');
    }
  };

  const onInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setFormState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <Segment clearing>
      <Header content={selectedEvent ? 'Edit event' : 'Create a new event'} />
      <Form onSubmit={onFormSubmitHandler}>
        <Form.Field>
          <input
            type='text'
            name='title'
            placeholder='Event title'
            value={formState.title}
            onChange={onInputChangeHandler}
          />
        </Form.Field>
        <Form.Field>
          <input
            type='text'
            name='category'
            placeholder='Category'
            value={formState.category}
            onChange={onInputChangeHandler}
          />
        </Form.Field>
        <Form.Field>
          <input
            type='text'
            name='description'
            placeholder='Description'
            value={formState.description}
            onChange={onInputChangeHandler}
          />
        </Form.Field>
        <Form.Field>
          <input type='text' name='city' placeholder='City' value={formState.city} onChange={onInputChangeHandler} />
        </Form.Field>
        <Form.Field>
          <input type='text' name='venue' placeholder='Venue' value={formState.venue} onChange={onInputChangeHandler} />
        </Form.Field>
        <Form.Field>
          <input type='date' name='date' placeholder='Date' value={formState.date} onChange={onInputChangeHandler} />
        </Form.Field>
        <Button type='submit' floated='right' positive content='Submit' />
        <Button floated='right' content='Cancel' onClick={onCancel} />
      </Form>
    </Segment>
  );
};

export default withRouter(EventForm);
