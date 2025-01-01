import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";

function ListItem({
  updateListItem,
  updatePages,
  updatePagesPosition,
  deleteItem,
  hidden,
  id,
  toggleHidden,
  ...rest
}) {
  const { position, page, description, disabled = false } = rest;
  const [txt, setTxt] = useState(description || "");

  return (
    <div className="listItem">
      <InputNumber id={id} val={position} update={updatePagesPosition} />
      <InputTextarea
        value={txt}
        onChange={(e) => {
          setTxt(e.target.value);
        }}
        onBlur={() => updateListItem(id, txt)}
      />
      <InputNumber id={id} val={page} update={updatePages} />
      <span
        style={{ color: hidden ? "red" : "green" }}
        onClick={() => {
          toggleHidden(id);
        }}
      >
        {hidden ? "hidden" : "shown"}
      </span>
      <span onClick={() => deleteItem(id)}> x</span>
    </div>
  );
}

function InputNumber({ id, val, update }) {
  const inc = () => {
    update(id, val + 1);
  };
  const dec = () => {
    update(id, val - 1);
  };
  return (
    <div className="pages">
      <span onClick={inc}>+</span>
      <input
        value={val}
        type="number"
        onChange={(e) => update(parseInt(e.target.value))}
      />
      <span onClick={dec}>-</span>
    </div>
  );
}
export default ListItem;
