import * as React from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
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

const validationSchema: Yup.SchemaOf<ChatFormValues> = Yup.object({
  comment: Yup.string().required('cannot submit empty comment'),
});

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
    <Formik
      initialValues={initialValues}
      onSubmit={onFormSubmitHandler}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form className='ui form'>
          <FormTextArea
            disabled={formik.isSubmitting}
            name='comment'
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formik.isValid && formik.handleSubmit();
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
