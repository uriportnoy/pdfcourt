import SelectSignature from "../signatures/SelectSignature";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { getCurrentDate } from "../pdf/affidavit";
import { useContext } from "../context";
import { InputSwitch } from "primereact/inputswitch";

const comments = [
  { name: "בקשה" },
  { name: "תגובה" },
  { name: "כתב הגנה" },
  { name: "כתב התשובה" },
];
export default function AffidavitComponent() {
  const { affidavitData, setAffidavitData, includes } = useContext();

  const { description, comment, dayOffset, isRemoted } = affidavitData;

  const setComment = (comment) => {
    setAffidavitData((draft) => {
      draft.comment = comment;
    });
  };
  const setDescription = (description) => {
    setAffidavitData((draft) => {
      draft.description = description;
    });
  };
  const setLawyer = (lawyer) => {
    setAffidavitData((draft) => {
      draft.lawyer = lawyer;
    });
  };
  const setDayOffset = (dayOffset) => {
    setAffidavitData((draft) => {
      draft.dayOffset = dayOffset;
    });
  };
  const setRemoted = (remote) => {
    setAffidavitData((draft) => {
      draft.isRemoted = remote;
    });
  };

  return (
    <div className="wrapper">
      <SelectSignature setLawyer={setLawyer} />
      <InputText
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        placeholder={"<--- לפי פקודת הביזיון"}
      />
      <div className="card flex justify-content-center">
        <Dropdown
          value={comment}
          onChange={(e) => {
            setComment(e.value);
          }}
          options={comments}
          optionLabel="name"
          className="w-full md:w-14rem"
        />
      </div>
      <label>{getCurrentDate(dayOffset)}</label>
      <InputNumber
        value={dayOffset}
        onValueChange={(e) => setDayOffset(e.value)}
        mode="decimal"
        showButtons
        min={-28}
        max={28}
      />
      <label>הוודעות חזותית</label>
      <InputSwitch
        title="remote sign"
        checked={isRemoted}
        onChange={(e) => setRemoted(e.value)}
      />
    </div>
  );
}
