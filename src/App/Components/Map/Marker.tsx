import * as React from 'react';
import type { Coords } from 'google-map-react';
import { Icon } from 'semantic-ui-react';

type Props = {
  latLng: Coords | undefined;
};

const Marker: React.FC<Props> = (props) => {
  const { latLng } = props;
  if (!latLng) return <div />;

  const { lat, lng } = latLng;
  return <Icon color='red' name='marker' size='big' lat={lat} lng={lng} />;
};

export default Marker;
