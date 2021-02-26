import * as React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';
import SignedInMenu from './SignedInMenu';
import SignedOutMenu from './SignedOutMenu';

const NavBar: React.FC = () => {
  const [isAuthedState, setIsAuthedState] = React.useState(false);
  const history = useHistory();

  const onSignIn = React.useCallback(() => {
    setIsAuthedState(true);
  }, [setIsAuthedState]);

  const onSignOut = React.useCallback(() => {
    setIsAuthedState(false);
    history.push('/');
  }, [setIsAuthedState]);

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} to='/' exact header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: '15px' }} />
          Re-vents
        </Menu.Item>
        <Menu.Item as={NavLink} to='/events' name='Events' />
        {isAuthedState && (
          <Menu.Item as={NavLink} to='/createEvent'>
            <Button positive inverted content='Create Event' />
          </Menu.Item>
        )}
        {isAuthedState ? <SignedInMenu onSignOut={onSignOut} /> : <SignedOutMenu onSignIn={onSignIn} />}
      </Container>
    </Menu>
  );
};

export default NavBar;
