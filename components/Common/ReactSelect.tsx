import Select from "react-select";

const customStyles = {
  option: (provided) => ({
    ...provided,
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#3f434a",
    borderColor: "#3f434a",
    zIndex: 1000,
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "#212730",
    borderColor: "#545960",
    minHeight: 56,
  }),
  multiValue: (provided) => ({
    ...provided,
    color: "black",
  }),
};

const ReactSelect = ({ options, ...rest }) => {
  return (
    <Select
      styles={customStyles}
      options={options}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: "#212730",
          //   primary: "black",
        },
      })}
      {...rest}
    />
  );
};

export default ReactSelect;
