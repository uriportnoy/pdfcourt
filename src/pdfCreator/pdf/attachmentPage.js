import { getPdf } from "./generator";
import { getAttachment, writeBold } from "../utils/common";

const options = {
  maxWidth: 300,
  baseline: "bottom",
  align: "center",
};
export function addAttachments(data) {
  const pdf = getPdf();
  data.forEach((d, index) => {
    index > 0 && pdf.addPage();
    pdf.setFontSize(36);
    const { pageSize } = pdf.internal;
    const pageHeight = pageSize.height || pageSize.getHeight();
    const pageWidth = pageSize.width || pageSize.getWidth();

    const verticalCenter = pageHeight / 2 - 20;
    writeBold(pdf, () => {
      pdf.text(
        getAttachment(d.position),
        pageWidth / 2,
        verticalCenter,
        options,
        null,
      );
    });

    pdf.setFontSize(20);
    pdf.text(d.description, pageWidth / 2, verticalCenter + 20, options, null);
  });
}

export function createAttachPage() {}
