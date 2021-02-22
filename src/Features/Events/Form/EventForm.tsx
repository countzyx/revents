import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';

type Props = {
  onCloseEventForm: () => void;
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

const EventForm: React.FC<Props> = (props: Props) => {
  const { onCloseEventForm } = props;
  const [formState, setFormState] = React.useState<EventFormState>(initialState);

  const onFormSubmitHandler: React.FormEventHandler<HTMLFormElement> = (formEvent) => {
    console.log(formEvent);
  };

  const onInputChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (changeEvent) => {
    const { name, value } = changeEvent.target;
    setFormState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <Segment clearing>
      <Header content='Create a new event' />
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
        <Button type='submit' floated='right' content='Cancel' onClick={onCloseEventForm} />
      </Form>
    </Segment>
  );
};

export default EventForm;
