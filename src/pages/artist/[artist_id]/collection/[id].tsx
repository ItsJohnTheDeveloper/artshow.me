import { useState } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Layout from "../../../../components/Layout";
import Spacer from "../../../../components/Spacer";
import ArtPreview from "../../../../components/Collection/Gallery/ArtPreview";
import GalleryGrid from "../../../../components/Collection/Gallery/GalleryGrid";
import theme from "../../../../styles/theme";
import { useCollectionArt } from "../../../../utils/hooks/useQueryData";
import FullScreenImageViewer from "../../../../components/Modal/FullScreenImageViewer";

const StyledArtPaper = styled(Paper)({
  backgroundColor: theme.palette.background.paper,
  padding: 20,
  marginBottom: 10,
  borderRadius: 10,
  position: "sticky",
  top: 106,
});

const Collection = () => {
  const { id, artId } = useRouter().query;
  const { data, isLoading, isError } = useCollectionArt(
    id as string,
    artId as string
  );
  const [fullScreenViewerOpen, setFullScreenViewerOpen] = useState(false);

  const artwork = data?.painting;
  const otherArtInCollection = data?.other;
  const collection = data?.collection;

  const formattedSize = `w${artwork?.width} x h${artwork?.height}`;
  const formattedPrice = new Intl.NumberFormat("en-CA").format(artwork?.price);

  const handleOnClickImage = () => {
    setFullScreenViewerOpen(true);
  };

  if (isLoading && !isError) {
    return (
      <Layout pageSpacing showCrumbs>
        <CircularProgress />
      </Layout>
    );
  }

  return (
    <>
      <FullScreenImageViewer
        open={fullScreenViewerOpen}
        setOpen={setFullScreenViewerOpen}
        image={artwork?.image}
        details={{ title: artwork?.name }}
      />

      <Layout showCrumbs>
        <Spacer y={9} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={7}>
            <img
              src={artwork?.image}
              style={{ width: "100%", cursor: "zoom-in" }}
              onClick={handleOnClickImage}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6} xl={5}>
            <StyledArtPaper>
              <Typography variant="h3">{artwork?.name}</Typography>
              <Spacer y={0.5} />
              <Typography variant="body1">{artwork?.description}</Typography>
              {artwork?.sizeUnit && (
                <>
                  <Spacer y={0.5} />
                  <Typography sx={{ color: "#d5d5d5" }} variant="body1">
                    Size: {formattedSize}
                  </Typography>
                </>
              )}
              <Spacer y={2} />
              {artwork?.showPrice && (
                <>
                  <Typography variant="h4">${formattedPrice}</Typography>
                  <Spacer y={1} />
                  <Button size="medium" variant="contained">
                    Buy artwork
                  </Button>
                </>
              )}
            </StyledArtPaper>
          </Grid>
        </Grid>
        <Spacer y={8} />
        <Divider />
        <Spacer y={4} />
        <div style={{ padding: "0px 24px" }}>
          <Typography variant="body1">
            More from
            <Typography variant="h4" fontStyle={"italic"}>
              {collection?.name}
            </Typography>
          </Typography>
        </div>
        <GalleryGrid xl={6}>
          {otherArtInCollection?.map(
            (painting) =>
              id !== painting.id && ( //don't show the current selected painting in collection
                <ArtPreview
                  key={painting.id}
                  data={painting}
                  collectionId={collection.id}
                />
              )
          )}
        </GalleryGrid>
      </Layout>
    </>
  );
};

export default Collection;
