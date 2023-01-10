import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import axios from "axios";

import Spacer from "../../Spacer";
import { useState } from "react";
import { useUser } from "../../../contexts/user-context";
import theme from "../../../styles/theme";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: theme.palette.background.default,
  boxShadow: 24,
  borderRadius: 3,
  p: 3,
};

type LoginSubmitForm = {
  email: string;
  password: string;
};

const LoginModal = ({ open, setOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setUser } = useUser();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLoginSubmit = async (data: LoginSubmitForm) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/auth/login", data);
      console.log(response);
      console.log(`Successfully logged in!`);

      setUser(response.data);

      setOpen(false);
    } catch (err) {
      setIsLoading(false);
      if (err?.response?.status === 403) {
        setError("Invalid login credentials.");
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <Modal
      BackdropProps={{ style: { backgroundColor: "rgb(0 0 0 / 33%)" } }}
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
          Login
        </Typography>
        <Spacer y={6} />
        <form onSubmit={handleSubmit(onLoginSubmit)}>
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
            {isLoading ? (
              <CircularProgress color="success" size={20} />
            ) : (
              "Login"
            )}
          </Button>
          {error && (
            <Typography variant="body1" color={"#c33333"}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;
