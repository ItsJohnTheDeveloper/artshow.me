import styled from "@emotion/styled";
import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import Layout from "../../../../components/Layout";
import Spacer from "../../../../components/Spacer";
import ArtPreview from "../../../../components/Collection/Gallery/ArtPreview";

const StyledArtPaper = styled(Paper)({
  backgroundColor: "#303339",
  padding: 20,
  marginBottom: 10,
  borderRadius: 10,
});

export const getServerSideProps = async ({ params, query }) => {
  const { id } = params;
  const { artId } = query;
  console.log(artId);

  const data = await import("../../../../mock/mock-data.json");

  const galleryByCollection = data?.collections.filter(
    (collection) => collection.id === id
  )[0];

  const artByGallery = galleryByCollection.gallery.filter(
    (art) => art.id === artId
  )[0];

  return {
    props: { data: { art: artByGallery, collection: galleryByCollection } },
  };
};

const Collection = (props) => {
  const { description, images, price, size, title } = props.data.art;
  const { gallery, id: collectionId, artistId } = props.data.collection;

  console.log(gallery);
  const priceFormatted = new Intl.NumberFormat("en-CA").format(price);

  return (
    <Layout pageSpacing showCrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={7}>
          <img src={images[0]} style={{ width: "100%" }} />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={6} xl={5}>
          <StyledArtPaper>
            <Typography variant="h3">{title}</Typography>
            <Spacer y={0.5} />
            <Typography variant="body1">{description}</Typography>
            <Spacer y={0.5} />
            <span style={{ color: "#999999", fontSize: 13, paddingTop: 3 }}>
              Size: {size}
            </span>
            <Spacer y={2} />
            <Typography variant="h4">${priceFormatted}</Typography>
            <Spacer y={1} />

            <Button size="medium" variant="contained">
              Buy artwork
            </Button>
          </StyledArtPaper>
        </Grid>
      </Grid>
      <Spacer y={8} />
      <Divider />
      <Spacer y={4} />

      <Typography variant="h4">
        More from collection / {collectionId}
      </Typography>
      <Grid
        style={{ padding: "64px 24px" }}
        container
        spacing={{ xs: 1, sm: 2, md: 2, lg: 1.5, xl: 2 }}
        columns={{ xs: 4, sm: 8, md: 8, lg: 10, xl: 12 }}
      >
        {gallery?.map((artwork) => (
          <ArtPreview
            data={{
              ...artwork,
              artistId,
              collectionId,
            }}
            key={artwork.id}
          />
        ))}
      </Grid>
    </Layout>
  );
};

export default Collection;
