import * as React from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  deletePhotoFromCurrentProfile,
  fetchUserProfilePhotos,
  selectProfileIsLoadingPhotos,
  selectProfileIsUpdating,
  selectProfilePhotos,
  selectProfileSelectedProfile,
  updateUserProfilePhoto,
} from '../profilesSlice';
import PhotoUpload from '../../../App/Components/Photos/PhotoUpload';
import { PhotoData } from '../../../App/Shared/Types';

const PhotosTab: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isEditable, setIsEditable] = React.useState(false);
  const currentUser = useAppSelector(selectAuthUserInfo);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const isLoadingPhotos = useAppSelector(selectProfileIsLoadingPhotos);
  const isUpdatingProfile = useAppSelector(selectProfileIsUpdating);
  const photos = useAppSelector(selectProfilePhotos);
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;
  const userId = selectedProfile?.id || currentUser?.uid;

  React.useEffect(() => {
    if (!userId) return undefined;

    const unsubscribe = fetchUserProfilePhotos(dispatch, userId);
    return unsubscribe;
  }, [dispatch, userId]);

  const onDeleteProfilePhoto = (photoData: PhotoData) => {
    const { photoURL } = photoData;
    if (isCurrentUser && selectedProfile?.photoURL === photoURL) return;
    dispatch(deletePhotoFromCurrentProfile(photoData));
  };

  const onUpdateProfilePhoto = (photoData: PhotoData) => {
    dispatch(updateUserProfilePhoto(photoData));
  };

  const onPhotoUploadFinishHandler = React.useCallback(() => {
    setIsEditable(false);
  }, [setIsEditable]);

  if (!selectedProfile) return <div />;

  const { displayName } = selectedProfile;

  return (
    <Tab.Pane loading={isLoadingPhotos}>
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
                <Card key={p.photoName}>
                  <Image src={p.photoURL} />
                  <Button.Group fluid widths={2}>
                    <Button
                      basic
                      color='green'
                      disabled={selectedProfile.photoURL === p.photoURL}
                      icon='user'
                      loading={isUpdatingProfile}
                      onClick={() => onUpdateProfilePhoto(p)}
                    />
                    <Button
                      basic
                      color='red'
                      disabled={selectedProfile.photoURL === p.photoURL}
                      icon='trash'
                      onClick={() => onDeleteProfilePhoto(p)}
                    />
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
