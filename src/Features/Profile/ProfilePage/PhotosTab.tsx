import * as React from 'react';
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import { selectAuthUserInfo } from '../../Auth/authSlice';
import {
  readUserProfilePhotos,
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
  // const photos = [
  //   {
  //     photoUrl:
  //       'https://firebasestorage.googleapis.com/v0/b/udemy-revents-countzyx.appspot.com/o/obTbXWhaNIMXiqimSQoHiutBdMB3%2Fimages%2Fcky8q2mqa00003e6d88jm2ob0.png?alt=media&token=d461d232-b8fa-43e3-82ae-452fbabebff0',
  //     name: 'cky8q2mqa00003e6d88jm2ob0.png',
  //     id: 'utiWeeTOgWnLRmUNAbU2',
  //   },
  // ];
  const isCurrentUser = currentUser && currentUser.uid === selectedProfile?.id;
  const userId = selectedProfile?.id || currentUser?.uid;

  // userId && dispatch(readUserProfilePhotos(userId));
  React.useEffect(() => {
    if (!userId) return undefined;

    dispatch(readUserProfilePhotos(userId));
    return undefined;
  }, [dispatch, userId]);

  //  console.log(`photos - ${JSON.stringify(photos)}`);

  const onPhotoUploadFinishHandler = React.useCallback(() => {
    setIsEditable(false);
  }, [setIsEditable]);

  const onToggleEditHandler = () => setIsEditable(!isEditable);

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
              onClick={onToggleEditHandler}
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
                <Card key={p.id}>
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
