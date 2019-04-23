import React from "react";
import { Link } from "@reach/router";
import { MdAdd } from "react-icons/md";
import Nav from "../Nav";

import "./styles.scss";

export default function Aside({ active }) {
  return (
    <aside className="aside">
      <Link className="logo" to="/">
        {"{ mán }"}
      </Link>

      <Link to="/create" className="add">
        <MdAdd size={22} /> <span>Create</span>
      </Link>

      <Nav isOpen={active} />
    </aside>
  );
}
