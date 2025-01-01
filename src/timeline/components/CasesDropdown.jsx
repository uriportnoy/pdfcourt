import Select from "react-select";

export default function PlainDropdown({
  onChange,
  selectedCaseNumber,
  options,
  ...props
}) {
  const dropdownOptions = options.map((item) => ({
    label: item.id,
    value: item,
  }));
  const currentOption = dropdownOptions
    ? dropdownOptions.find((op) => op.label === selectedCaseNumber)
    : null;
  return (
    <Select
      value={currentOption}
      onChange={(e) => {
        onChange(e?.value || null);
      }}
      options={dropdownOptions}
      placeholder={"בחר תיק"}
      {...props}
    />
  );
}
