import LoginWrapper from "./LoginWrapper";
// import { default as PDFApp } from "./pdfCreator/App";
import { default as TimelineApp } from "./timeline/App";
import { Menubar } from "primereact/menubar";
import { useState } from "react";

const PDF = "PDF";
const TIMELINE = "Timeline";

function App({ logout }) {
  const [selection, setSelection] = useState(TIMELINE);
  const items = [
    {
      label: "PDF",
      icon: "pi pi-refresh",
      disabled: selection === PDF,
      command: () => {
        setSelection(PDF);
      },
    },
    {
      label: "Timeline",
      icon: "pi pi-times",
      disabled: selection === TIMELINE,
      command: () => {
        setSelection(TIMELINE);
      },
    },
    {
      label: "Sign out",
      icon: "pi pi-times",
      command: logout,
    },
  ];
  return (
    <div>
      <Menubar model={items} />
      {/* {selection === PDF && <PDFApp />} */}
      {selection === TIMELINE && <TimelineApp />}
    </div>
  );
}

export default () => (
  <LoginWrapper>
    <App />
  </LoginWrapper>
);
