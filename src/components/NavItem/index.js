import React from "react";
import * as Reach from "@reach/router";

const NavItem = ({ to, children }) => (
  <Reach.Match path={`${to}/*`}>
    {({ match }) => (
      <Reach.Link to={to} className={match ? "active" : ""}>
        {children}
      </Reach.Link>
    )}
  </Reach.Match>
);

export default NavItem;
