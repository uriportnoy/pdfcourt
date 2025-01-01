import { useState } from "react";
import { Dialog } from "primereact/dialog";

export default function DialogBtn({ children, title }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button onClick={() => setVisible(true)}>{title}</button>
      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        {visible && children}
      </Dialog>
    </>
  );
}
