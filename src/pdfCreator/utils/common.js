import { FONT, FONT_BOLD } from "./fontLoader";

export const attachment = "נספח";
export const description = "פירוט";
export const page = "עמוד";

export const getAttachment = (idx) => `${attachment} ${idx}`;

export function writeBold(pdf, cb) {
  pdf.setFont(FONT_BOLD);
  cb();
  pdf.setFont(FONT);
}
