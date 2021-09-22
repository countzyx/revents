import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { signOutUser } from '../Auth/authSlice';

const SignedInMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { currentUser } = auth;
  const history = useHistory();

  const onSignOut = async () => {
    await dispatch(signOutUser());
    history.push('/');
  };

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={currentUser?.photoURL || '/assets/user.png'} />
      <Dropdown
        pointing='top left'
        text={currentUser?.displayName || currentUser?.email || 'Guest'}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={Link} icon='plus' text='Create Event' to='/createEvent' />
          <Dropdown.Item as={Link} icon='settings' text='My Account' to='/myAccount' />
          <Dropdown.Item icon='user' text='My Profile' />
          <Dropdown.Item icon='power' onClick={onSignOut} text='Sign out' />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
