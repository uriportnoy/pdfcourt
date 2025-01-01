import Center from "../../../Center";
import DialogBtn from "../../common/DialogBtn";
import styles from "../../styles.module.scss";
import SharePDF from "./SharePDF";
import { forceDownload } from "./utils";
import * as pdfjs from "pdfjs-dist/webpack";
import { Paginator } from "primereact/paginator";
import { ToggleButton } from "primereact/togglebutton";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileURL }) => {
  const { label, url } = fileURL;
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [multiplePages, setMultiplePages] = useState(false);
  const [scale, setScale] = useState(window.innerWidth < 700 ? 0.8 : 2); // Initial scale
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const renderTaskRef = useRef(null); // Ref to track the current render task
  const previousPage = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);

  const loadAllPages = useCallback(async () => {
    try {
      const file = pdfFile || (await pdfjs.getDocument(url).promise);
      if (!pdfFile) {
        setNumPages(file.numPages);
        setPdfFile(file);
      }
      const pageCanvases = [];

      for (let pageNumber = 1; pageNumber <= file.numPages; pageNumber++) {
        const page = await file.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

        // Create a new canvas for each page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.id = `page-${pageNumber}`;
        context.clearRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport }).promise;

        pageCanvases.push(canvas);
      }
      setDataIsLoaded(true);
      // Clear existing container and append all the canvases
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clear previous content
        pageCanvases.forEach((canvas) =>
          containerRef.current.appendChild(canvas)
        );
      }
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }, [pdfFile, url, scale]);

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
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${viewport.width}px`;
          wrapperRef.current.style.height = `${viewport.height}px`;
          if (previousPage.current !== pageNumber) {
            wrapperRef.current.scrollIntoView({ behavior: "smooth" });
            requestAnimationFrame(() => {
              containerRef.current.scrollLeft =
                (canvas.width - containerRef.current.clientWidth) / 2;
            });
            previousPage.current = pageNumber;
          }
        }
        setDataIsLoaded(true);
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
      if (multiplePages) {
        loadAllPages().then(() => {
          const relevantPage = document.getElementById(`page-${currentPage}`);
          relevantPage.scrollIntoView({ behavior: "smooth" });
          requestAnimationFrame(() => {
            containerRef.current.scrollLeft =
              (relevantPage.width - containerRef.current.clientWidth) / 2;
          });
        });
      } else {
        loadPDF(currentPage);
      }
    }
  }, [loadAllPages, loadPDF, currentPage, multiplePages]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3)); // Max zoom level: 3x
    requestAnimationFrame(() => {
      containerRef.current.scrollLeft =
        (wrapperRef.current.width - containerRef.current.clientWidth) / 2;
    });
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom level: 0.5x
  };
  
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    requestAnimationFrame(() => {
      const wrapperWidth = parseInt(wrapperRef.current.style.width, 10);
      containerRef.current.scrollLeft =
        (wrapperWidth - containerRef.current.clientWidth) / 2;
    });
  }, [scale]);

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
        <CanvasContainer ref={containerRef}>
          <CanvasWrapper ref={wrapperRef}>
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
              const newPage = event.page + 1;
              setCurrentPage(newPage);
            }}
          />
        </Pagination>
        <Buttons>
          <button onClick={() => forceDownload(url, label)}>
            Download PDF
          </button>
          <SharePDF fileURL={fileURL} />
          <ToggleButton
            checked={multiplePages}
            onChange={(e) => {
              setDataIsLoaded(false);
              setMultiplePages(e.value);
            }}
            onLabel="Multiple"
            offLabel="Single"
          />
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
export default PDFViewer;
