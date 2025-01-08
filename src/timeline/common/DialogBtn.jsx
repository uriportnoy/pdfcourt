import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import styled from "styled-components";

export default function DialogBtn({
  children,
  title,
  dialogClassName,
  btnClassName,
  header = "Header",
  isOpen,
  onClick,
  onClose,
  type,
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
      <TypeButton
        label={title}
        data-type={type}
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

const TypeButton = styled(Button)`
  background: #333;
  border: 0;
  margin: 2px;
  &[data-type="mine"] {
    background-image: linear-gradient(#26a600, #374151);
  }

  &[data-type="notMine"] {
    background-image: linear-gradient(#bc0202, #374151);
  }

  &[data-type="court"] {
    background-image: linear-gradient(#a6a300, #374151);
  }

  &[data-type="trd-party"] {
    background-image: linear-gradient(#7989de, #374151);
  }
`;
