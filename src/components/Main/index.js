import React from "react";

import Aside from "../Aside";

import "./styles.scss";

const App = ({ children }) => (
  <div className="main">
    <main>
      <Aside />
      <div className="content">{children}</div>
    </main>
  </div>
);
export default App;
