/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
// This API relies on spreading helper function outputs; this linter rule makes the code less maintainable.
// This is a sandbox component, so console logging is needed for easy developer validation of state
import * as React from 'react';
import PlacesAutoComplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const TestGooglePlaces: React.FC = () => {
  const [addressState, setAddressState] = React.useState('');
  const handleChange = (address: string) => {
    setAddressState(address);
  };

  const handleSelect = (address: string, _: string) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error));
    setAddressState(address);
  };

  return (
    <PlacesAutoComplete value={addressState} onChange={handleChange} onSelect={handleSelect}>
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
          />
          <div className='autocomplete-dropdown-container'>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                // The key is actually returned in the spread, but the linter can't figure that out, so we have to disable jsx-key
                // eslint-disable-next-line react/jsx-key
                <div
                  {...{
                    ...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    }),
                    key: suggestion.placeId,
                  }}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutoComplete>
  );
};

export default TestGooglePlaces;
