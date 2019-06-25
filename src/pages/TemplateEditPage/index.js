import React from "react";
import TemplateForm from "../../components/TemplateForm";
import Fetch from "../../components/Fetch";

const TemplateEditPage = ({ id, navigate }) => (
  <Fetch url={`/templates/${id}`}>
    {({ loading, error, data: { data: template } = {}, fetch }) => {
      if (!template) return null;
      const onSubmit = async values => {
        await fetch(`/templates/${id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({ template: values })
        });
        fetch();
      };
      const onDelete = async () => {
        await fetch(`/templates/${id}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json"
          }
        });
        await navigate("../../");
      };
      return (
        <TemplateForm
          id={id}
          initialValues={template}
          onSubmit={onSubmit}
          onDelete={onDelete}
          isEdit
          navigate={navigate}
        />
      );
    }}
  </Fetch>
);

export default TemplateEditPage;
