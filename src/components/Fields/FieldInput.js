import React from "react";
import { TextField } from "final-form-material-ui";

let Field = ({
  component = TextField,
  input,
  meta,
  children,
  // not pass to the input component
  ...props
}) =>
  React.createElement(
    component,
    {
      ...input,
      active: meta.active,
      ...props
    },
    children
  );

const FieldInput = props => <Field {...props} />;

export default FieldInput;
