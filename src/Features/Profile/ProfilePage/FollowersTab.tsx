import * as React from 'react';
import { Card, Grid, Header, Tab } from 'semantic-ui-react';
import { kUnknownUserImageUrl } from '../../../App/Shared/Constants';
import { UserBasicInfo } from '../../../App/Shared/Types';
import { useAppSelector } from '../../../App/Store/hooks';
// import { selectAuthUserInfo } from '../../Auth/authSlice';
import { selectProfileSelectedProfile } from '../profilesSlice';
import ProfileCard from './ProfileCard';

const FollowersTab: React.FC = () => {
  //  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  //  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;

  if (!selectedProfile || !selectedProfile.displayName) return <div />;

  // reusing profile to check the layout. will replace with follower data from Firestore.
  const profileInfo: UserBasicInfo = {
    displayName: selectedProfile.displayName,
    id: selectedProfile.id,
    photoURL: selectedProfile.photoURL || kUnknownUserImageUrl,
  };
  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Followers' floated='left' icon='user' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            <ProfileCard profileInfo={profileInfo} />
            <ProfileCard profileInfo={profileInfo} />
            <ProfileCard profileInfo={profileInfo} />
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default FollowersTab;
