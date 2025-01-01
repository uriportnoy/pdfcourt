import { OrderList } from "primereact/orderlist";
import ListItem from "./ListItem";
import { updateStartEndAtIndex } from "../utils/utils";
import { InputSwitch } from "primereact/inputswitch";
import { useState } from "react";
import { useContext } from "../context";

export default function AttachmentsList() {
  const { items, itemsMapper, setItems } = useContext();
  const [dragEnabled, setDragEnabled] = useState(false);

  console.log("items", items);
  const onListChange = (newList) => {
    setItems(newList);
  };

  const updateListItem = (id, txt) => {
    setItems((draft) => {
      draft[id].description = txt;
    });
  };

  const updatePages = (id, newPageValue) => {
    setItems((draft) => {
      const array = Object.values(draft);
      const currentIdx = array.findIndex((t) => t.id === id);
      const isGreaterThanBefore = newPageValue > draft[id].page;
      const diff = Math.abs(newPageValue - draft[id].page);
      for (let i = currentIdx; i < array.length; i++) {
        if (isGreaterThanBefore) {
          array[i].page = array[i].page + diff;
        } else {
          array[i].page = array[i].page - diff;
        }
      }
    });
  };
  const updatePagesPosition = (elementToMoveId, newPosition) => {
    const elementInNewPosition = items.find(
      (el) => el.position === newPosition,
    );
    const elementInNewPositionId = elementInNewPosition?.id;
    if (elementInNewPositionId) {
      setItems((draft) => {
        const elementToMove = draft[elementToMoveId];
        const temp = draft[elementInNewPositionId].description;

        draft[elementInNewPositionId].description = elementToMove.description;
        draft[elementToMoveId].description = temp;

        // draft[elementInNewPositionId].position = elementToMove.position;
        // draft[elementToMoveId].position = newPosition;

        // Object.keys(draft).forEach((key, index) => {
        //   draft[key].position = index + 1;
        // });
      });
    } else {
      setItems((draft) => {
        draft[elementToMoveId].position = newPosition;
        const sortedItems = Object.values(draft).sort(
          (a, b) => a.position - b.position,
        );
        Object.keys(draft).forEach((key, index) => {
          draft[key] = sortedItems[index];
        });
      });
    }
  };

  const deleteItem = (id) => {
    setItems((draft) => {
      const { [id]: x, ...rest } = draft;
      return rest;
    });
  };

  const toggleHidden = (id) => {
    setItems((draft) => {
      draft[id].hidden = !draft[id].hidden;
      return draft;
    });
  };
  const listProps = {
    updateListItem,
    updatePages,
    updatePagesPosition,
    deleteItem,
    toggleHidden,
  };
  return (
    <>
      {dragEnabled ? (
        <OrderList
          dataKey="position"
          value={items}
          onChange={(e) => onListChange(e.value)}
          itemTemplate={(props) => <ListItem {...props} {...listProps} />}
          dragdrop
        />
      ) : (
        <div className={"orderList"}>
          {items.map((pr) => (
            <ListItem {...pr} {...listProps} key={pr.description} />
          ))}
        </div>
      )}
      {/*<span>re-order</span>*/}
      {/*<InputSwitch*/}
      {/*  checked={dragEnabled}*/}
      {/*  onChange={(e) => setDragEnabled(e.value)}*/}
      {/*/>*/}
    </>
  );
}
