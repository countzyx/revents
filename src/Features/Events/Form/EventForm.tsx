import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';

type Props = {
  onCloseEventForm: () => void;
};

const EventForm: React.FC<Props> = (props: Props) => {
  const { onCloseEventForm } = props;

  return (
    <Segment clearing>
      <Header content='Create a new event' />
      <Form>
        <Form.Field>
          <input type='text' placeholder='Event title' />
        </Form.Field>
        <Form.Field>
          <input type='text' placeholder='Category' />
        </Form.Field>
        <Form.Field>
          <input type='text' placeholder='Description' />
        </Form.Field>
        <Form.Field>
          <input type='text' placeholder='City' />
        </Form.Field>
        <Form.Field>
          <input type='text' placeholder='Venue' />
        </Form.Field>
        <Form.Field>
          <input type='text' placeholder='Date' />
        </Form.Field>
        <Button type='submit' floated='right' positive content='Submit' />
        <Button type='submit' floated='right' content='Cancel' onClick={onCloseEventForm} />
      </Form>
    </Segment>
  );
};

export default EventForm;
