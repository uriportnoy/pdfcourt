import DialogBtn from "../../common/DialogBtn";
import styles from "../../styles.module.scss";
import React from "react";

const PDFObject = ({ label, url }) => {
  return (
    <DialogBtn title={label} dialogClassName={styles.dialogPdf}>
      <object data={url} type="application/pdf" width="100%" height="100%">
        <p>
          It appears you don't have a PDF plugin for this browser. No biggie...
          you can <a href={url}>click here to download the PDF file.</a>
        </p>
      </object>
    </DialogBtn>
  );
};

export default PDFObject;
