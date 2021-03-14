/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, useField } from 'formik';
import { FormField, Label } from 'semantic-ui-react';

type OwnProps = {
  label?: string;
};

type Props = OwnProps & React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldHookConfig<string>;

const FormTextArea: React.FC<Props> = (props: Props) => {
  const [field, meta] = useField(props);
  const { id, label, name } = props;
  const textAreaProps: React.TextareaHTMLAttributes<HTMLTextAreaElement> = props;

  return (
    <FormField error={meta.touched && !!meta.error}>
      {label ? <label htmlFor={id || name}>{label}</label> : null}
      <textarea {...textAreaProps} {...field} />
      {meta.touched && !!meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
};

FormTextArea.defaultProps = { label: undefined };

export default FormTextArea;
