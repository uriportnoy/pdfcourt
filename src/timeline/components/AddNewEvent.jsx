import options from "./cases.json";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import styles from "./styles.module.scss";
import { Button } from "primereact/button";
import { useImmer } from "use-immer";
import { addEvent, updateEvent } from "./firebase/events";
import DialogBtn from "./common/DialogBtn";
import { useAppContext } from "./Context";
import UploadPDF from "./UploadPDF";
import Select from "react-select";
import { useState } from "react";
import MultipleSelect from "./MultipleSelect";
import CasesDropdown from "./CasesDropdown";

const origins2 = ["court", "mine", "notMine", "trd-party"];
export default function AddNewEvent({ btnClassName }) {
  return (
    <DialogBtn title={"+"} btnClassName={btnClassName}>
      <FormDialog />
    </DialogBtn>
  );
}
const defaultState = {
  selectedCase: null,
  type: null,
  date: null,
  title: "",
  subtitle: "",
  description: "",
  content: "",
  fileURL: null,
  relatedCases: [],
};
export const FormDialog = ({ eventData = {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useImmer({
    ...defaultState,
    ...eventData,
  });
  const { loadEvents } = useAppContext();

  const addNewEvent = async () => {
    setIsLoading(true);
    addEvent({
      ...state,
      caseNumber: state.selectedCase.caseNumber,
    })
      .then(loadEvents)
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateEventData = async () => {
    setIsLoading(true);

    updateEvent({
      ...state,
      caseNumber: state.selectedCase.caseNumber,
    })
      .then(loadEvents)
      .finally(() => {
        setIsLoading(false);
      });
  };
  const isEditMode = !!eventData?.id;

  return (
    <div className={styles.formWrapper}>
      <CasesDropdown
        selectedCaseNumber={state.selectedCase}
        onChange={(selectedCase) => {
          setState((draft) => {
            draft.selectedCase = selectedCase;
          });
        }}
      />
      <MultipleSelect
        options={options}
        onChange={(cases) => {
          setState((draft) => {
            draft.relatedCases = cases;
          });
        }}
        valKey={"caseNumber"}
        selectedOptions={state.relatedCases}
      />
      <Dropdown
        value={state.type}
        onChange={(e) => {
          setState((draft) => {
            draft.type = e.value;
          });
        }}
        options={origins2}
      />
      <Calendar
        value={state.date ? new Date(state.date) : new Date()}
        onChange={(e) => {
          setState((draft) => {
            const pickedDate = e.value;
            draft.date = pickedDate.toLocaleDateString("en-CA");
          });
        }}
        dateFormat="dd/mm/yy"
      />
      <InputText
        value={state.title}
        onChange={(e) => {
          setState((draft) => {
            draft.title = e.target.value;
          });
        }}
        placeholder={"כותרת"}
      />
      <InputText
        value={state.subtitle}
        onChange={(e) => {
          setState((draft) => {
            draft.subtitle = e.target.value;
          });
        }}
        placeholder={"כותרת משנה"}
      />
      <InputTextarea
        value={state.description}
        onChange={(e) => {
          setState((draft) => {
            draft.description = e.target.value;
          });
        }}
        placeholder={"בקצרה"}
      />
      <InputTextarea
        value={state.content}
        onChange={(e) => {
          setState((draft) => {
            draft.content = e.target.value;
          });
        }}
        placeholder={"בארוכה"}
      />
      {state?.fileURL && <textarea disabled defaultValue={state.fileURL} />}
      <UploadPDF
        fileName={state.title.replace(" ", "_")}
        cb={(url) => {
          setState((draft) => {
            draft.fileURL = url;
          });
        }}
      />

      <Button
        label="שמור"
        onClick={isEditMode ? updateEventData : addNewEvent}
        disabled={
          !state.selectedCase || !state.type || !state.date || !state.title
        }
        loading={isLoading}
      />
    </div>
  );
};
