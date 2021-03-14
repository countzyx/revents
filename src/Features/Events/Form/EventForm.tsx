/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import _ from 'lodash';
import { Button, FormField, Header, Segment } from 'semantic-ui-react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { Field, Form, Formik } from 'formik';
import type { EventInfo } from '../../../App/Shared/Types';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { createEvent, updateEvent } from '../eventsSlice';

type EventFormValues = {
  title: string;
  category: string;
  description: string;
  city: string;
  venue: string;
  date: string;
};

const defaultValues: EventFormValues = {
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
  const initialValues: EventFormValues = selectedEvent ? { ...selectedEvent } : defaultValues;

  const onFormSubmitHandler = (formValues: EventFormValues) => {
    if (selectedEvent) {
      const updatedEvent: EventInfo = { ...blankEvent, ...formValues };
      dispatch(updateEvent(updatedEvent));
      history.push(`/events/${updatedEvent.id}`);
    } else {
      const newEvent: EventInfo = {
        ...blankEvent,
        id: _.uniqueId(),
        hostedBy: 'Bobbie',
        hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        ...formValues,
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

  return (
    <Segment clearing>
      <Header content={selectedEvent ? 'Edit event' : 'Create a new event'} />
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            onFormSubmitHandler(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form className='ui form'>
          <FormField>
            <Field type='text' name='title' placeholder='Event title' />
          </FormField>
          <FormField>
            <Field type='text' name='category' placeholder='Category' />
          </FormField>
          <FormField>
            <Field type='text' name='description' placeholder='Description' />
          </FormField>
          <FormField>
            <Field type='text' name='city' placeholder='City' />
          </FormField>
          <FormField>
            <Field type='text' name='venue' placeholder='Venue' />
          </FormField>
          <FormField>
            <Field type='date' name='date' placeholder='Date' />
          </FormField>
          <Button type='submit' floated='right' positive content='Submit' />
          <Button floated='right' content='Cancel' onClick={onCancel} />
        </Form>
      </Formik>
    </Segment>
  );
};

export default withRouter(EventForm);
