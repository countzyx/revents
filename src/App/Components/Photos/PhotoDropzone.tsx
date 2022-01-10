/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { Header, Icon } from 'semantic-ui-react';
import styles from './PhotoDropzone.module.css';

type Props = {
  onPhotoDrop: (newFiles: File[]) => void;
};

const PhotoDropzone: React.FC<Props> = (props) => {
  const { onPhotoDrop } = props;
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      onPhotoDrop(acceptedFiles);
    },
    [onPhotoDrop],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.dropzone} {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Icon name='optin monster' size='huge' />
      ) : (
        <Icon name='cloud upload' size='huge' />
      )}
      <Header content='Drop image here' />
    </div>
  );
};

export default PhotoDropzone;
