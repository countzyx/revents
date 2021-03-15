/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, useField, useFormikContext } from 'formik';
import { FormField, Label } from 'semantic-ui-react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { kDateFormat } from '../../Shared/Constants';

type OwnProps = {
  label?: string;
};

type Props = OwnProps & Omit<ReactDatePickerProps, 'onChange'> & FieldHookConfig<string>;

const FormDate: React.FC<Props> = (props: Props) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const { id, label, name, placeholder } = props;
  const onChange = (data: Date | [Date, Date] | null) => {
    let value: Date | null = null;
    if (data instanceof Array) {
      [value] = data;
    } else {
      value = data;
    }
    setFieldValue(field.name, value);
  };

  return (
    <FormField error={meta.touched && !!meta.error}>
      {label ? <label htmlFor={id || name}>{label}</label> : null}
      <DatePicker
        {...field}
        dateFormat={kDateFormat}
        onChange={onChange}
        placeholderText={placeholder}
        selected={(field.value && new Date(field.value)) || null}
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
