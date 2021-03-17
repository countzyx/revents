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

  const onSignOut = () => {
    dispatch(signOutUser());
    history.push('/');
  };

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={currentUser?.photoUrl || '/assets/user.png'} />
      <Dropdown pointing='top left' text={currentUser?.email || 'Guest'}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to='/createEvent' text='Create Event' icon='plus' />
          <Dropdown.Item text='My Profile' icon='user' />
          <Dropdown.Item icon='power' onClick={onSignOut} text='Sign out' />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
