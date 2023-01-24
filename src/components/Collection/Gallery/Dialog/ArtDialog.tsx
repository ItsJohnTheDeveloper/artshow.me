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
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useUser } from "../../../../contexts/user-context";
import { useArtwork } from "../../../../utils/hooks/useQueryData";
import Spacer from "../../../Spacer";
import EditArtForm from "./EditArtForm";
import theme from "../../../../styles/theme";
import FullScreenImageViewer from "../../../Modal/FullScreenImageViewer";

const ArtDialog = () => {
  const router = useRouter();
  const artistId = router.query.artist_id;
  const [fullScreenViewerOpen, setFullScreenViewerOpen] = useState(false);

  const { artId } = router.query;
  const { data: artwork, mutate: boundMutate, isLoading } = useArtwork(artId);

  const { getUser: loggedInUser } = useUser();
  const isOwnProfile = loggedInUser && loggedInUser.id === artistId;

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
    image,
    name,
    price,
    id,
    showPrice,
  } = artwork;
  const formattedPrice = new Intl.NumberFormat("en-CA").format(price);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open
      onClose={handleOnCloseDialog}
      scroll="body"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.default,
          boxShadow: "24px",
          borderRadius: 12,
          backgroundImage: "unset",
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
      <DialogContent>
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
              <FullScreenImageViewer
                open={fullScreenViewerOpen}
                setOpen={setFullScreenViewerOpen}
                image={artwork?.image}
                details={{ title: artwork?.name }}
              />
              <img
                src={image}
                style={{ maxWidth: "100%", height: "auto", cursor: "zoom-in" }}
                onClick={() => setFullScreenViewerOpen(true)}
              />
              <Spacer y={2} />
              <Typography variant="h3">{name}</Typography>
              <Spacer y={0.5} />
              <Typography variant="h5">{description}</Typography>
              {sizeUnit && (
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
