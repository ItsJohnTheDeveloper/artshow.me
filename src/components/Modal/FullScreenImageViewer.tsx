import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import theme from "../../styles/theme";

interface FullScreenImageViewerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string;
  details: {
    title: string;
  };
}

const FullScreenImageViewer = ({
  open,
  setOpen,
  image,
  details,
}: FullScreenImageViewerProps) => {
  const { title } = details;

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={() => setOpen(false)}
      onClick={() => setOpen(false)}
      scroll="body"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.default,
          boxShadow: "24px",
          borderRadius: 12,
          height: "95%",
          cursor: "zoom-out",
          background: "rgba(27,38,49,0.7)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <div
        style={{
          backgroundImage: `url(${image})`,
          height: "100%",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
        }}
      >
        <DialogContent>
          <DialogTitle>{title}</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default FullScreenImageViewer;
