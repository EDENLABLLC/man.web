import React from "react";
import Cookie from "js-cookie";
import { Router } from "@reach/router";
import TemplateListPage from "./pages/TemplateListPage";
import TemplateEditPage from "./pages/TemplateEditPage";
import TemplateCreatePage from "./pages/TemplateCreatePage";
import NotFound from "./pages/NotFoundPage";

import Main from "./components/Main";
import ForceRedirect from "./components/ForceRedirect";

import env from "./env";

const App = () => {
  const meta = Cookie.getJSON("meta");
  if (!meta) {
    return (
      <ForceRedirect
        to={`${env.REACT_APP_OAUTH_URL}?client_id=${
          env.REACT_APP_CLIENT_ID
        }&redirect_uri=${env.REACT_APP_OAUTH_REDIRECT_URI}`}
      />
    );
  }
  return (
    <Main>
      <Router>
        <TemplateListPage path="/" />
        <TemplateEditPage path="edit/:id" />
        <TemplateCreatePage path="create" />
        <NotFound default />
      </Router>
    </Main>
  );
};

export default App;
