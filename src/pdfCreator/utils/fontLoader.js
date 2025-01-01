import jsPDF from "jspdf";
import { fontBold } from "./font-bold";
import { font } from "./font";
export const FONT = "DavidLibre-Regular";
export const FONT_BOLD = "DavidLibre-Bold";

const font_format = `${FONT}-normal.ttf`;
const font_bold_format = `${FONT_BOLD}-normal.ttf`;

(function (jsPDFAPI) {
  const callAddFont = function () {
    this.addFileToVFS(font_format, font);
    this.addFont(font_format, FONT, "normal");

    this.addFileToVFS(font_bold_format, fontBold);
    this.addFont(font_bold_format, FONT_BOLD, "normal");
  };
  jsPDF.API.events.push(["addFonts", callAddFont]);
})(jsPDF.API);
