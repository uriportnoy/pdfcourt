import useDebounce from "../../common/useDebounce";
import { useAppContext } from "../Context";
import { origins } from "../common/common";
import styles from "../styles.module.scss";
import AddNewCase from "./AddNewCase";
import AddNewEvent from "./AddNewEvent";
import CasesDropdown, { SimpleDropdown } from "./CasesDropdown";
import get from "lodash/get";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

export default function TopBar({ filters, setFilters }) {
  const { loadEvents, groups } = useAppContext();

  const onSetFilters = (key, val) => {
    setFilters((draft) => {
      if (!val) {
        delete draft[key];
        return;
      }
      draft[key] = val;
    });
  };

  return (
    <div className={styles.topbar}>
      <AddNewEvent
        loadEvents={loadEvents}
        btnClassName={styles.btn}
        caseNumber={filters.caseNumber}
      />
      <CasesDropdown
        selectedCaseNumber={filters.caseNumber}
        onChange={(selectedCase) => {
          setFilters((draft) => {
            if (!selectedCase) {
              delete draft.caseNumber;
              return;
            }
            draft.caseNumber = selectedCase.caseNumber;
          });
        }}
        className={styles.casesSelect}
        isClearable
        placeholder={"סינון לפי תיק"}
        isCreatable={false}
      />
      <SimpleDropdown
        options={["שלום", "מחוזי", "העליון"]}
        value={get(filters, "selectedCase.court")}
        placeholder={"סינון לפי ערכאה"}
        onChange={(court) => {
          onSetFilters("selectedCase.court", court);
        }}
      />
      <SimpleDropdown
        options={groups}
        value={filters.groups}
        valKey={"id"}
        labelKey={"name"}
        placeholder={"סינון לפי קבוצה"}
        onChange={(group) => {
          onSetFilters("groups", group);
        }}
      />
      <SimpleDropdown
        options={origins}
        value={filters.type}
        onChange={(type) => {
          onSetFilters("type", type);
        }}
        placeholder={"סינון לפי גורם"}
        isClearable
      />
      <TextFilter
        onChange={(text) => {
          onSetFilters("text", text);
        }}
      />
      <AddNewCase label={"+C"} />
    </div>
  );
}

function TextFilter({ value, onChange }) {
  const [text, setText] = useState(value);

  const onTextChange = useDebounce(() => {
    onChange(text);
  }, 300);

  return (
    <InputText
      type="text"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onTextChange(e.target.value);
      }}
      onBlur={(e) => {
        onTextChange(e.target.value);
      }}
    />
  );
}
