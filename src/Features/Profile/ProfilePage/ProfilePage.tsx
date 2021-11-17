import * as React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../App/Layout/LoadingComponent';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  fetchSelectedUserProfile,
  selectProfileError,
  selectProfileIsLoading,
  selectProfileSelectedProfile,
} from '../profilesSlice';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const error = useAppSelector(selectProfileError);
  const isLoading = useAppSelector(selectProfileIsLoading);

  React.useEffect(() => {
    if (!userId) return undefined;

    const unsubscribed = fetchSelectedUserProfile(dispatch, userId);
    return unsubscribed;
  }, [dispatch, userId]);

  if (!userId && !currentUser) return <Navigate to='/' />;

  if (!userId && currentUser) return <Navigate to={`/profile/${currentUser.uid}`} />;

  if (isLoading) return <LoadingComponent />;

  if (error) return <Navigate to='/error' state={error} />;

  if (!selectedProfile) {
    return <h1>No profile found</h1>;
  }

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};

export default ProfilePage;
