import { Box, Button, Modal, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Close } from "@mui/icons-material";
import { useSession, signIn } from "next-auth/react";

import Spacer from "../../Common/Spacer";
import { useEffect } from "react";
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

const LoginModal = ({ open, setOpen }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setOpen(false);
    }
  }, [session]);

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
        {!session && (
          <>
            <Typography variant="body1">
              <Button variant="contained" onClick={() => signIn()}>
                Login
              </Button>
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default LoginModal;
