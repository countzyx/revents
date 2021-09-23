import * as React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../authSlice';
import { AuthProviderId } from '../../../App/Firebase/FirebaseAuthService';
import MyAccountErrorUser from './MyAccountErrorUser';
import MyAccountFacebookUser from './MyAccountFacebookUser';
import MyAccountGoogleUser from './MyAccountGoogleUser';
import MyAccountPasswordUser from './MyAccountPasswordUser';

const LoginProviderComponentMap: { [key: string]: React.FC } = {
  [AuthProviderId.FACEBOOK]: MyAccountFacebookUser,
  [AuthProviderId.GOOGLE]: MyAccountGoogleUser,
  [AuthProviderId.PASSWORD]: MyAccountPasswordUser, // Need to force to be a string key
};

const MyAccountPage: React.FC = () => {
  const userInfo = useAppSelector(selectAuthUserInfo);
  const SettingsComponent =
    (userInfo && LoginProviderComponentMap[userInfo.providerId]) || MyAccountErrorUser;
  return (
    <Segment>
      <Header content='My Account Settings ' dividing size='large' />
      <SettingsComponent />
    </Segment>
  );
};

export default MyAccountPage;
