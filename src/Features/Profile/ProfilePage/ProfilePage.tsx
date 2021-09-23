import * as React from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

const ProfilePage: React.FC = () => (
  <Grid>
    <Grid.Column width={16}>
      <ProfileHeader />
      <ProfileContent />
    </Grid.Column>
  </Grid>
);

export default ProfilePage;
