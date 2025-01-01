import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import DocxReader from "../docs/DocxReader";
import { useContext } from "../context";

export default function AddAttachment() {
  const { itemsMapper, setItems } = useContext();
  const [current, setCurrent] = useState("");

  const add = () => {
    if (!current) {
      return;
    }
    const items = Object.values(itemsMapper);
    const size = items.length;
    const lastPage = items[size - 1]?.page || 0;
    const itemIndex = size + 1;
    const newItem = {
      position: itemIndex,
      description: current,
      page: lastPage + 2,
      hidden: false,
      id: Math.random().toString(16).slice(2),
    };
    setItems((pro) => {
      pro[newItem.id] = newItem;
    });
    setCurrent("");
  };

  return (
    <div className="inputs">
      <InputText value={current} onChange={(e) => setCurrent(e.target.value)} />
      <Button onClick={add} disabled={!current}>
        add
      </Button>
      <DocxReader onLoad={setItems} />
    </div>
  );
}
