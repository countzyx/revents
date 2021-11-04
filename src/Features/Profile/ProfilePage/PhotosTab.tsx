import * as React from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import { selectProfileSelectedProfile } from '../profilesSlice';
import PhotoUpload from '../../../App/Components/Photos/PhotoUpload';

const PhotosTab: React.FC = () => {
  const [isEditable, setIsEditable] = React.useState(false);
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;

  if (!selectedProfile) return <div />;

  const { displayName } = selectedProfile;

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header content={`${displayName} Photos`} floated='left' icon='images' />
          {isCurrentUser && (
            <Button
              basic
              content={isEditable ? 'Cancel' : 'Add Photo'}
              onClick={() => setIsEditable(!isEditable)}
              floated='right'
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isEditable ? (
            <PhotoUpload />
          ) : (
            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src='/assets/user.png' />
                <Button.Group fluid widths={2}>
                  <Button basic color='green' content='Main' />
                  <Button basic color='red' icon='trash' />
                </Button.Group>
              </Card>
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default PhotosTab;
