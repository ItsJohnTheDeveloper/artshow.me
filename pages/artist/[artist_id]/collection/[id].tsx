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

const StyledArtPaper = styled(Paper)({
  backgroundColor: "#303339",
  padding: 20,
  marginBottom: 10,
  borderRadius: 10,
  position: "sticky",
  top: 24,
});

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  const { artId } = query as any;

  const painting = await prisma.painting.findUnique({
    where: { id: artId },
  });

  return {
    props: {
      data: {
        painting: JSON.stringify(painting),
      },
    },
  };
};

const Collection = (props) => {
  const router = useRouter();
  const painting = JSON.parse(props.data.painting);
  const { description, width, height, image, name, price, id } = painting;

  const formattedSize = `w${width} x h${height}`;
  const priceFormatted = new Intl.NumberFormat("en-CA").format(price);

  const [collectionGallery, setCollectionGallery] = useState(null);

  const collectionName = router.query.id;

  useEffect(() => {
    const getInitialCollection = async () => {
      try {
        const { data } = await axios.get("/collection/getCollections", {
          params: { id: painting.collectionId },
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
            <Spacer y={0.5} />
            <span style={{ color: "#999999", fontSize: 13, paddingTop: 3 }}>
              Size: {formattedSize}
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

      <Typography variant="body1">
        More from
        <Typography variant="h4" fontStyle={"italic"}>
          {collectionName}
        </Typography>
      </Typography>
      <GalleryGrid xl={6}>
        {collectionGallery?.map(
          (painting) =>
            id !== painting.id && ( //don't show the current selected painting in collection
              <ArtPreview
                data={painting}
                key={painting.id}
                collectionName={collectionName}
              />
            )
        )}
      </GalleryGrid>
    </Layout>
  );
};

export default Collection;
