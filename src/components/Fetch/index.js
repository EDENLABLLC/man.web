import React from "react";
import Fetch from "react-fetch-component";

const Data = ({ url, ...rest }) => (
  <Fetch
    url={url}
    {...rest}
    options={{
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }}
  />
);
export default Data;
