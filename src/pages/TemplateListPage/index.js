import React from "react";
import { Chip, Button, DialogTitle } from "@material-ui/core";
import { Link } from "@reach/router";
import Table from "../../components/Table";
import Fetch from "../../components/Fetch";

const TemplateListPage = () => {
  return (
    <Fetch url={"/templates"}>
      {({ loading, error, data: { data: templates } = {} }) => {
        if (!templates) return null;
        return (
          <div id="template-list-page">
            <DialogTitle>Templates</DialogTitle>
            <div id="templates-table" className="templates">
              {!loading ? (
                <Table
                  columns={[
                    { key: "name", title: "Name" },
                    { key: "syntax", title: "Syntax" },
                    { key: "locales", title: "Locales" },
                    { key: "action", title: "Action" }
                  ]}
                  data={templates.map(i => ({
                    name: (
                      <div className="name">
                        {i.title}
                        <p>{i.description}</p>
                      </div>
                    ),
                    syntax: <Chip label={i.syntax} />,
                    locales: i.locales.map((i, k) => (
                      <Chip
                        color="primary"
                        label={i.code}
                        key={k}
                        variant="outlined"
                      />
                    )),
                    action: (
                      <Link to={`/edit/${i.id}`}>
                        <Button size="small" variant="text" color="primary">
                          Edit&nbsp;Template
                        </Button>
                      </Link>
                    )
                  }))}
                />
              ) : (
                "Loading..."
              )}
            </div>
          </div>
        );
      }}
    </Fetch>
  );
};

export default TemplateListPage;
