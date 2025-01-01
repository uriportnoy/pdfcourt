import { default as PDFApp } from "./pdfCreator/App";
import { default as TimelineApp } from "./timeline/App";
import { useState } from "react";

const PDF = "PDF";
const TIMELINE = "Timeline";
function App() {
  const [selection, setSelection] = useState(TIMELINE);
  return (
    <div>
      <div>
        <button
          disabled={selection === PDF}
          onClick={() => setSelection(TIMELINE)}
        >
          PDF
        </button>
        <button
          disabled={selection === TIMELINE}
          onClick={() => setSelection(TIMELINE)}
        >
          Timeline
        </button>
      </div>
      {selection === PDF && <PDFApp />}
      {selection === TIMELINE && <TimelineApp />}
    </div>
  );
}
export default App;
