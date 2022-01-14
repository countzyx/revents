import * as React from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  fetchUserProfilePhotos,
  selectProfilePhotos,
  selectProfileSelectedProfile,
} from '../profilesSlice';
import PhotoUpload from '../../../App/Components/Photos/PhotoUpload';

const PhotosTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = React.useState(false);
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const photos = useAppSelector(selectProfilePhotos);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;
  const userId = selectedProfile?.id || currentUser?.uid;

  React.useEffect(() => {
    if (!userId) return undefined;

    const unsubscribe = fetchUserProfilePhotos(dispatch, userId);
    return unsubscribe;
  }, [dispatch, userId]);

  const onPhotoUploadFinishHandler = React.useCallback(() => {
    setIsEditable(false);
  }, [setIsEditable]);

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
            <PhotoUpload onFinish={onPhotoUploadFinishHandler} />
          ) : (
            <Card.Group itemsPerRow={5}>
              {photos.map((p) => (
                <Card key={p.name}>
                  <Image src={p.photoUrl} />
                  <Button.Group fluid widths={2}>
                    <Button basic color='green' content='Main' />
                    <Button basic color='red' icon='trash' />
                  </Button.Group>
                </Card>
              ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default PhotosTab;
