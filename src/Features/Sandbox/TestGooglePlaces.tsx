import * as React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { GoogleMapsApiKey } from '../../App/Shared/Constants';

const TestGooglePlaces: React.FC = () => {
  if (!GoogleMapsApiKey) {
    return <div>No Google API Key found</div>;
  }

  return <GooglePlacesAutocomplete apiKey={GoogleMapsApiKey} />;
};

export default TestGooglePlaces;
