import "./App.scss";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import AffidavitComponent from "./components/AffidavitComponent";
import AttachmentsList from "./components/AttachmentsList";
import AddAttachment from "./components/AddAttachment";
import OptionsPortal from "./components/OptionsPortal";
import { Context, useContext } from "./context";

function App() {
  return (
    <div className="App">
      <Context>
        <div id="options" />
        <Content />
      </Context>
    </div>
  );
}

function Content() {
  const {
    download,
    setItems,
    isButtonDisabled,
    includes,
    setIncludes,
    printPages,
    printAffidavit,
  } = useContext();

  return (
    <>
      <button
        onClick={() => {
          setItems((draft) => {
            Object.entries(draft).forEach(([key, value]) => {
              draft[key] = { ...value, hidden: false };
            });
          });
        }}
      >
        enable
      </button>
      {printPages && <AttachmentsList />}
      {printPages && <AddAttachment />}
      {printAffidavit && <AffidavitComponent />}

      {Object.entries(includes).map(([name, isActive]) => {
        return (
          <OptionsPortal key={name}>
            <span>{name}</span>
            <InputSwitch
              checked={isActive}
              onChange={(e) =>
                setIncludes((draft) => {
                  if (name === "lastPageOnly" && e.value === true) {
                    draft.table = false;
                    draft.lawyerSignature = false;
                    draft.affidavit = false;
                    draft.pages = true;
                  }
                  draft[name] = e.value;
                })
              }
            />
          </OptionsPortal>
        );
      })}
      <Button onClick={download} disabled={isButtonDisabled}>
        download
      </Button>
      <Button
        onClick={() => {
          setItems({});
        }}
      >
        clear
      </Button>
    </>
  );
}

export default App;
