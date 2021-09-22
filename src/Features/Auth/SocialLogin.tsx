import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { useAppDispatch } from '../../App/Store/hooks';
import { signInUserWithSocialMedia } from './authSlice';

const SocialLogin: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Button
        color='facebook'
        content='Login with Facebook'
        fluid
        icon='facebook'
        onClick={() => dispatch(signInUserWithSocialMedia('facebook.com'))}
        style={{ marginBottom: '1rem' }}
      />
      <Button
        color='google plus'
        content='Login with Google'
        fluid
        icon='google'
        style={{ marginBottom: '1rem' }}
      />
    </>
  );
};

export default SocialLogin;
