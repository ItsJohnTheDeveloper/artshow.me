import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import theme from "../../styles/theme";
import Spacer from "../Common/Spacer";

type CreateCollectionForm = {
  email: string;
  password: string;
};

const CreateCollectionDialog = ({ open, setOpen, handleOnSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const onCreateCollectionSubmit = async (data: CreateCollectionForm) => {
    handleOnSubmit(data);
  };

  const closeDialog = () => {
    setOpen(false);
    clearErrors("name");
  };

  return (
    <Dialog
      maxWidth={"sm"}
      open={open}
      onClose={closeDialog}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.default,
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
        },
      }}
    >
      <DialogTitle>Create a new Collection</DialogTitle>
      <DialogContent>
        <Spacer y={2} />
        <form onSubmit={handleSubmit(onCreateCollectionSubmit)}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Collection Name"
            variant="outlined"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <Typography variant="body1" color={"#c33333"}>
              Name required
            </Typography>
          )}
          <Spacer y={2} />
          <Button variant="contained" type={"submit"}>
            Create
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCollectionDialog;
