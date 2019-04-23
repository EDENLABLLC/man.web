import React from "react";
import NavItem from "../NavItem";

import "./styles.scss";

export default function Nav() {
  return (
    <nav className="nav">
      <ul>
        <NavItem to="/">Templates</NavItem>
        <li>
          <a
            href="http://docs.man2.apiary.io"
            rel="noopener noreferrer"
            target="__blank"
          >
            Documentation
          </a>
        </li>
      </ul>
    </nav>
  );
}
