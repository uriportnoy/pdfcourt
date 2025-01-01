import { useAppContext } from "../Context";
import DialogBtn from "../common/DialogBtn";
import { addCase, updateCase } from "../firebase/cases";
import styles from "../styles.module.scss";
import CasesDropdown from "./CasesDropdown";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useImmer } from "use-immer";

export default function ({ label = "+" }) {
  const [selectedCase, setSelectedCase] = useState(null);
  const { cases: options } = useAppContext();
  return (
    <DialogBtn title={label} header={"תיק"}>
      <CasesList>
        <CasesDropdown
          selectedCaseNumber={selectedCase}
          onChange={setSelectedCase}
          className={styles.casesSelect}
          isClearable
          placeholder={"תיק קיים"}
        />
        <AddUpdateCase options={options} selectedCase={selectedCase} />
      </CasesList>
    </DialogBtn>
  );
}

const CasesList = styled.div`
  width: 55vw;
  direction: rtl;
  @media (max-width: 768px) {
    width: 90vw;
  }
`;
function AddUpdateCase({ options, selectedCase }) {
  const [caseInfo, setCaseInfo] = useImmer({
    description: "",
    type: "",
    id: "",
    relation: "",
    court: "",
    status: false,
  });
  const isExistingCase = !!selectedCase?.id;

  useEffect(() => {
    selectedCase && setCaseInfo(selectedCase);
  }, [selectedCase]);

  return (
    <div className="flex-column mid-popup">
      <Dropdown
        value={caseInfo.type}
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.type = e.value;
          });
        }}
        options={options.map((option) => option.type)}
        className="w-full md:w-14rem"
        placeholder={"סוג"}
      />
      <InputMask
        id="ssn_input"
        value={caseInfo.id}
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.id = e.value;
          });
        }}
        mask="99999-99-99"
        placeholder={"תיק"}
      />

      <Dropdown
        value={caseInfo.relation}
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.relation = e.value;
          });
        }}
        options={options.map((option) => option.relation)}
        className="w-full md:w-14rem"
        placeholder={"צדדים"}
      />
      <InputText
        value={caseInfo.description}
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.description = e.target.value;
          });
        }}
        placeholder={"תיאור"}
      />
      <Dropdown
        value={caseInfo.court}
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.court = e.value;
          });
        }}
        options={options.map((option) => option.court)}
        className="w-full md:w-14rem"
        placeholder={"בית משפט"}
      />
      <ToggleButton
        checked={caseInfo.status}
        onLabel="פתוח"
        offLabel="סגור"
        onChange={(e) => {
          setCaseInfo((draft) => {
            draft.status = e.value;
          });
        }}
      />
      <Button
        label={isExistingCase ? "Update" : "Add"}
        onClick={() => {
          const _case = {
            ...caseInfo,
            status: caseInfo.status ? "פתוח" : "סגור",
          };
          const method = isExistingCase ? updateCase : addCase;
          method(_case).then((t) => {
            console.log(t);
          });
        }}
        // disabled={Object.values(caseInfo).some((val) => !val)}
      />
    </div>
  );
}
