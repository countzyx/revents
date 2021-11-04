import * as React from 'react';
import { Grid, Header } from 'semantic-ui-react';
import { PhotoPreview } from '../../Shared/Types';
import PhotoDropzone from './PhotoDropzone';

const PhotoUpload: React.FC = () => {
  const [files, setFiles] = React.useState<PhotoPreview[]>([]);

  const onPhotoUploadHandler = (newPhotos: File[]) => {
    const photoPreviews = newPhotos.map<PhotoPreview>((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles(photoPreviews);
    console.log(files);
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
      </Grid.Column>
      <Grid.Column width={1} />
      <Grid.Column width={4}>
        <Header color='teal' content='Step 3 - Preview & Upload' sub />
      </Grid.Column>
    </Grid>
  );
};

export default PhotoUpload;
