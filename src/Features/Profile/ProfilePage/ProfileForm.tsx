import { Form, Formik } from 'formik';
import * as React from 'react';
import { Button, FormTextArea } from 'semantic-ui-react';
import * as Yup from 'yup';
import FormTextInput from '../../../App/Components/Form/FormTextInput';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectProfileCurrentProfile } from '../profilesSlice';

type ProfileFormValues = {
  description?: string;
  displayName: string;
};

const validationSchema: Yup.SchemaOf<ProfileFormValues> = Yup.object({
  description: Yup.string(),
  displayName: Yup.string().required(),
});

const ProfileForm: React.FC = () => {
  const currentProfile = useAppSelector(selectProfileCurrentProfile);

  if (!currentProfile) return <div />;

  const { description, displayName } = currentProfile;
  const initialValues: ProfileFormValues = { displayName: displayName || '', description };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      {(formik) => (
        <Form className='ui form'>
          <FormTextInput name='displayName' placeholder='Display Name' />
          <FormTextArea name='description' placeholder='Description' />
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
