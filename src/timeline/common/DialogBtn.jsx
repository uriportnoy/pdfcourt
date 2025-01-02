import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

export default function DialogBtn({
  children,
  title,
  dialogClassName,
  btnClassName,
  header = "Header",
  isOpen,
  onClick,
  onClose,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen !== null && isOpen !== undefined && isOpen !== visible) {
      setVisible(isOpen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button
        label={title}
        onClick={() => {
          let preventShow = false;
          if (onClick) {
            preventShow = onClick()?.preventShow || false;
          }
          if (!preventShow) {
            setVisible(true);
          }
        }}
        className={btnClassName}
      />
      <Dialog
        header={header}
        visible={visible}
        className={dialogClassName}
        onHide={() => {
          if (!visible) {
            return;
          }
          setVisible(false);
          onClose && onClose();
        }}
      >
        {visible && children}
      </Dialog>
    </>
  );
}
