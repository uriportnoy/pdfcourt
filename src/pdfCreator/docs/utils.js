import PizZip from "pizzip";
import { DOMParser } from "@xmldom/xmldom";

export function readFile(content) {
  console.log(content);
  const paragraphs = getParagraphs(content);
  const inputString = paragraphs.join();
  const regexPattern = /(?:.{0,100})מסומן\s*(\d+)/g;
  const matches = new Map();
  let match;
  let idx = 0;
  while ((match = regexPattern.exec(inputString)) !== null) {
    const attachment = parseInt(match[1]);
    const lastPage = Array.from(matches.entries())[idx++]?.page || 2;

    if (!matches.has(attachment)) {
      matches.set(attachment, {
        description: match[0].slice(0, -7).trim(), // Adjust the slice length based on the actual length of 'נספח',
        position: parseInt(match[1]),
        page: lastPage + 1,
      });
    }
  }
  return Array.from(matches.values());
}

function str2xml(str) {
  if (str.charCodeAt(0) === 65279) {
    // BOM sequence
    str = str.substr(1);
  }
  return new DOMParser().parseFromString(str, "text/xml");
}

function getParagraphs(content) {
  const zip = new PizZip(content);
  const xml = str2xml(zip.files["word/document.xml"].asText());
  const paragraphsXml = xml.getElementsByTagName("w:p");
  const paragraphs = [];

  for (let i = 0, len = paragraphsXml.length; i < len; i++) {
    let fullText = "";
    const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
    for (let j = 0, len2 = textsXml.length; j < len2; j++) {
      const textXml = textsXml[j];
      if (textXml.childNodes) {
        fullText += textXml.childNodes[0].nodeValue;
      }
    }
    if (fullText) {
      paragraphs.push(fullText);
    }
  }
  return paragraphs;
}

// async function countPages(filePath) {
//   try {
//     const { value } = await mammoth.extractRawText({ path: filePath });
//     const pageCount = value
//       .split("\n")
//       .filter((line) => line.trim() !== "").length;
//     console.log("Page count:", pageCount);
//     return pageCount;
//   } catch (error) {
//     console.error("Error:", error);
//     return -1;
//   }
// }
