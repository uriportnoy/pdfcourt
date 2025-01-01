import { getPdf } from "./generator";
import { writeBold } from "../utils/common";

const title = "תצהיר";
const subtitle = "אישור";

const userText =
  'אני הח"מ, {name}, ת.ז. {id} לאחר שהוזהרתי כי עליי להצהיר את האמת וכי אהיה צפוי לעונשים הקבועים בחוק אם לא אעשה כן, מצהיר בזה כי כל העובדות המפורטות ב{comment} מיום {date}, אמת ונכון.';
const lawTextRemote =
  'הריני מאשר בזאת כי ביום  {date} הופיע בפני עו"ד {lawyer}, באמצעות היוועדות חזותית מר {name}, ת.ז. {id} ואחרי שהזהרתיו כי עליו להצהיר את האמת ויהא צפוי לעונשים בחוק אם לא יעשה כן, אישר את תוכן תצהירו וחתם עליו. ';

const lawTextFront =
  'אני הח"מ, עו"ד {lawyer}, מאשר בזאת כי ביום {date} הופיע בפני מר {name}, ת.ז. {id} וחתם בפני על תצהיר זה לאחר שהזהרתיו כי עליו להצהיר את האמת בלבד וכי יהא צפוי לעונשים הקבועים בחוק באם לא יעשה כן.';

function getUserText({ name, id, date = getCurrentDate(), comment }) {
  return userText
    .replace("{name}", name)
    .replace("{id}", id)
    .replace("{date}", date)
    .replace("{comment}", comment);
}

function getApprovement({
  l_name,
  u_name,
  u_id,
  isRemoted,
  date = getCurrentDate(),
}) {
  return (isRemoted ? lawTextRemote : lawTextFront)
    .replace("{name}", u_name)
    .replace("{id}", u_id)
    .replace("{lawyer}", l_name)
    .replace("{date}", date);
}

export function getCurrentDate(dayOffset = 0) {
  const today = new Date();
  const day = (today.getDate() + dayOffset).toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export function addAffidavit({
  lawyer,
  comment,
  dayOffset = 0,
  withSignature,
  isRemoted,
}) {
  const pdf = getPdf();
  const user = {
    name: "אורי פורטנוי",
    id: "201410438",
  };
  const pageHeight =
    pdf.internal.pageSize.height || pdf.internal.pageSize.getHeight();
  const pageWidth =
    pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();

  pdf.setFontSize(14);

  const center = pageWidth / 2;
  const userBaseLine = pageHeight / 8;
  printHeader({ text: title, posY: userBaseLine });

  const textOptions = {
    maxWidth: 350,
    align: "center",
  };

  const date = getCurrentDate(dayOffset);
  pdf.text(
    getUserText({
      name: user.name,
      id: user.id,
      date,
      comment,
    }),
    center,
    userBaseLine + 20,
    textOptions,
    null,
  );

  printSignature({
    text: user.name,
    posY: userBaseLine + 120,
  });
  printSignature({
    withLine: false,
    text: ` ת.ז. ${user.id}`,
    posY: userBaseLine + 130,
    signature: "uri",
    withSignature: true,
  });
  const lawyerBaseLine = pageHeight / 2;

  printHeader({ posY: lawyerBaseLine, text: subtitle });
  pdf.text(
    getApprovement({
      l_name: lawyer.name,
      u_name: user.name,
      u_id: user.id,
      isRemoted,
      date,
    }),
    center,
    lawyerBaseLine + 20,
    textOptions,
    null,
  );
  printSignature({
    text: "חתימת עורך דין",
    posY: lawyerBaseLine + 120,
    signature: lawyer.signature,
    withSignature,
  });
}

function printHeader({ posY, text }) {
  const pdf = getPdf();
  writeBold(pdf, () => {
    const pageWidth =
      pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
    const center = pageWidth / 2;

    pdf.text(
      text,
      center,
      posY,
      {
        baseline: "bottom",
        align: "center",
      },
      null,
      "center",
    );

    const textWidth = pdf.getTextWidth(text);
    const lineOffset = posY + 2;
    const lineStartPos = center - 20;
    pdf.line(lineStartPos, lineOffset, center + textWidth, lineOffset);
  });
}

function printSignature({
  posY,
  text,
  withLine = true,
  signature = null,
  withSignature = false,
}) {
  const pdf = getPdf();
  const posX = 50;
  if (withLine) {
    const textWidth = pdf.getTextWidth(text);
    const lineOffset = posY - 12;
    pdf.line(posX, lineOffset, posX + textWidth, lineOffset);
  }
  pdf.text(
    text,
    posX,
    posY,
    {
      maxWidth: 300,
      align: "justify",
      baseline: "right",
    },
    null,
    "center",
  );

  if (signature && withSignature) {
    const img = new Image();
    img.src = `/signatures/${signature}.png`;
    let imageWidth = 155;
    let imageHeight = 105;
    switch (signature) {
      case "shay":
        imageWidth = 80;
        imageHeight = 80;
        break;
      case "uri":
        imageWidth = 120;
        imageHeight = 105;
        break;
      case "tby":
        imageWidth = 160;
        imageHeight = 105;
        break;
      default:
        imageWidth = 155;
        imageHeight = 105;
    }
    const xBasePosition = posX - imageWidth / 4;
    const range = 20;
    const xPosition = getRandomPosition(
      xBasePosition - range,
      xBasePosition + range,
    );
    const yBasePosition = posY - imageHeight / 1.5;
    const yPosition = getRandomPosition(
      yBasePosition - range,
      yBasePosition + range,
    );

    pdf.addImage(
      img,
      "png",
      xPosition,
      yPosition,
      imageWidth,
      imageHeight,
      null,
      "NONE",
      getRandomPosition(-10, 10),
    );
  }
}

function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}
