import React from "react";
import { unstable_Box as Box } from "@material-ui/core/Box";
import { Button, GridListTileBar } from "@material-ui/core";

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div id="not-found-page">
        <GridListTileBar title="Page Not Found" />
        <Box mt={5}>
          Requested page not found. Maybe you are looking for{" "}
          <Button variant="text" to="/">
            list of templates
          </Button>
          .
        </Box>
      </div>
    );
  }
}
