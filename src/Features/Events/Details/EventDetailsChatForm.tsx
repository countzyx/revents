import { Form, Formik, FormikHelpers } from 'formik';
import * as React from 'react';
import FormTextArea from '../../../App/Components/Form/FormTextArea';
import { useAppDispatch } from '../../../App/Store/hooks';
import { addEventChatCommentAsCurrentUser } from '../eventsSlice';

type Props = {
  eventId: string;
};

type ChatFormValues = {
  comment: string;
};

const initialValues: ChatFormValues = {
  comment: '',
};

const EventDetailsChatForm: React.FC<Props> = (props) => {
  const { eventId } = props;
  const dispatch = useAppDispatch();

  const onFormSubmitHandler = async (
    formValues: ChatFormValues,
    formikHelpers: FormikHelpers<ChatFormValues>,
  ) => {
    const { comment } = formValues;
    const { resetForm, setSubmitting } = formikHelpers;
    await dispatch(addEventChatCommentAsCurrentUser({ eventId, comment }));
    setSubmitting(false);
    resetForm();
    // displaying errors in parent
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onFormSubmitHandler}>
      {(formik) => (
        <Form className='ui form'>
          <FormTextArea
            disabled={formik.isSubmitting}
            name='comment'
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                formik.handleSubmit();
              }
            }}
            placeholder='enter comment here'
            rows={2}
          />
        </Form>
      )}
    </Formik>
  );
};

export default EventDetailsChatForm;
