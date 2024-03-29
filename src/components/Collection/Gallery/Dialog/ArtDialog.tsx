import { useEffect, useState } from "react";
import { Close, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { useArtwork } from "../../../../utils/hooks/useQueryData";
import Spacer from "../../../Common/Spacer";
import EditArtForm from "./EditArtForm";
import theme from "../../../../styles/theme";
import FullScreenImageViewer from "../../../Modal/FullScreenImageViewer";

const ArtDialog = () => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const router = useRouter();
  const artistId = router.query.artist_id;
  const [fullScreenViewerOpen, setFullScreenViewerOpen] = useState(false);

  const artId = router.query.artId as string;
  const { data: artwork, mutate: boundMutate, isLoading } = useArtwork(artId);

  const { data: session } = useSession();
  const isOwnProfile = session?.user.id && session?.user.id === artistId;

  const [isEditingArt, setIsEditingArt] = useState(false);

  useEffect(() => {
    // reset edit state
    setIsEditingArt(false);
  }, [artId]);

  const handleOnCloseDialog = () => {
    delete router.query.artId;
    router.push(router, undefined, { scroll: false });
  };

  if (!artId || isLoading) {
    return null;
  }

  const {
    description,
    height,
    width,
    sizeUnit,
    showSize,
    image,
    name,
    price,
    id,
    showPrice,
  } = artwork;
  const formattedPrice = new Intl.NumberFormat("en-CA").format(price);

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="lg"
      open
      onClose={handleOnCloseDialog}
      scroll="body"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.default,
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
          background: "rgba(27,38,49,0.7)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <DialogTitle display={"flex"} justifyContent={"right"}>
        {!isEditingArt && (
          <IconButton
            style={{ visibility: isOwnProfile ? "visible" : "hidden" }}
            aria-label="edit"
            onClick={() => isOwnProfile && setIsEditingArt(true)}
            size="small"
          >
            <Edit />
            <Spacer x={1} />
            edit art
          </IconButton>
        )}
        <Spacer x={3} />
        <IconButton
          aria-label="close"
          onClick={handleOnCloseDialog}
          size="large"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent style={isMobile ? { padding: 0 } : null}>
        <Box
          component="section"
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
          }}
        >
          {isEditingArt ? (
            <EditArtForm
              data={artwork}
              handleCancelEditing={() => setIsEditingArt(false)}
              boundMutate={boundMutate}
            />
          ) : (
            <>
              {!isMobile && (
                <FullScreenImageViewer
                  open={fullScreenViewerOpen}
                  setOpen={setFullScreenViewerOpen}
                  image={artwork?.image}
                  details={{ title: artwork?.name }}
                />
              )}
              <img
                src={image}
                style={{ maxWidth: "100%", height: "auto", cursor: "zoom-in" }}
                onClick={() => setFullScreenViewerOpen(true)}
              />
              <Spacer y={2} />
              <Typography variant="h3" fontSize="34px">
                {name}
              </Typography>
              <Spacer y={0.5} />
              <Typography variant="h5">{description}</Typography>
              {showSize && (
                <>
                  <Spacer y={0.5} />
                  <Typography sx={{ color: "#d5d5d5" }} variant="body1">
                    Size: {`${height} x ${width} ${sizeUnit}`}
                  </Typography>
                </>
              )}
              <Spacer y={2} />
              {showPrice && (
                <>
                  <Typography variant="h4">${formattedPrice}</Typography>
                  <Spacer y={1} />
                  <Button size="medium" variant="contained">
                    Buy artwork
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnCloseDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArtDialog;
