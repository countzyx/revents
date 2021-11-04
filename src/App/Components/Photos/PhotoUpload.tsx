import * as React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import { PhotoPreview } from '../../Shared/Types';
import PhotoCropper from './PhotoCropper';
import PhotoDropzone from './PhotoDropzone';
import styles from './PhotoUpload.module.css';

const PhotoUpload: React.FC = () => {
  const [photoFile, setPhotoFile] = React.useState<PhotoPreview>();
  const [image, setImage] = React.useState<Blob>();

  const onPhotoUploadHandler = (newPhotos: File[]) => {
    const photoPreviews = newPhotos.map<PhotoPreview>((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotoFile(photoPreviews[0]);
    console.log(photoFile);
  };

  const onPhotoCropHandler = (newImage: Blob) => {
    setImage(newImage);
    console.log(image);
  };

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color='teal' content='Step 1 - Add Photo' sub />
        <PhotoDropzone onPhotoUpload={onPhotoUploadHandler} />
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
              <Button className={styles.button} icon='check' positive />
              <Button className={styles.button} icon='close' />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUpload;
