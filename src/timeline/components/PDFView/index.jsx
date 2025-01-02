import PDFObject from "./PDFObject";
import PDFViewer from "./PDFViewer";
import React from "react";
import styled from "styled-components";

const MultiplePdfViewer = ({ fileURL }) => {
  // console.log("fileURL", fileURL);
  const isMobile = window.innerWidth < 700;
  if (!fileURL?.length) {
    return;
  }
  return (
    <Wrapper>
      {fileURL.map((pdf, index) => {
        return isMobile ? (
          <PDFViewer key={index} fileURL={pdf} />
        ) : (
          <PDFObject key={index} {...pdf} />
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  direction: rtl;
  button {
    height: 28px;
    border-radius: 2px;
    font-size: 14px;
    padding: 0 8px;
    min-width: fit-content;
    flex-grow: 1;
  }
`;

export default MultiplePdfViewer;
