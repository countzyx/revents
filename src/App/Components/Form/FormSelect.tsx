/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { FieldHookConfig, useField } from 'formik';
import { FormField, Label, Select, SelectProps } from 'semantic-ui-react';

type OwnProps = {
  label?: string;
};

type Props = OwnProps & SelectProps & FieldHookConfig<string>;

const FormSelect: React.FC<Props> = (props: Props) => {
  const [field, meta, helpers] = useField(props);
  const { id, label, name } = props;
  const selectProps: SelectProps = props;

  return (
    <FormField error={meta.touched && !!meta.error}>
      {label ? <label htmlFor={id || name}>{label}</label> : null}
      <Select
        {...selectProps}
        {...field}
        clearable
        onBlur={() => helpers.setTouched(true)}
        onChange={(_0, data) => helpers.setValue(data.value ? data.value.toString() : '')}
      />
      {meta.touched && !!meta.error ? (
        <Label basic color='red'>
          {meta.error}
        </Label>
      ) : null}
    </FormField>
  );
};

FormSelect.defaultProps = { label: undefined };

export default FormSelect;
