import { useState } from "react";
import { Dropdown } from "primereact/dropdown";

export default function SelectSignature({ setLawyer }) {
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const lawyers = [
    { name: "טלי בן יקיר", signature: "tby" },
    { name: "שי שפירא", signature: "shay" },
    { name: "נועם אברהם", signature: "shay" },
  ];

  return (
    <div className="card flex justify-content-center">
      <Dropdown
        value={selectedLawyer}
        onChange={(e) => {
          setSelectedLawyer(e.value);
          setLawyer(e.value);
        }}
        options={lawyers}
        optionLabel="name"
        placeholder="Select a Lawyer"
        className="w-full md:w-14rem"
      />
    </div>
  );
}
