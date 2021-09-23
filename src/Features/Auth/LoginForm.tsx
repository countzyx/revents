import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Divider, Label } from 'semantic-ui-react';
import ModalWrapper from '../../App/Components/Modals/ModalWrapper';
import FormTextInput from '../../App/Components/Form/FormTextInput';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { clearError, selectAuthError, selectAuthIsAuth, signInPasswordUser } from './authSlice';
import { UserCredentials } from '../../App/Shared/Types';
import { closeModal } from '../../App/Components/Modals/modalsSlice';
import SocialLogin from './SocialLogin';

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
  const authError = useAppSelector(selectAuthError);
  const isAuth = useAppSelector(selectAuthIsAuth);

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  React.useEffect(() => {
    isAuth && dispatch(closeModal());
  }, [dispatch, isAuth]);

  return (
    <ModalWrapper header='Sign in to Re-vents' size='mini'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (formValues, actions) => {
          await dispatch(signInPasswordUser(formValues));
          actions.setSubmitting(false);
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
            {authError && (
              <Label
                basic
                color='red'
                content={authError?.message}
                style={{ marginBottom: '1rem' }}
              />
            )}
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
      <Divider horizontal>Or</Divider>
      <SocialLogin />
    </ModalWrapper>
  );
};

export default LoginForm;
