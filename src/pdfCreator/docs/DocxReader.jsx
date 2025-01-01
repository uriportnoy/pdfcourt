import React, { memo } from "react";
import { FileUpload } from "primereact/fileupload";
import { readFile } from "./utils";
import { cleanStorage } from "../utils/storage";

const DocxReader = ({ onLoad }) => {
  const onFileUpload = (event) => {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      cleanStorage();
      const fileResult = readFile(e.target.result);
      const resultObj = fileResult.reduce((acc, item) => {
        const id = Math.random().toString(16).slice(2);
        acc[id] = { ...item, id };
        return acc;
      }, {});
      console.log(resultObj);
      onLoad(resultObj);
    };

    reader.onerror = (err) => console.error(err);
    reader.readAsBinaryString(file);
  };

  return (
    <FileUpload
      mode="basic"
      name="demo[]"
      customUpload
      accept=".docx"
      maxFileSize={1000000}
      onSelect={onFileUpload}
    />
  );
};

export default memo(DocxReader);
