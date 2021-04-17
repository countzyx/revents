/* eslint-disable react/jsx-props-no-spreading */
// Formik API is designed around props spreading into components; no spreading would make this a lot harder to maintain
import * as React from 'react';
import { FieldHookConfig, useField } from 'formik';
import { FormField, Label, List, Segment } from 'semantic-ui-react';
import PlacesAutoComplete, {
  geocodeByAddress,
  getLatLng,
  PropTypes,
} from 'react-places-autocomplete';
import type { PlacesInfo } from '../../Shared/Types';

type OwnProps = {
  label?: string;
  searchOptions?: PropTypes['searchOptions'];
};

type Props = OwnProps & React.InputHTMLAttributes<HTMLInputElement> & FieldHookConfig<PlacesInfo>;

const FormPlacesInput: React.FC<Props> = (props: Props) => {
  const [field, meta, helpers] = useField(props);
  const { searchOptions, ...otherProps } = props; // Need to remove searchOptions from the props added to
  const { id, label, name } = otherProps;
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = otherProps;

  const handleBlur = (event: React.FocusEvent) => {
    field.onBlur(event);
    if (!field.value.latLng) {
      helpers.setValue({ address: '', latLng: undefined });
    }
  };

  const handleChange = (address: string) => {
    helpers.setValue({ address, latLng: undefined });
  };

  const handleSelect = (address: string) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => helpers.setValue({ address, latLng }))
      .catch((error) => helpers.setError(error));
  };

  return (
    <PlacesAutoComplete
      value={field.value.address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <FormField error={meta.touched && !!meta.error}>
          {label ? <label htmlFor={id || name}>{label}</label> : null}
          <input
            {...getInputProps({ ...inputProps, name: field.name, onBlur: handleBlur })}
            value={field.value.address}
          />
          {meta.touched && !!meta.error ? (
            <Label basic color='red'>
              {typeof meta.error === 'object' ? `${field.name} is a required field` : meta.error}
            </Label>
          ) : null}
          {suggestions?.length > 0 && (
            <Segment
              loading={loading}
              style={{ marginTop: 0, position: 'absolute', width: '100%', zIndex: 1000 }}
            >
              <List selection>
                {suggestions.map((suggestion) => (
                  // The key is actually returned in the spread, but the linter can't figure that out, so we have to disable jsx-key
                  // eslint-disable-next-line react/jsx-key
                  <List.Item
                    {...{
                      ...getSuggestionItemProps(suggestion),
                      key: suggestion.placeId,
                    }}
                  >
                    <List.Header>{suggestion.formattedSuggestion.mainText}</List.Header>
                    <List.Description>
                      {suggestion.formattedSuggestion.secondaryText}
                    </List.Description>
                  </List.Item>
                ))}
              </List>
            </Segment>
          )}
        </FormField>
      )}
    </PlacesAutoComplete>
  );
};

FormPlacesInput.defaultProps = { label: undefined, searchOptions: undefined };

export default FormPlacesInput;
