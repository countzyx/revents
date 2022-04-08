/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as React from 'react';
import { Button, Confirm, Header, Segment } from 'semantic-ui-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import type { EventInfo, PlacesInfo } from '../../../App/Shared/Types';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { fetchSingleEvent, selectEventsError, selectEventsIsLoading } from '../eventsSlice';
import FormPlacesInput from '../../../App/Components/Form/FormPlacesInput';
import FormSelect from '../../../App/Components/Form/FormSelect';
import FormTextArea from '../../../App/Components/Form/FormTextArea';
import FormTextInput from '../../../App/Components/Form/FormTextInput';
import CategoryData from '../../../App/Api/CategoryData';
import FormDate from '../../../App/Components/Form/FormDate';
import { kStandardDateTimeFormat } from '../../../App/Shared/Constants';
import { getDateFromString, getErrorStringForCatch } from '../../../App/Shared/Utils';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import {
  createEventInFirestore,
  toggleCancelEventInFirestore,
  updateEventInFirestore,
} from '../../../App/Firebase/FirestoreEventService';

type EventFormValues = {
  title: string;
  category: string;
  description: string;
  city: PlacesInfo;
  venue: PlacesInfo;
  date: string;
  isCancelled: boolean;
};

const initialValues: EventFormValues = {
  title: '',
  category: '',
  description: '',
  city: {
    address: '',
    latLng: undefined,
  },
  venue: {
    address: '',
    latLng: undefined,
  },
  date: '',
  isCancelled: false,
};

const latLngSchema: Yup.SchemaOf<google.maps.LatLngLiteral> = Yup.object({
  lat: Yup.number().required(),
  lng: Yup.number().required(),
});

const placesInfoSchema: Yup.SchemaOf<PlacesInfo> = Yup.object({
  address: Yup.string().required(),
  latLng: latLngSchema.required(),
});

const validationSchema: Yup.SchemaOf<EventFormValues> = Yup.object({
  title: Yup.string().required(),
  category: Yup.string().required(),
  city: placesInfoSchema.required(),
  description: Yup.string().required(),
  date: Yup.string().required(),
  venue: placesInfoSchema.required(),
  isCancelled: Yup.boolean().required(),
});

const blankEvent: EventInfo = {
  id: '',
  category: '',
  city: {
    address: '',
    latLng: undefined,
  },
  date: '',
  description: '',
  hostPhotoURL: '',
  hostUid: '',
  hostedBy: '',
  title: '',
  venue: {
    address: '',
    latLng: undefined,
  },
  attendees: [],
  attendeeIds: [],
  isCancelled: false,
};

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const selectedEvent = useAppSelector((state) =>
    state.events.events.find((e) => e.id === eventId),
  );
  const eventsError = useAppSelector(selectEventsError);
  const isLoadingEvents = useAppSelector(selectEventsIsLoading);
  const dispatch = useAppDispatch();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [loadingCancelChange, setLoadingCancelChange] = React.useState(false);

  React.useEffect(() => {
    if (!eventId) return undefined;

    const unsubscribed = fetchSingleEvent(dispatch, eventId);
    return unsubscribed;
  }, [dispatch, eventId]);

  const onFormSubmitHandler = async (
    formValues: EventFormValues,
    formikHelpers: FormikHelpers<EventFormValues>,
  ) => {
    const { setSubmitting } = formikHelpers;
    try {
      if (selectedEvent) {
        const updatedEvent: EventInfo = {
          ...blankEvent,
          ...formValues,
          date: format(getDateFromString(formValues.date)!, kStandardDateTimeFormat), // FormDate is inconsistent with date string, need to fix
        };
        await updateEventInFirestore(updatedEvent);
        setSubmitting(false);
        navigate(`/events/${updatedEvent.id}`);
      } else {
        const newEvent: EventInfo = {
          ...blankEvent,
          ...formValues,
          date: format(getDateFromString(formValues.date)!, kStandardDateTimeFormat), // FormDate is inconsistent with date string, need to fix
        };
        await createEventInFirestore(newEvent);
        setSubmitting(false);
        navigate(`/events/${newEvent.id}`);
      }
    } catch (err) {
      const errorMessage = getErrorStringForCatch(err);
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  const onConfirmCancel = async () => {
    setConfirmOpen(false);
    if (!selectedEvent) return;

    setLoadingCancelChange(true);
    try {
      await toggleCancelEventInFirestore(selectedEvent);
    } catch (err) {
      const errorMessage = getErrorStringForCatch(err);
      toast.error(errorMessage);
    } finally {
      setLoadingCancelChange(false);
    }
  };

  const onExit = () => {
    if (selectedEvent) {
      navigate(`/events/${selectedEvent.id}`);
    } else {
      navigate('/events');
    }
  };

  if (isLoadingEvents) return <LoadingComponent />;

  if (eventsError) return <Navigate to='/error' state={eventsError} />;

  return (
    <Segment clearing>
      <Formik
        initialValues={selectedEvent || initialValues}
        validationSchema={validationSchema}
        onSubmit={onFormSubmitHandler}
      >
        {(formik) => (
          <Form className='ui form'>
            <Header sub color='teal' content='Event Details' />
            <FormTextInput type='text' name='title' placeholder='Event Title' />
            <FormSelect name='category' placeholder='Event Category' options={CategoryData} />
            <FormTextArea type='text' name='description' placeholder='Description' rows={3} />
            <Header sub color='teal' content='Location Details' />
            <FormPlacesInput
              name='city'
              placeholder='City'
              searchOptions={{ types: ['(cities)'] }}
            />
            <FormPlacesInput
              disabled={formik.values.city.latLng === undefined}
              name='venue'
              placeholder='Venue'
              searchOptions={{
                location:
                  formik.values.city.latLng && new google.maps.LatLng(formik.values.city.latLng),
                radius: 10000,
                types: ['establishment'],
              }}
            />
            <FormDate name='date' placeholder='Date' />
            {selectedEvent && (
              <Button
                color={selectedEvent.isCancelled ? 'green' : 'red'}
                content={selectedEvent.isCancelled ? 'Reactivate event' : 'Cancel event'}
                floated='left'
                loading={loadingCancelChange}
                onClick={() => setConfirmOpen(true)}
                type='button'
              />
            )}
            <Button
              content='Submit'
              disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
              floated='right'
              loading={formik.isSubmitting}
              positive
              type='submit'
            />
            <Button
              content='Exit'
              disabled={formik.isSubmitting}
              floated='right'
              onClick={onExit}
            />
          </Form>
        )}
      </Formik>
      <Confirm
        content={
          selectedEvent?.isCancelled
            ? 'This will reactivate the event - are you sure?'
            : 'This will cancel the event - are you sure?'
        }
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => onConfirmCancel()}
        open={confirmOpen}
      />
    </Segment>
  );
};

export default EventForm;
