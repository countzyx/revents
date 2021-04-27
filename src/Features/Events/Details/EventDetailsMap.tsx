/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { Icon, Segment } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';
import styles from './EventDetailsMap.module.css';
import { GoogleMapsApiKey } from '../../../App/Shared/Constants';

type Props = {
  center?: GoogleMapReact.Coords;
  key?: string;
  zoom?: number;
};

type MarkerCoords = { lat?: number | undefined; lng?: number | undefined };

const EventDetailsMap: React.FC<Props> = (props: Props) => {
  const { center, key, zoom } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Marker = (latLng: MarkerCoords) => {
    const { lat, lng } = latLng;
    return <Icon color='red' name='marker' size='big' lat={lat} lng={lng} />;
  };

  if (!key) {
    return <div>Need valid Google Maps API key</div>;
  }

  return (
    <Segment attached='bottom' className={styles.MapSegment}>
      <div className={styles.Map}>
        <GoogleMapReact bootstrapURLKeys={{ key }} center={center} zoom={zoom}>
          <Marker {...center} />
        </GoogleMapReact>
      </div>
    </Segment>
  );
};

EventDetailsMap.defaultProps = {
  center: {
    lat: 40.66,
    lng: -73.97,
  },
  key: GoogleMapsApiKey,
  zoom: 16,
};

export default EventDetailsMap;
