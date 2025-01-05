import { useAppContext } from "../Context";
import { addCase } from "../firebase/cases";
import { useMemo, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

const colourStyles = {
  option: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: data.value.isMyCase ? undefined : "#ffa7975c",
    };
  },
};

export default function CasesDropdown({
  onChange,
  selectedCaseNumber,
  isCreatable,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const Component = isCreatable ? CreatableSelect : Select;
  const { cases: casesOptions, loadCases } = useAppContext();
  const dropdownOptions = useMemo(
    () =>
      casesOptions.map((item) => ({
        label: `(${item.court}) ${item.caseNumber}`,
        value: item,
      })),
    [casesOptions]
  );

  const currentOption = dropdownOptions
    ? dropdownOptions.find((op) => op.value.caseNumber === selectedCaseNumber)
    : null;

  const handleCreate = (inputValue) => {
    if (!inputValue || casesOptions.find((item) => item.id === inputValue)) {
      return;
    }
    setIsLoading(true);
    addCase({
      caseNumber: inputValue,
      type: "",
      court: "",
      description: "",
      appealAccepted: false,
      isMyCase: false,
      isOpen: true,
    }).then((id) => {
      loadCases().then((_cases) => {
        const curr = _cases.find((item) => item.id === id);
        console.log(curr);
        curr && onChange(curr);
        setIsLoading(false);
      });
    });
  };
  return (
    <>
      <Component
        value={currentOption}
        onChange={(e) => {
          onChange(e?.value || null);
        }}
        isLoading={isLoading}
        options={dropdownOptions}
        placeholder={"בחר תיק"}
        onCreateOption={isCreatable ? handleCreate : () => null}
        isClearable
        styles={colourStyles}
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
