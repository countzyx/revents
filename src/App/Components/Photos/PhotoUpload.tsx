/* eslint-disable no-console */
import * as React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import cuid from 'cuid';
import { toast } from 'react-toastify';
import type { PhotoPreview } from '../../Shared/Types';
import PhotoCropper from './PhotoCropper';
import PhotoDropzone from './PhotoDropzone';
import styles from './PhotoUpload.module.css';
import { getFileExtension } from '../../Shared/Utils';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectProfileIsUploadingPhoto,
  selectProfilePhotosError,
  uploadPhotoToCurrentProfile,
} from '../../../Features/Profile/profilesSlice';
import { selectAuthUserInfo } from '../../../Features/Auth/authSlice';

type Props = {
  onFinish: () => void;
};

const PhotoUpload: React.FC<Props> = (props) => {
  const { onFinish } = props;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectAuthUserInfo);
  const photosError = useAppSelector(selectProfilePhotosError);
  const isUploadingPhoto = useAppSelector(selectProfileIsUploadingPhoto);
  const [photoFile, setPhotoFile] = React.useState<PhotoPreview>();
  const [image, setImage] = React.useState<Blob>();

  React.useEffect(() => {
    if (!photosError) return;
    toast.error(photosError?.message);
  }, [photosError]);

  const onPhotoDropHandler = (newPhotos: File[]) => {
    const photoPreviews = newPhotos.map<PhotoPreview>((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotoFile(photoPreviews[0]);
  };

  const onPhotoCropHandler = (newImage: Blob) => {
    setImage(newImage);
    console.log(image);
  };

  const clearLocalState = () => {
    setImage(undefined);
    setPhotoFile(undefined);
  };

  const onCloseHandler = () => {
    clearLocalState();
    onFinish();
  };

  const onPhotoUploadHandler = () => {
    if (!photoFile) return;
    const uploadFileName = `${cuid()}.${getFileExtension(photoFile.file.name || 'jpg')}`;
    if (!image) return;
    const updateProfilePhoto = !!currentUser?.photoURL;
    uploadPhotoToCurrentProfile(dispatch, uploadFileName, image, updateProfilePhoto);
    onCloseHandler();
  };

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color='teal' content='Step 1 - Add Photo' sub />
        <PhotoDropzone onPhotoDrop={onPhotoDropHandler} />
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' content='Step 2 - Resize' sub />
        {photoFile && (
          <PhotoCropper onPhotoCrop={onPhotoCropHandler} photoPreviewUrl={photoFile.previewUrl} />
        )}
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' content='Step 3 - Preview & Upload' sub />
        {photoFile && (
          <>
            <div className={styles['image-preview']} id='image-preview' />
            <Button.Group>
              <Button
                className={styles.button}
                icon='check'
                loading={isUploadingPhoto}
                onClick={onPhotoUploadHandler}
                positive
              />
              <Button
                className={styles.button}
                disabled={isUploadingPhoto}
                icon='close'
                onClick={onCloseHandler}
              />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUpload;
