import Center from "../../../Center";
import DialogBtn from "../../common/DialogBtn";
import styles from "../../styles.module.scss";
import SharePDF from "./SharePDF";
import { forceDownload, getPdfCanvasPages, getPdfPageViewport } from "./utils";
import * as pdfjs from "pdfjs-dist/webpack";
import { Paginator } from "primereact/paginator";
import { ToggleButton } from "primereact/togglebutton";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileURL }) => {
  const { label, url, type } = fileURL;
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [multiplePages, setMultiplePages] = useState(false);
  const [scale, setScale] = useState(window.innerWidth < 700 ? 0.8 : 2); // Initial scale
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const multiplePagesIsLoaded = useRef(false);
  const getPDF = useCallback(async () => {
    try {
      if (!pdfFile) {
        setIsLoading(true);
      }
      const file = pdfFile || (await pdfjs.getDocument(url).promise);
      if (!pdfFile) {
        setNumPages(file.numPages);
        setPdfFile(file);
      }
      if (!pdfFile) {
        setIsLoading(false);
      }
      return file;
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }, [url, pdfFile]);

  const loadAllPages = useCallback(
    async (_scale) => {
      try {
        const file = await getPDF();
        const pageCanvases = await getPdfCanvasPages(file, _scale);
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          pageCanvases.forEach(({ canvas }) =>
            containerRef.current.appendChild(canvas),
          );
        }
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${pageCanvases[0].viewport.width}px`;
          wrapperRef.current.style.height = `${pageCanvases[0].viewport.height}px`;
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    },
    [getPDF],
  );

  const loadPDF = useCallback(
    async (pageNumber, _scale) => {
      try {
        const file = await getPDF();
        const { canvas, viewport } = await getPdfPageViewport({
          pdfFile: file,
          pageNumber,
          scale: _scale,
        });
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(canvas);
        }
        if (wrapperRef.current) {
          wrapperRef.current.style.width = `${viewport.width}px`;
          wrapperRef.current.style.height = `${viewport.height}px`;
        }
        return { canvas, viewport };
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    },
    [getPDF],
  );

  const loadPdfData = ({ newPage, _scale = scale, multipleDirect = false }) => {
    setCurrentPage(newPage);
    if (multiplePages || multipleDirect) {
      loadAllPages(_scale).then(() => {
        multiplePagesIsLoaded.current = true;
      });
    } else {
      multiplePagesIsLoaded.current = false;
      loadPDF(newPage, _scale).then(({ canvas }) => {
        requestAnimationFrame(() => {
          containerRef.current.scrollLeft =
            (canvas.width - containerRef.current.clientWidth) / 2;
          containerRef.current.scrollTo({ behavior: "smooth" });
        });
      });
    }
  };

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
    loadPdfData({ newPage: 1 });
  };
  const handleZoom = (zoomIn = true) => {
    const newScale = zoomIn
      ? Math.min(scale + 0.2, 3)
      : Math.max(scale - 0.2, 0.5);
    setScale(newScale);
    loadPdfData({ newPage: currentPage, _scale: newScale });
  };

  const onPageChange = (event) => {
    const newPage = event.page + 1;
    if (multiplePages && multiplePagesIsLoaded.current) {
      setCurrentPage(newPage);
      const relevantPage = document.getElementById(`page-${newPage}`);
      relevantPage.scrollIntoView({ behavior: "smooth" });
      return;
    }
    loadPdfData({ newPage });
  };

  return (
    <DialogBtn
      title={label}
      dialogClassName={styles.dialogPdf}
      header={label}
      onClick={onClick}
      onClose={() => {
        setCurrentPage(null);
        setPdfFile(null);
      }}
      type={type}
    >
      {isLoading && <Center type="overlay">Loading...</Center>}
      <HiddenOnLoading data-is-loading={isLoading}>
        <CanvasContainer ref={containerRef}>
          <CanvasWrapper ref={wrapperRef}>
            {/*<canvas ref={canvasRef}></canvas>*/}
          </CanvasWrapper>
        </CanvasContainer>
        <ZoomControls>
          <button onClick={() => handleZoom(false)} disabled={scale <= 0.5}>
            -
          </button>
          <span>{(scale * 100).toFixed(0)}%</span>
          <button onClick={() => handleZoom()} disabled={scale >= 3}>
            +
          </button>
        </ZoomControls>
        <Pagination>
          <Paginator
            rows={1}
            first={currentPage - 1}
            totalRecords={numPages}
            onPageChange={onPageChange}
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
              setMultiplePages(e.value);
              loadPdfData({ newPage: currentPage, multipleDirect: e.value });
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
