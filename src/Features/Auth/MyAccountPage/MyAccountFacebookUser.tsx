import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';

const MyAccountFacebookUser: React.FC = () => (
  <div>
    <Header color='teal' content='Facebook Account' sub />
    <p>Please visit Facebook to update your account.</p>
    <Button
      as={Link}
      color='facebook'
      content='Go to Facebook'
      icon='facebook'
      to='https://www.facebook.com/settings/?tab=account'
    />
  </div>
);

export default MyAccountFacebookUser;
