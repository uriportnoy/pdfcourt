import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

export default function MultipleSelect({
  options,
  selectedOptions,
  onChange,
  valKey,
  labelKey,
}) {
  const selected = selectedOptions.map((item) => ({
    value: item,
    label: item,
  }));
  const _options = options.map((item) => ({
    value: item[valKey || labelKey],
    label: item[labelKey || valKey],
  }));
  return (
    <Select
      value={selected}
      onChange={(cases) => {
        onChange(cases.map((selected) => selected.value));
      }}
      options={_options}
      isMulti
      components={animatedComponents}
      closeMenuOnSelect={false}
      styles={colourStyles}
    />
  );
}

const colourStyles = {
  control: (styles) => ({ ...styles, maxWidth: "100%" }),
  option: (styles) => ({ ...styles }),
  multiValue: (styles, { data }) => ({
    ...styles,
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
  }),
};
