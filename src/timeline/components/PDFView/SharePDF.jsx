import { useState } from "react";

const SharePDF = ({ fileURL }) => {
  const { label, url } = fileURL;
  const [pdfFile, setPdfFile] = useState(null); // Store the file
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  // Convert PDF URL to Blob and create a File object
  const fetchPDFFile = async () => {
    try {
      setIsLoading(true); // Start loading state
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch PDF file");
      const blob = await response.blob();
      const file = new File([blob], `${label || "document"}.pdf`, {
        type: "application/pdf",
      });
      setPdfFile(file);
      return file;
    } catch (error) {
      console.error("Error fetching PDF file:", error);
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const handleShare = async () => {
    if (!pdfFile) {
      const file = await fetchPDFFile(); // Fetch the PDF file on demand
      if (!file) return;
    }

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          files: [pdfFile],
          title: "Check out this PDF",
          text: "I found this PDF file and thought you might find it interesting!",
        });
        console.log("File shared successfully");
      } catch (error) {
        console.error("Error sharing file:", error);
      }
    } else {
      alert("Your browser does not support sharing files.");
    }
  };

  return (
    <button onClick={handleShare} disabled={isLoading}>
      {isLoading ? "Preparing file..." : "Share PDF"}
    </button>
  );
};

export default SharePDF;
