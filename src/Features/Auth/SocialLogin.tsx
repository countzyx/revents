import * as React from 'react';
import { Button } from 'semantic-ui-react';

const SocialLogin: React.FC = () => (
  <>
    <Button
      color='facebook'
      content='Login with Facebook'
      fluid
      icon='facebook'
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

export default SocialLogin;
