import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../App/Store/hooks';
import { selectAuthUserInfo, signOutUser } from '../Auth/authSlice';
import { fetchCurrentUserProfile, selectProfileCurrentProfile } from '../Profile/profilesSlice';

const SignedInMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectAuthUserInfo);
  const currentProfile = useAppSelector(selectProfileCurrentProfile);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userInfo) return undefined;

    const { uid } = userInfo;
    const unsubscribed = fetchCurrentUserProfile(dispatch, uid);
    return unsubscribed;
  }, [userInfo, dispatch]);

  const onSignOut = async () => {
    await dispatch(signOutUser());
    navigate('/');
  };

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={currentProfile?.photoURL || '/assets/user.png'} />
      <Dropdown
        pointing='top left'
        text={currentProfile?.displayName || currentProfile?.email || 'Guest'}
      >
        <Dropdown.Menu>
          <Dropdown.Item as={Link} icon='plus' text='Create Event' to='/createEvent' />
          <Dropdown.Item as={Link} icon='settings' text='My Account' to='/myAccount' />
          <Dropdown.Item
            as={Link}
            icon='user'
            text='My Profile'
            to={userInfo ? `/profile/${userInfo?.uid}` : '/error'}
          />
          <Dropdown.Item icon='power' onClick={onSignOut} text='Sign out' />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
