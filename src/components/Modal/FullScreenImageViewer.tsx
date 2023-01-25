import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
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
  const isMobile = useMediaQuery("(max-width:600px)");

  const { title } = details;

  return (
    <Dialog
      fullScreen={isMobile}
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
          <DialogTitle>
            <div
              style={{
                background: "rgba(27,38,49,0.7)",
                backdropFilter: "blur(10px)",
                padding: "20px 30px",
                borderRadius: 28,
                width: "fit-content",
              }}
            >
              {title}
            </div>
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default FullScreenImageViewer;
