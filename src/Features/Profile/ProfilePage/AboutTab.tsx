import * as React from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import { selectProfileSelectedProfile } from '../profilesSlice';
import ProfileForm from './ProfileForm';

const AboutTab: React.FC = () => {
  const [isEditable, setIsEditable] = React.useState(false);
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;

  if (!selectedProfile) return <div />;

  const { createdAt, description, displayName } = selectedProfile;

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header content={`About ${displayName}`} floated='left' icon='user' />
          {isCurrentUser && (
            <Button
              basic
              content={isEditable ? 'Cancel' : 'Edit'}
              onClick={() => setIsEditable(!isEditable)}
              floated='right'
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isEditable ? (
            <ProfileForm />
          ) : (
            <>
              <div style={{ marginBottom: 10 }}>Member since: {createdAt}</div>
              <div>{description}</div>
            </>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default AboutTab;
