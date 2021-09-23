import { Form, Formik } from 'formik';
import * as React from 'react';
import * as Yup from 'yup';
import { Button, Header, Label } from 'semantic-ui-react';
import FormTextInput from '../../../App/Components/Form/FormTextInput';

type ChangePasswordFormValues = {
  newPassword: string;
  newPasswordConfirmation: string;
};

const initialValues: ChangePasswordFormValues = {
  newPassword: '',
  newPasswordConfirmation: '',
};

const validationSchema: Yup.SchemaOf<ChangePasswordFormValues> = Yup.object({
  newPassword: Yup.string().required(),
  newPasswordConfirmation: Yup.string()
    .required()
    .test(
      'passwords-match',
      'Passwords must match',
      (value, testContext) => testContext.parent.newPassword === value,
    ),
});

const MyAccountPasswordUser: React.FC = () => {
  const [error] = React.useState<Error | undefined>(undefined);

  return (
    <div>
      <Header color='teal' content='Change Password' sub />
      <p>Use this form to change your password.</p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (formValues, actions) => {
          actions.setSubmitting(false);
        }}
      >
        {(formik) => (
          <Form className='ui form'>
            <FormTextInput
              autoComplete='current-password'
              name='newPassword'
              placeholder='Password'
              type='password'
            />
            <FormTextInput
              autoComplete='current-password'
              name='newPasswordConfirmation'
              placeholder='Confirm Password'
              type='password'
            />
            {error && (
              <Label basic color='red' content={error?.message} style={{ marginBottom: '1rem' }} />
            )}
            <Button
              content='Update Password'
              disabled={!(formik.isValid && formik.dirty && !formik.isSubmitting)}
              fluid
              loading={formik.isSubmitting}
              positive
              size='large'
              type='submit'
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyAccountPasswordUser;
