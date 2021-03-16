/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, FieldInputProps, useField, useFormikContext } from 'formik';
import { FormField, Label } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isValid, parse } from 'date-fns';
import { kDateFormat } from '../../Shared/Constants';

type OwnProps = {
  label?: string;
};

type Props = OwnProps & Omit<ReactDatePickerProps, 'onChange'> & FieldHookConfig<string>;

const FormDate: React.FC<Props> = (props: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const { id, label, name, placeholder } = props;

  const getDate = (f: FieldInputProps<string>): Date | null => {
    const { value } = f;
    let date: Date | null = null;

    if (value) {
      date = new Date(value);
      if (!isValid(date)) {
        date = parse(value, kDateFormat, new Date());
        if (!isValid(date)) {
          date = null;
        }
      }
    }

    return date;
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
        selected={getDate(field)}
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
