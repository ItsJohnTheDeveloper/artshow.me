import { Close } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useArtwork from "../../../utils/hooks/useArtwork";
import Spacer from "../../Spacer";

const ArtDialog = () => {
  const router = useRouter();
  const { artId } = router.query;

  const { data: artwork, isLoading, isError } = useArtwork(artId);

  const handleOnCloseDialog = () => {
    delete router.query.artId;
    router.push(router, undefined, { scroll: false });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  const { description, width, height, image, name, price, id } = artwork;
  const formattedSize = `w${width} x h${height}`;
  const formattedPrice = new Intl.NumberFormat("en-CA").format(price);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open
      onClose={handleOnCloseDialog}
      scroll="body"
    >
      <DialogTitle textAlign={"right"}>
        <IconButton
          aria-label="close"
          onClick={handleOnCloseDialog}
          size="large"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component="section"
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
          }}
        >
          <img src={image} style={{ maxWidth: "100%", height: "auto" }} />
          <Spacer y={2} />
          <Typography variant="h3">{name + " testingjgnsk"}</Typography>
          <Spacer y={0.5} />
          <Typography variant="body1">{description}</Typography>
          <Spacer y={0.5} />
          <span style={{ color: "#999999", fontSize: 13, paddingTop: 3 }}>
            Size: {formattedSize}
          </span>
          <Spacer y={2} />
          <Typography variant="h4">${formattedPrice}</Typography>
          <Spacer y={1} />

          <Button size="medium" variant="contained">
            Buy artwork
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArtDialog;
