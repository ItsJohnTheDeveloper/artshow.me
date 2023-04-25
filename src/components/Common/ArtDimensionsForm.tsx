import { Checkbox, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import Spacer from "./Spacer";

const sizeMap = [{ value: "in", label: "in" }];

const ArtDimensionsForm = ({
  defaultValues = null,
  showSizeInput,
  setShowSizeInput,
}) => {
  const { register } = useFormContext(); // NOTE: You need FormProvider to use useFormContext!

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={showSizeInput}
            onChange={() => setShowSizeInput(!showSizeInput)}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="Show art dimensions"
      />

      {showSizeInput && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 0px",
          }}
        >
          <TextField
            {...register("height", { required: true })}
            defaultValue={defaultValues?.height}
            id="outlined-height"
            label="Height"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 81 }}
          />
          <span style={{ margin: "0px 12px" }}>X</span>
          <TextField
            {...register("width", { required: true })}
            defaultValue={defaultValues?.width}
            id="outlined-width"
            label="Width"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 81 }}
          />
          <Spacer x={2} />
          <TextField
            {...register("sizeUnit", { required: true })}
            defaultValue={defaultValues?.sizeUnit}
            id="outlined-unit-measurement"
            select
            label="Unit"
            value={showSizeInput ? "in" : null}
            onChange={() => {}}
          >
            {sizeMap.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      )}
    </div>
  );
};

export default ArtDimensionsForm;
