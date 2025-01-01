import { FONT } from "../utils/fontLoader";
import { addAffidavit } from "./affidavit";
import { addAttachments } from "./attachmentPage";
import { addTable } from "./table";
import jsPDF from "jspdf";

export function getPdf() {
  if (window.pdfFile) {
    return window.pdfFile;
  }
  window.pdfFile = new jsPDF({
    unit: "px",
  });
  return window.pdfFile;
}

export function clearPdf() {
  window.pdfFile = null;
}

export const downloadPdfDocument = (data = [], context) => {
  const { printAffidavit, affidavitData, includes } = context;
  const _data = includes.lastPageOnly
    ? [data.reverse().find((item) => !item.hidden)]
    : data.filter((it) => !it.hidden);

  const pdf = getPdf();
  pdf.setR2L(true);
  pdf.setFont(FONT);

  if (printAffidavit && !affidavitData.lastPageOnly) {
    addAffidavit({
      lawyer: affidavitData.lawyer,
      dayOffset: affidavitData.dayOffset,
      comment: `${affidavitData.comment?.name || ""} ${
        affidavitData.description || ""
      }`,
      withSignature: includes.lawyerSignature || false,
      isRemoted: affidavitData.isRemoted,
    });
    pdf.addPage();
  }
  if (includes.table && !affidavitData.lastPageOnly) {
    addTable(_data);
    pdf.addPage();
  }
  if (includes.pages) {
    addAttachments(_data);
  }

  pdf.save("download.pdf");
  clearPdf();
};
