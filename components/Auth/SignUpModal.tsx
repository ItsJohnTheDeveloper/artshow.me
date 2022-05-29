import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";

import Spacer from "../Spacer";
import prisma from "../../lib/prisma";
import { generateNewUser } from "../../schemas/generateNew";
import axios from "axios";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "#212730",
  boxShadow: 24,
  borderRadius: 3,
  p: 3,
};

type SignUpSubmitForm = {
  name: string;
  email: string;
  password: string;
};

const SignUpModal = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSignUpSubmit = async (data: SignUpSubmitForm) => {
    console.log(data);

    const user = generateNewUser(data.name, data.password, data.email);

    try {
      await axios.post("/auth/signup", user);
      console.log(`Successfully created user: ${user.name}`);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(errors);

  return (
    <Modal
      BackdropProps={{ style: { backgroundColor: "rgb(0 0 0 / 24%)" } }}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={modalStyle}>
        <div style={{ textAlign: "right" }}>
          <IconButton aria-label="close" onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </div>
        <Typography id="modal-modal-description" variant="h5" component="h2">
          Sign up
        </Typography>
        <Spacer y={1} />
        <Typography variant="body1" color={"#afafaf"}>
          Join the worlds fastest growing virtual art gallery.
        </Typography>
        <Spacer y={6} />
        <form onSubmit={handleSubmit(onSignUpSubmit)}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Artist Name"
            variant="outlined"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <Typography variant="body1" color={"#c33333"}>
              Artist name required
            </Typography>
          )}
          <Spacer y={2} />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Email"
            variant="outlined"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <Typography variant="body1" color={"#c33333"}>
              Email address required
            </Typography>
          )}
          <Spacer y={2} />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Password"
            type={"password"}
            variant="outlined"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <Typography variant="body1" color={"#c33333"}>
              Password required
            </Typography>
          )}
          <Spacer y={2} />
          <Button variant="contained" type={"submit"}>
            Sign up
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default SignUpModal;
