import React from "react";
import CodeMirror from "react-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/addon/lint/lint.css";
import "./styles.scss";

import FieldInput from "../FieldInput";

export default function FieldCode(props) {
  const { input, mode, options, ...rest } = props;

  return (
    <FieldInput
      {...rest}
      component={CodeMirror}
      input={{
        ...input,
        value:
          typeof input.value === "object"
            ? JSON.stringify(input.value, null, 2)
            : input.value,
        onChange: value => value !== input.value && input.onChange(value)
      }}
      options={
        options || {
          mode: mode || {
            name: "application/json",
            json: true
          },
          placeholder: props.placeholder,
          readOnly: false,
          lineNumbers: true,
          indentUnit: 2,
          tabSize: 2,
          smartIndent: true,
          gutters: ["CodeMirror-lint-markers"],
          lint: true,
          theme: "material",
          setSize: {
            height: 600
          }
        }
      }
    />
  );
}
