import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'semantic-ui-react';
import ModalWrapper from '../../App/Components/Modals/ModalWrapper';
import FormTextInput from '../../App/Components/Form/FormTextInput';
import { useAppDispatch } from '../../App/Store/hooks';
import { signInUser } from './authSlice';
import { UserCredentials } from '../../App/Shared/Types';
import { closeModal } from '../../App/Components/Modals/modalsSlice';

type LoginFormValues = UserCredentials;

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const validationSchema: Yup.SchemaOf<LoginFormValues> = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <ModalWrapper size='mini' header='Sign in to Re-vents'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (formValues, actions) => {
          await dispatch(signInUser(formValues));
          actions.setSubmitting(false);
          dispatch(closeModal());
        }}
      >
        {(formik) => (
          <Form className='ui form'>
            <FormTextInput
              autoComplete='username'
              name='email'
              placeholder='Email Address'
              type='email'
            />
            <FormTextInput
              autoComplete='current-password'
              name='password'
              placeholder='Password'
              type='password'
            />
            <Button
              color='teal'
              content='Login'
              disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
              fluid
              loading={formik.isSubmitting}
              size='large'
              type='submit'
            />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};

export default LoginForm;
