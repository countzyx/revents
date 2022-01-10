import * as React from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import cuid from 'cuid';
import { toast } from 'react-toastify';
import { PhotoData, PhotoPreview } from '../../Shared/Types';
import PhotoCropper from './PhotoCropper';
import PhotoDropzone from './PhotoDropzone';
import styles from './PhotoUpload.module.css';
import { getErrorStringForCatch, getFileExtension } from '../../Shared/Utils';
import { createFileInFirebase, readDownloadUrl } from '../../Firebase/FirebaseStorageService';
import { updateUserProfilePhotoInFirestore } from '../../Firebase/FirestoreUserProfileService';

type Props = {
  onFinish: () => void;
};

const PhotoUpload: React.FC<Props> = (props) => {
  const { onFinish } = props;
  const [photoFile, setPhotoFile] = React.useState<PhotoPreview>();
  const [image, setImage] = React.useState<Blob>();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

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

  const clearState = () => {
    setImage(undefined);
    setIsUploading(false);
    setPhotoFile(undefined);
  };

  const onCloseHandler = () => {
    clearState();
    onFinish();
  };

  const onPhotoUploadHandler = () => {
    // I don't like this logic here; should refactor into a Redux slice or something.
    setIsUploading(true);
    if (!photoFile) return;
    const uploadFileName = `${cuid()}.${getFileExtension(photoFile.file.name || 'jpg')}`;
    if (!image) return;
    const uploadTask = createFileInFirebase(uploadFileName, image);
    uploadTask.on('state_changed', {
      next: (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload "${uploadFileName}" - ${progress} done`);
      },
      error: (error) => {
        toast.error(error.message);
        console.warn(error.message);
      },
      complete: async () => {
        try {
          const photoUrl = await readDownloadUrl(uploadTask.snapshot.ref);
          console.log(`uploaded to ${photoUrl}`);
          try {
            const photoData: PhotoData = {
              name: uploadFileName,
              photoUrl,
            };
            await updateUserProfilePhotoInFirestore(photoData);
          } catch (err) {
            toast.error(getErrorStringForCatch(err));
          }
        } catch (err) {
          toast.error(getErrorStringForCatch(err));
        } finally {
          clearState();
          onFinish();
        }
      },
    });
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
                loading={isUploading}
                onClick={onPhotoUploadHandler}
                positive
              />
              <Button
                className={styles.button}
                disabled={isUploading}
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
