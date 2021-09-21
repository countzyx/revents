import * as React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Label } from 'semantic-ui-react';
import ModalWrapper from '../../App/Components/Modals/ModalWrapper';
import FormTextInput from '../../App/Components/Form/FormTextInput';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { clearError, registerUser, selectError, selectIsAuth } from './authSlice';
import { UserRegistrationInfo } from '../../App/Shared/Types';
import { closeModal } from '../../App/Components/Modals/modalsSlice';

type RegistrationFormValues = UserRegistrationInfo & {
  passwordConfirmation: string;
};

const initialValues: RegistrationFormValues = {
  displayName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
};

const validationSchema: Yup.SchemaOf<RegistrationFormValues> = Yup.object({
  displayName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  passwordConfirmation: Yup.string()
    .required()
    .test(
      'passwords-match',
      'Passwords must match',
      (value, testContext) => testContext.parent.password === value,
    ),
});

const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const authError = useAppSelector(selectError);
  const isAuth = useAppSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  React.useEffect(() => {
    isAuth && dispatch(closeModal());
  }, [dispatch, isAuth]);

  return (
    <ModalWrapper size='mini' header='Register with Re-vents'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (formValues, actions) => {
          await dispatch(registerUser(formValues));
          actions.setSubmitting(false);
        }}
      >
        {(formik) => (
          <Form className='ui form'>
            <FormTextInput name='displayName' placeholder='Display Name' />
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
            <FormTextInput
              autoComplete='current-password'
              name='passwordConfirmation'
              placeholder='Confirm Password'
              type='password'
            />
            {authError && (
              <Label basic color='red' content={authError?.message} style={{ marginBottom: 10 }} />
            )}
            <Button
              color='teal'
              content='Register'
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

export default RegisterForm;
