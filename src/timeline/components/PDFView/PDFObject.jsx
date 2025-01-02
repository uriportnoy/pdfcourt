import DialogBtn from "../../common/DialogBtn";
import styles from "../../styles.module.scss";
import React from "react";

const PDFObject = ({ label, url }) => {
  const onClick = () => {
    if (!url.includes("pdf")) {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { preventShow: true };
    }
  };

  return (
    <DialogBtn
      title={label}
      dialogClassName={styles.dialogPdf}
      onClick={onClick}
    >
      <File url={url} />
    </DialogBtn>
  );
};

function File({ url }) {
  return (
    <object data={url} type="application/pdf" width="100%" height="100%">
      <p>
        It appears you don't have a PDF plugin for this browser. No biggie...
        you can <a href={url}>click here to download the PDF file.</a>
      </p>
    </object>
  );
}

export default PDFObject;
