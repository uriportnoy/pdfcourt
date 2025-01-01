import React, { useState } from "react";
import { Menu } from "primereact/menu";
import { deleteEvent } from "./firebase/events";
import { Dialog } from "primereact/dialog";
import { FormDialog } from "./AddNewEvent";
import { useAppContext } from "./Context";

const ItemMenu = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const { loadEvents } = useAppContext();
  const openEditDialog = () => {
    setVisible(true);
  };
  return (
    <>
      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <FormDialog eventData={props} />
      </Dialog>
      <Menu
        model={[
          {
            label: "Options",
            items: [
              {
                label: "Edit",
                icon: "pi pi-pencil",
                command: openEditDialog,
              },
              {
                label: "Remove",
                icon: "pi pi-times",
                command: () => {
                  deleteEvent(props.id).then(loadEvents);
                },
              },
            ],
          },
        ]}
        popup
        ref={ref}
        id="popup_menu_left"
      />
    </>
  );
});

export default ItemMenu;
