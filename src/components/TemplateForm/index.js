import React from "react";
import { Field, Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import {
  MdAddCircle,
  MdKeyboardBackspace,
  MdRemoveCircle
} from "react-icons/md";
import { Radio, TextField } from "final-form-material-ui";
import { Button, Grid } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import FieldCode from "../Fields/FieldCode";
import TemplatePreview from "../TemplatePreview";
import "react-tabs/style/react-tabs.css";

import "./styles.scss";

const syntaxToCodemirrorMode = {
  mustache: {
    name: "handlebars",
    base: "text/html",
    htmlMode: true,
    matchClosing: true,
    alignCDATA: true
  },
  elixir: {
    name: "elixir",
    base: "text/html",
    htmlMode: true,
    matchClosing: true,
    alignCDATA: true
  },
  markdown: "markdown"
};

const transformSyntaxToCodemirrorMode = syntax =>
  syntaxToCodemirrorMode[syntax];

const placeholderTemplate = {
  markdown: `# {{l10n.hello}}, {{name}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `,
  mustache: `
      <html>
        <body>
          <h1>{{l10n.hello}}, {{name}}</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </body>
      </html>
    `
};

export default function TemplateForm(props) {
  const { isEdit, navigate, initialValues, onSubmit, onDelete } = props;
  const isChanged = nextValues => {
    return JSON.stringify(initialValues) !== JSON.stringify(nextValues);
  };
  return (
    <Form
      onSubmit={onSubmit}
      mutators={arrayMutators}
      initialValues={initialValues}
      render={({ handleSubmit, values, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <div className="form-edit-title">
              <MdKeyboardBackspace
                size={22}
                className="form-edit-back"
                onClick={() => navigate("../../")}
              />
              <Field
                name="title"
                component={TextField}
                fullWidth
                placeholder="eg. Sign up email template"
              />
            </div>
          </Box>
          <div className="columns">
            <div>
              <Box mb={2}>
                <div className="tabs-wrapper">
                  <div className="syntax">
                    <label>
                      <Field
                        name="syntax"
                        component={Radio}
                        type="radio"
                        value="markdown"
                      />{" "}
                      Markdown
                    </label>
                    <label>
                      <Field
                        name="syntax"
                        component={Radio}
                        type="radio"
                        value="mustache"
                      />{" "}
                      Mustache
                    </label>
                    <label>
                      <Field
                        name="syntax"
                        component={Radio}
                        type="radio"
                        value="iex"
                      />{" "}
                      Iex
                    </label>
                  </div>
                  <Tabs>
                    <TabList>
                      <Tab>Template</Tab>
                      <Tab>Locales</Tab>
                      <Tab>Description</Tab>
                    </TabList>
                    <TabPanel>
                      <Field
                        name="body"
                        placeholder={placeholderTemplate[values.syntax]}
                        component={FieldCode}
                        mode={transformSyntaxToCodemirrorMode(values.syntax)}
                      />
                    </TabPanel>
                    <TabPanel>
                      <FieldArray name="locales">
                        {({ fields }) => (
                          <div style={{ position: "relative" }}>
                            {fields.map((name, index) => (
                              <div key={index}>
                                <Grid
                                  container
                                  spacing={8}
                                  alignItems="flex-end"
                                  style={{ marginBottom: 10 }}
                                >
                                  <Grid item>
                                    <Field
                                      key={name}
                                      name={`${name}.code`}
                                      placeholder="uk_UA"
                                      component={TextField}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <div onClick={() => fields.remove(index)}>
                                      <MdRemoveCircle size={22} />
                                    </div>
                                  </Grid>
                                </Grid>
                                <Field
                                  name={`${name}.params`}
                                  placeholder={`Type in locale object
                                    {
                                      "hello": "Hello"
                                    }`}
                                  component={FieldCode}
                                  parse={value => {
                                    try {
                                      if (typeof value !== "string") {
                                        return value;
                                      }
                                      return JSON.parse(value);
                                    } catch (e) {}
                                  }}
                                />
                              </div>
                            ))}
                            <Grid
                              container
                              alignItems="center"
                              spacing={8}
                              style={{
                                position: "absolute",
                                top: 10,
                                right: 0,
                                width: 120
                              }}
                              onClick={() => fields.push()}
                            >
                              <Grid item style={{ lineHeight: 0 }}>
                                Add new locale
                              </Grid>
                              <Grid item style={{ lineHeight: 0 }}>
                                <MdAddCircle size={22} />
                              </Grid>
                            </Grid>
                          </div>
                        )}
                      </FieldArray>
                    </TabPanel>
                    <TabPanel>
                      <Field
                        name="description"
                        rows={3}
                        component={TextField}
                        fullWidth
                        multiline
                        placeholder="eg. This template will be sent to user's email after success sign up to confirm email"
                      />
                    </TabPanel>
                  </Tabs>
                </div>
              </Box>
            </div>
            <div>
              <Box mb={2}>
                <TemplatePreview template={values} />
              </Box>
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item>
              {isEdit && (
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!isChanged(values)}
                >
                  {submitting
                    ? "Saving..."
                    : !isChanged(values)
                    ? "Saved"
                    : "Save Template"}
                </Button>
              )}
              {!isEdit && (
                <Button type="submit" color="primary" variant="contained">
                  Create Template
                </Button>
              )}
            </Grid>
            <Grid ml={2} item>
              {isEdit && (
                <Button
                  id="delete-template-button"
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={onDelete}
                >
                  Delete Template
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
}
