import * as React from 'react';
import _ from 'lodash';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useHistory, useParams, withRouter } from 'react-router-dom';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import type { EventInfo } from '../../../App/Shared/Types';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { createEvent, updateEvent } from '../eventsSlice';
import FormSelect from '../../../App/Components/Form/FormSelect';
import FormTextArea from '../../../App/Components/Form/FormTextArea';
import FormTextInput from '../../../App/Components/Form/FormTextInput';
import CategoryData from '../../../App/Api/CategoryData';
import FormDate from '../../../App/Components/Form/FormDate';
import kDateFormat from '../../../App/Shared/Constants';

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

const validationSchema: Yup.SchemaOf<EventFormValues> = Yup.object({
  title: Yup.string().required(),
  category: Yup.string().required(),
  description: Yup.string().required(),
  city: Yup.string().required(),
  venue: Yup.string().required(),
  date: Yup.string().required(),
});

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
  const initialValues: EventFormValues = selectedEvent || defaultValues;

  const onFormSubmitHandler = (formValues: EventFormValues) => {
    if (selectedEvent) {
      const updatedEvent: EventInfo = {
        ...blankEvent,
        ...formValues,
        date: format(new Date(formValues.date), kDateFormat), // FormDate sets value as Date instead of string, fooling Typescript
      };
      dispatch(updateEvent(updatedEvent));
      history.push(`/events/${updatedEvent.id}`);
    } else {
      const newEvent: EventInfo = {
        ...blankEvent,
        id: _.uniqueId(),
        hostedBy: 'Bobbie',
        hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        ...formValues,
        date: format(new Date(formValues.date), kDateFormat), // FormDate sets value as Date instead of string, fooling Typescript
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            onFormSubmitHandler(values);
            setSubmitting(false);
          }, 400);
        }}
      >
        {(formik) => (
          <Form className='ui form'>
            <Header sub color='teal' content='Event Details' />
            <FormTextInput type='text' name='title' placeholder='Event Title' />
            <FormSelect name='category' placeholder='Event Category' options={CategoryData} />
            <FormTextArea type='text' name='description' placeholder='Description' rows={3} />
            <Header sub color='teal' content='Location Details' />
            <FormTextInput type='text' name='city' placeholder='City' />
            <FormTextInput type='text' name='venue' placeholder='Venue' />
            <FormDate name='date' placeholder='Date' />
            <Button
              content='Submit'
              disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
              floated='right'
              loading={formik.isSubmitting}
              positive
              type='submit'
            />
            <Button
              content='Cancel'
              disabled={formik.isSubmitting}
              floated='right'
              onClick={onCancel}
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
};

export default withRouter(EventForm);
