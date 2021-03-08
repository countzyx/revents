import * as React from 'react';
import * as _ from 'lodash';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import type { EventInfo } from '../../../App/Shared/Types';

type Props = {
  onCreateEvent: (newEvent: EventInfo) => void;
  onUpdateEvent: (updatedEvent: EventInfo) => void;
};

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

const EventForm: React.FC<Props> = (props: Props) => {
  const { onCreateEvent, onUpdateEvent } = props;
  const selectedEvent: EventInfo | undefined = undefined;
  const [formState, setFormState] = React.useState<EventFormState>(selectedEvent ?? initialState);

  const onFormSubmitHandler: React.FormEventHandler<HTMLFormElement> = (formEvent) => {
    formEvent.preventDefault();

    if (selectedEvent) {
      // const updatedEvent: EventInfo = { ...selectedEvent, ...formState };
      const updatedEvent: EventInfo = { ...blankEvent, ...formState };
      onUpdateEvent(updatedEvent);
    } else {
      const newEvent: EventInfo = {
        ...blankEvent,
        id: _.uniqueId(),
        hostedBy: 'Bobbie',
        hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        ...formState,
      };
      onCreateEvent(newEvent);
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
        <Button type='submit' floated='right' content='Cancel' />
      </Form>
    </Segment>
  );
};

export default EventForm;
