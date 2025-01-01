import autoTable from "jspdf-autotable";
import {
  attachment,
  description,
  getAttachment,
  page,
  writeBold,
} from "../utils/common";
import { FONT, FONT_BOLD } from "../utils/fontLoader";
import { getPdf } from "./generator";

const TITLE = "רשימת נספחים:";
export function addTable(data) {
  const pdf = getPdf();
  const options = {
    maxWidth: 300,
    baseline: "bottom",
    align: "center",
  };
  pdf.setFontSize(36);
  const pageWidth =
    pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

  writeBold(pdf, () => {
    pdf.text(TITLE, pageWidth / 2, 50, options, null);
  });

  const tableBody = data.map((it) => [
    it.page.toString().split("").reverse().join(""),
    it.description,
    getAttachment(it.position),
  ]);

  const styles = {
    font: FONT,
    halign: "center",
    valign: "middle",
    fontSize: "12",
    minCellWidth: 75,
  };

  const headStyles = {
    fillColor: "#333",
  };

  autoTable(pdf, {
    head: [[page, description, attachment]],
    body: tableBody,
    theme: "grid",
    styles,
    headStyles,
    startY: 70,
  });
}
