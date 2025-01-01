export const forceDownload = async (url, label) => {
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

export async function getPdfCanvasPages(file, scale) {
  const pageCanvases = [];
  for (let pageNumber = 1; pageNumber <= file.numPages; pageNumber++) {
    const { canvas, viewport } = await getPdfPageViewport({
      pdfFile: file,
      pageNumber,
      scale,
    });
    pageCanvases.push({ canvas, viewport });
  }

  return pageCanvases;
}

export async function getPdfPageViewport({
  pdfFile,
  pageNumber,
  scale,
  canvas,
}) {
  const page = await pdfFile.getPage(pageNumber);
  const { canvas: _canvas, viewport } = await resizeCanvas({
    page,
    scale,
    canvas: canvas || document.createElement("canvas"),
  });
  _canvas.id = `page-${pageNumber}`;

  return {
    canvas: _canvas,
    page,
    viewport,
  };
}

export const resizeCanvas = async ({ canvas, page, scale, pageNumber }) => {
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);

  await page
    .render({ canvasContext: context, viewport })
    .promise.catch((error) => {
      console.error(`Error rendering page ${page}:`, error);
    });
  return { canvas, viewport };
};
