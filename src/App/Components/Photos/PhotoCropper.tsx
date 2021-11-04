import * as React from 'react';
import Cropper from 'react-cropper';
import type { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import styles from './PhotoCropper.module.css';

type Props = {
  onPhotoCrop: (newImage: Blob) => void;
  photoPreviewUrl: string;
};

const PhotoCropper: React.FC<Props> = (props) => {
  const { onPhotoCrop, photoPreviewUrl } = props;
  const cropperRef = React.useRef<ReactCropperElement>(null);
  const onCrop = () => {
    const imageElement = cropperRef?.current;
    if (!imageElement) return;

    const cropper = imageElement?.cropper;
    if (!cropper) return;

    cropper.getCroppedCanvas().toBlob((blob) => {
      blob && onPhotoCrop(blob);
    });
  };

  return (
    <Cropper
      className={styles.cropper}
      src={photoPreviewUrl}
      // Cropper.js options
      crop={onCrop}
      cropBoxMovable
      cropBoxResizable
      dragMode='move'
      initialAspectRatio={1}
      guides={false}
      preview='#image-preview'
      ref={cropperRef}
      scalable
      viewMode={1}
    />
  );
};

export default PhotoCropper;
