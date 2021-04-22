import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import { GoogleMapsApiKey } from '../../App/Shared/Constants';
import styles from './TestGoogleMaps.module.css';

type Props = {
  center?: GoogleMapReact.Coords;
  key?: string;
  zoom?: number;
};

const TestGoogleMaps: React.FC<Props> = (props: Props) => {
  const { center, key, zoom } = props;

  if (!key) {
    return <div>Need valid Google Maps API key</div>;
  }

  return (
    <div className={styles.Map}>
      <GoogleMapReact bootstrapURLKeys={{ key }} defaultCenter={center} defaultZoom={zoom} />
    </div>
  );
};

TestGoogleMaps.defaultProps = {
  center: {
    lat: 40.66,
    lng: -73.97,
  },
  key: GoogleMapsApiKey,
  zoom: 11,
};

export default TestGoogleMaps;
