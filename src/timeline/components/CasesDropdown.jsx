import { useAppContext } from "../Context";
import { addCase } from "../firebase/cases";
import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function CasesDropdown({
  onChange,
  selectedCaseNumber,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { cases: casesOptions, loadCases } = useAppContext();
  const dropdownOptions = casesOptions.map((item) => ({
    label: item.id,
    value: item,
  }));
  console.log("casesOptions:", dropdownOptions);
  const currentOption = dropdownOptions
    ? dropdownOptions.find((op) => op.label === selectedCaseNumber)
    : null;

  const handleCreate = (inputValue) => {
    if (!inputValue || casesOptions.find((item) => item.id === inputValue)) {
      return;
    }
    setIsLoading(true);
    addCase({ id: inputValue }).finally(() => {
      loadCases().then((_cases) => {
        const curr = _cases.find((item) => item.id === inputValue);
        curr && onChange(curr);
        setIsLoading(false);
      });
    });
  };
  return (
    <>
      <CreatableSelect
        value={currentOption}
        onChange={(e) => {
          onChange(e?.value || null);
        }}
        isLoading={isLoading}
        options={dropdownOptions}
        placeholder={"בחר תיק"}
        onCreateOption={handleCreate}
        isClearable
        {...props}
      />
    </>
  );
}

export const SimpleDropdown = ({
  options,
  onChange,
  value,
  valKey,
  labelKey,
  ...props
}) => {
  const _options = options.map((item) => ({
    label: labelKey ? item[labelKey] : item,
    value: valKey ? item[valKey] : item,
  }));
  const currentOption = value ? _options.find((op) => op === value) : null;
  return (
    <Select
      value={currentOption}
      onChange={(selected) => onChange(selected?.value)}
      options={_options}
      isClearable
      {...props}
    />
  );
};
