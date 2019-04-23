import React from "react";
import classnames from "classnames";

import "./styles.scss";

export default class FullScreen extends React.Component {
  static defaultProps = {
    active: false
  };
  componentDidMount(props) {
    return this.updateHtml(props);
  }
  componentWillReceiveProps(props) {
    return this.updateHtml(props);
  }
  updateHtml(props = {}) {
    if (props.active) {
      document.documentElement.classList.add("html_no_scroll");
    } else {
      document.documentElement.classList.remove("html_no_scroll");
    }
  }
  render() {
    const { active, children } = this.props;
    return (
      <div className={classnames("fullscreen", active && "fullscreen--active")}>
        {children}
      </div>
    );
  }
}
