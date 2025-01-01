import DialogBtn from "../common/DialogBtn";
import styles from "../styles.module.scss";
import * as pdfjs from "pdfjs-dist/webpack";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "pdfjs-dist/web/pdf_viewer.css";
import Center from "../../Center";
import SharePDF from "./SharePDF";
import { Paginator } from "primereact/paginator";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const forceDownload = async (url, label) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch PDF file");
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${label || "document"}.pdf`; // Filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};

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
const PDFViewer = ({ fileURL }) => {
  const { label, url } = fileURL;
  const canvasRef = useRef(null);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const containerRef = useRef(null); // Ref for the container to scroll to top
  const renderTaskRef = useRef(null); // Ref to track the current render task
  const [scale, setScale] = useState(window.innerWidth < 700 ? 0.8 : 2); // Initial scale
  const previousPage = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadPDF = useCallback(
    async (pageNumber) => {
      try {
        setIsLoading(true);
        const file = pdfFile || (await pdfjs.getDocument(url).promise);
        if (!pdfFile) {
          setNumPages(file.numPages);
          setPdfFile(file);
        }

        const page = await file.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // Set canvas size to match PDF viewport
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        context.clearRect(0, 0, canvas.width, canvas.height);
        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport,
        });
        await renderTaskRef.current.promise;

        renderTaskRef.current = null;

        // Adjust container size dynamically
        if (containerRef.current) {
          containerRef.current.style.width = `${viewport.width}px`;
          containerRef.current.style.height = `${viewport.height}px`;
          if (previousPage.current !== pageNumber) {
            containerRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [pdfFile, url, scale]
  );

  useEffect(() => {
    if (currentPage) {
      loadPDF(currentPage);
    }
  }, [loadPDF, currentPage]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3)); // Max zoom level: 3x
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom level: 0.5x
  };

  return (
    <DialogBtn
      title={label}
      dialogClassName={styles.dialogPdf}
      header={label}
      onClick={() => {
        setCurrentPage(1);
      }}
      onClose={() => {
        setCurrentPage(null);
        setPdfFile(null);
      }}
    >
      {isLoading && <Center type="overlay">Loading...</Center>}
      <HiddenOnLoading data-is-loading={isLoading}>
        <CanvasContainer>
          <CanvasWrapper ref={containerRef}>
            <canvas ref={canvasRef}></canvas>
          </CanvasWrapper>
        </CanvasContainer>
        <ZoomControls>
          <button onClick={handleZoomOut} disabled={scale <= 0.5}>
            -
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={handleZoomIn} disabled={scale >= 3}>
            +
          </button>
        </ZoomControls>
        <Pagination>
          <Paginator
            rows={1}
            first={currentPage - 1}
            totalRecords={numPages}
            onPageChange={(event) => {
              setCurrentPage(event.page + 1);
            }}
          />
        </Pagination>
        <Buttons>
          <button onClick={() => forceDownload(url, label)}>
            Download PDF
          </button>
          <SharePDF fileURL={fileURL} />
        </Buttons>
      </HiddenOnLoading>
    </DialogBtn>
  );
};
const CanvasContainer = styled.div`
  max-height: 65vh;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-inline: 12px;
  background: #fff;
`;
const CanvasWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  position: sticky;
  top: 0;
  width: 100%;
  background: white;
  > div {
    > button {
      min-width: auto;
      width: auto;
    }
  }
`;
const MultiplePdfViewer = ({ fileURL }) => {
  const isMobile = window.innerWidth < 700;
  if (!fileURL?.length) {
    return;
  }
  return (
    <Wrapper>
      {fileURL.map((pdf, index) =>
        isMobile ? (
          <PDFViewer key={index} fileURL={pdf} />
        ) : (
          <PDFObject key={index} {...pdf} />
        )
      )}
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

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6px;
  button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    border-radius: 5px;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    flex: 1;
    &:hover {
      background-color: #e9e9e9;
    }
  }
`;

const HiddenOnLoading = styled.div`
  &[data-is-loading="true"] {
    display: none;
  }
`;
const ZoomControls = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  align-items: center;
  button {
    padding: 5px 10px;
    font-size: 14px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    border-radius: 5px;
    cursor: pointer;
    font-size: 32px;
    width: 4em;
    &:disabled {
      background-color: #eee;
      cursor: not-allowed;
    }
  }
  span {
    margin: 0 10px;
    font-size: 16px;
    font-weight: bold;
  }
`;
export default MultiplePdfViewer;
