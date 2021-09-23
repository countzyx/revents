import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const MyAccountGoogleUser: React.FC = () => (
  <div>
    <Header color='teal' content='Google Account' sub />
    <p>Please visit Google to update your account.</p>
    <Button
      as={Link}
      color='google plus'
      content='Go to Google'
      icon='google'
      to='https://myaccount.google.com/'
    />
  </div>
);

export default MyAccountGoogleUser;
