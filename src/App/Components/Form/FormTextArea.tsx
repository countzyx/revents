/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, useField } from 'formik';
import { FormField, Label } from 'semantic-ui-react';

type OwnProps = {
  label?: string;
  rows?: number;
};

type Props = OwnProps & FieldHookConfig<string>;

const FormTextArea: React.FC<Props> = (props: Props) => {
  const [field, meta] = useField(props);
  const { id, label, name, placeholder, rows } = props;

  return (
    <FormField error={meta.touched && !!meta.error}>
      {label ? <label htmlFor={id || name}>{label}</label> : null}
      <textarea {...field} placeholder={placeholder} rows={rows} />
      {meta.touched && !!meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
};

FormTextArea.defaultProps = { label: undefined, rows: undefined };

export default FormTextArea;
