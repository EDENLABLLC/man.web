import React from "react";
import { chain } from "lodash";

import classnames from "classnames";
import { MdFullscreen, MdFullscreenExit, MdRemoveRedEye } from "react-icons/md";
import mustache from "mustache";
import { markdown } from "markdown";
import IFrame from "../IFrame";
import FullScreen from "../FullScreen";
import FieldCode from "../Fields/FieldCode";

import "./styles.scss";

const getVariableNames = template =>
  mustache
    .parse(template)
    .filter(v => ["name", "#", "&"].indexOf(v[0]) > -1)
    .map(v => v[1]);

export default class TemplatePreview extends React.Component {
  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.reduce = this.reduce.bind(this);
    this.toggleTestVariables = this.toggleTestVariables.bind(this);
    this.onChangeTestVariables = this.onChangeTestVariables.bind(this);

    let testData;
    if (this.props.template.syntax === "mustache") {
      const testVariables = getVariableNames(props.template.body);
      const filteredLocalization = testVariables
        .filter(key => !key.match(/^l10n/g))
        .reduce(
          (prev, key) => ({
            ...prev,
            [key]: ""
          }),
          {}
        );
      testData = JSON.stringify(filteredLocalization, null, 2);
    }

    this.state = {
      fullScreen: false,
      openTestVariables: false,
      testData
    };
  }
  onChangeTestVariables(json) {
    this.setState({
      testData: json
    });
  }
  expand() {
    this.setState({
      fullScreen: true
    });
  }
  reduce() {
    this.setState({
      fullScreen: false
    });
  }
  toggleTestVariables() {
    this.setState({
      openTestVariables: !this.state.openTestVariables
    });
  }
  get testData() {
    try {
      return JSON.parse(this.state.testData);
    } catch (e) {
      return {};
    }
  }
  get isVariablesAvailable() {
    return this.props.template.syntax === "mustache";
  }
  get html() {
    let html = "";
    const { template, locale } = this.props;
    if (!template.body) return html;
    const params = chain(template.locales)
      .find({ code: locale })
      .get("params")
      .value();
    try {
      switch (template.syntax) {
        case "iex":
        case "mustache":
          html = mustache.render(template.body || "", {
            l10n: typeof params === "string" ? JSON.parse(params) : params,
            ...this.testData
          });
          break;
        case "markdown":
          html = markdown.toHTML(template.body || "");
          break;
        default: {
        }
      }
    } catch (e) {
      console.warn("error while render template", e);
    }
    return html;
  }
  render() {
    return (
      <FullScreen active={this.state.fullScreen}>
        <div
          className={classnames(
            "wrap",
            this.state.fullScreen && "wrap--fullscreen"
          )}
        >
          <div className="header">
            <div className="header__cell header__cell--icon">
              <MdRemoveRedEye size={22} />
            </div>
            <div className="header__cell header__cell--title">Preview</div>
            {this.isVariablesAvailable && (
              <a
                className={classnames(
                  "header__cell",
                  this.state.openTestVariables && "header__cell--active"
                )}
                onClick={this.toggleTestVariables}
              >
                Edit test variables
              </a>
            )}
            <a
              className={classnames(
                "header__cell",
                "header__cell--icon",
                "header__cell--icon--fullScreen"
              )}
              onClick={this.state.fullScreen ? this.reduce : this.expand}
            >
              {this.state.fullScreen ? (
                <MdFullscreenExit size={22} />
              ) : (
                <MdFullscreen size={22} />
              )}
            </a>
          </div>
          <div className="preview-main">
            <IFrame className="preview" content={this.html} />
            {this.state.openTestVariables && this.isVariablesAvailable && (
              <div className="sidebar">
                <FieldCode
                  theme="float"
                  input={{
                    onChange: this.onChangeTestVariables,
                    value: this.state.testData
                  }}
                  meta={{}}
                  fullHeight
                  options={{
                    mode: {
                      name: "application/json",
                      json: true
                    },
                    smartIndent: false,
                    lineNumbers: true,
                    gutters: [],
                    lint: false
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </FullScreen>
    );
  }
}
