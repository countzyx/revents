/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, FieldInputProps, useField, useFormikContext } from 'formik';
import { FormField, Label } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { kDateFormat } from '../../Shared/Constants';
import { getDateFromString } from '../../Shared/Utils';

type OwnProps = {
  label?: string;
};

type Props = OwnProps & Omit<ReactDatePickerProps, 'onChange'> & FieldHookConfig<string>;

const FormDate: React.FC<Props> = (props: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const { id, label, name, placeholder } = props;

  const getFieldDate = (f: FieldInputProps<string>): Date | null => {
    const { value } = f;
    return getDateFromString(value) || null;
  };

  return (
    <FormField error={meta.touched && !!meta.error}>
      {label ? <label htmlFor={id || name}>{label}</label> : null}
      <DatePicker
        {...field}
        dateFormat={kDateFormat}
        onChange={(data) => {
          let value: Date | null = null;
          if (data instanceof Array) {
            [value] = data;
          } else {
            value = data;
          }
          setFieldValue(field.name, value);
        }}
        placeholderText={placeholder}
        selected={getFieldDate(field)}
        showTimeSelect
        timeCaption='time'
        timeFormat='HH:mm'
      />
      {meta.touched && !!meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
};

FormDate.defaultProps = { label: undefined };

export default FormDate;
