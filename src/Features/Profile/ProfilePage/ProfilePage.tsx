import * as React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  fetchUserProfile,
  selectProfileCurrentProfile,
  selectProfileError,
  selectProfileIsLoading,
} from '../profilesSlice';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

type ProfilePageParams = {
  id: string;
};

const ProfilePage: React.FC = () => {
  const userId = useParams<ProfilePageParams>().id;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectAuthUserInfo);
  const currentProfile = useAppSelector(selectProfileCurrentProfile);
  const error = useAppSelector(selectProfileError);
  const isLoading = useAppSelector(selectProfileIsLoading);

  React.useEffect(() => {
    if (!userId) return undefined;

    const unsubscribed = fetchUserProfile(dispatch, userId);
    return unsubscribed;
  }, [dispatch, userId]);

  if (!userId && currentUser) return <Redirect to={{ pathname: `/profile/${currentUser.uid}` }} />;

  if (isLoading) return <LoadingComponent />;

  if (error) return <Redirect to={{ pathname: '/error', state: { error } }} />;

  if (!currentProfile) {
    return <h1>No profile found</h1>;
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={currentProfile} />
        <ProfileContent profile={currentProfile} />
      </Grid.Column>
    </Grid>
  );
};

export default ProfilePage;
