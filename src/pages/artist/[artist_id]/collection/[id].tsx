import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import styled from "@emotion/styled";
import axios from "axios";
import { useRouter } from "next/router";
import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import Layout from "../../../../components/Layout";
import Spacer from "../../../../components/Spacer";
import ArtPreview from "../../../../components/Collection/Gallery/ArtPreview";
import prisma from "../../../../lib/prisma";
import GalleryGrid from "../../../../components/Collection/Gallery/GalleryGrid";
import theme from "../../../../styles/theme";

const StyledArtPaper = styled(Paper)({
  backgroundColor: theme.palette.background.paper,
  padding: 20,
  marginBottom: 10,
  borderRadius: 10,
  position: "sticky",
  top: 106,
});

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const { artId } = query as any;
  const { collection: collectionName, artist_id } = params as any;

  const painting = await prisma.painting.findUnique({
    where: { id: artId },
  });

  const collection = await prisma.collection.findUnique({
    where: { name: collectionName, userId: artist_id },
  });

  return {
    props: {
      data: {
        painting: JSON.parse(JSON.stringify(painting)),
        collection: JSON.parse(JSON.stringify(collection)),
      },
    },
  };
};

const Collection = (props) => {
  const { painting, collection } = props.data;

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
  } = painting;

  const formattedSize = `w${width} x h${height}`;
  const formattedPrice = new Intl.NumberFormat("en-CA").format(price);

  const [collectionGallery, setCollectionGallery] = useState(null);

  const collectionId = painting?.collectionIds?.[0];

  useEffect(() => {
    const getInitialCollection = async () => {
      try {
        const { data } = await axios.get("/collection/getCollections", {
          params: { id: collectionId },
        });
        setCollectionGallery(data);
      } catch (err) {
        console.error(err?.response);
      }
    };

    if (!collectionGallery?.length) {
      getInitialCollection();
    }
  }, [painting, collectionGallery]);

  return (
    <Layout pageSpacing showCrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={7}>
          <img src={image} style={{ width: "100%" }} />
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={6} xl={5}>
          <StyledArtPaper>
            <Typography variant="h3">{name}</Typography>
            <Spacer y={0.5} />
            <Typography variant="body1">{description}</Typography>
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
          </StyledArtPaper>
        </Grid>
      </Grid>
      <Spacer y={8} />
      <Divider />
      <Spacer y={4} />

      <Typography variant="body1">
        More from
        <Typography variant="h4" fontStyle={"italic"}>
          {collection.name}
        </Typography>
      </Typography>
      <GalleryGrid xl={6}>
        {collectionGallery?.map(
          (painting) =>
            id !== painting.id && ( //don't show the current selected painting in collection
              <ArtPreview
                key={painting.id}
                data={painting}
                collection={collection}
              />
            )
        )}
      </GalleryGrid>
    </Layout>
  );
};

export default Collection;
