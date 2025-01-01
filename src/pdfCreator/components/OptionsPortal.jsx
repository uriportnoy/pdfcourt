import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function OptionsPortal({ children }) {
  const [root, setRoot] = useState(null);
  useEffect(() => {
    if (!root) {
      setRoot(document.getElementById("options"));
    }
  }, []);

  if (!root) {
    return null;
  }

  return <>{createPortal(children, root)}</>;
}
