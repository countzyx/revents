import { Form, Formik } from 'formik';
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import FormTextInput from '../../../App/Components/Form/FormTextInput';
import FormTextArea from '../../../App/Components/Form/FormTextArea';
import { updateUserProfileInFirestore } from '../../../App/Firebase/FirestoreUserProfileService';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectProfileCurrentProfile } from '../profilesSlice';

type ProfileFormValues = {
  description?: string;
  displayName: string;
};

const validationSchema: Yup.ObjectSchema<ProfileFormValues> = Yup.object({
  description: Yup.string(),
  displayName: Yup.string().required(),
});

const ProfileForm: React.FC = () => {
  const currentProfile = useAppSelector(selectProfileCurrentProfile);

  if (!currentProfile) return <div />;

  const { description, displayName } = currentProfile;
  const initialValues: ProfileFormValues = {
    displayName: displayName || '',
    description: description || '',
  };

  const onFormSubmitHandler = async (
    formValues: ProfileFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    try {
      await updateUserProfileInFirestore({ ...currentProfile, ...formValues });
    } catch (anyErr) {
      const err = anyErr as Error;
      if (err) {
        toast.error(err.message);
      } else {
        toast.error(String(anyErr));
      }
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onFormSubmitHandler(values, setSubmitting);
      }}
    >
      {(formik) => (
        <Form className='ui form'>
          <FormTextInput name='displayName' placeholder='Display Name' type='text' />
          <FormTextArea name='description' placeholder='Description' rows={3} type='text' />
          <Button
            content='Update profile'
            disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
            floated='right'
            loading={formik.isSubmitting}
            positive
            size='large'
            type='submit'
          />
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
