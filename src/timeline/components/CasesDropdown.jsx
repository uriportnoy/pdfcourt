import { useAppContext } from "../Context";
import Select from "react-select";

export default function CasesDropdown({
  onChange,
  selectedCaseNumber,
  ...props
}) {
  const { cases: casesOptions } = useAppContext();
  const dropdownOptions = casesOptions.map((item) => ({
    label: item.id,
    value: item,
  }));
  console.log("casesOptions:", dropdownOptions);
  const currentOption = dropdownOptions
    ? dropdownOptions.find((op) => op.label === selectedCaseNumber)
    : null;
  return (
    <>
      <Select
        value={currentOption}
        onChange={(e) => {
          onChange(e?.value || null);
        }}
        options={dropdownOptions}
        placeholder={"בחר תיק"}
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
