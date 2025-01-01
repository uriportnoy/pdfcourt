import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";
import styled from "styled-components";

const animatedComponents = makeAnimated();

export default function MultipleSelect({
  options,
  selectedOptions,
  onChange,
  valKey,
  labelKey,
  isCreatable,
  ...rest
}) {
  const selected = selectedOptions.map((item) => ({
    value: item,
    label: item.label || item,
  }));
  const _options = options.map((item) => ({
    value: item[valKey || labelKey],
    label: item[labelKey || valKey],
  }));
  const Comp = isCreatable ? CreatableSelect : Select;

  return (
    <Wrapper>
      <Comp
        value={selected}
        onChange={(cases) => {
          onChange(
            cases.map((selected) => selected.value),
            cases
          );
        }}
        options={_options}
        isMulti
        components={animatedComponents}
        closeMenuOnSelect={false}
        styles={colourStyles}
        placeholder={"בחר תיקים קשורים"}
        menuPosition="fixed"
        {...rest}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  div {
  }
  [class$="-control"] > div > div {
    width: fit-content !important;
  }
`;
const colourStyles = {
  control: (styles) => ({
    ...styles,
    maxWidth: "100%",
    width: "100%",
  }),
  container: (styles) => ({
    ...styles,
    width: "100%",
  }),
  option: (styles) => ({ ...styles }),
  multiValue: (styles, { data }) => ({
    ...styles,
    // minWidth: "fit-content",
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
  }),
};
