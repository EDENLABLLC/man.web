import React from "react";
import TemplateForm from "../../components/TemplateForm";

const TemplateCreatePage = ({ id, navigate }) => {
  const onSubmit = async values => {
    await fetch(`/templates`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ template: values })
    });
    await navigate("../");
  };
  return (
    <>
      <TemplateForm id={id} navigate={navigate} onSubmit={onSubmit} />
    </>
  );
};

export default TemplateCreatePage;
