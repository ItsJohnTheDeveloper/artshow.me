import Select from "react-select";
import theme from "../../styles/theme";

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
    backgroundColor: theme.palette.background.default,
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
      theme={(Theme) => ({
        ...Theme,
        colors: {
          ...Theme.colors,
          primary25: theme.palette.background.default,
          //   primary: "black",
        },
      })}
      {...rest}
    />
  );
};

export default ReactSelect;
