import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../../../components/Layout";
import prisma from "../../../lib/prisma";
import ArtistProfile from "../../../components/Profile/Artist";
import ArtPreview from "../../../components/Collection/Gallery/ArtPreview";
import { Grid } from "@mui/material";

export const getServerSideProps = async ({ params }) => {
  const mockData = await import("../../../mock/mock-data.json");
  return {
    props: {
      data: { artist: mockData.artist, collections: mockData.collections },
    },
  };
};

const Artist = (props) => {
  const collections = props.data.collections;
  const artist = props.data.artist;
  const defaultCollection = collections.filter(
    (collection) => collection.id === artist.collections[0]
  )[0];

  console.log(defaultCollection);

  return (
    <Layout>
      <ArtistProfile data={artist} />
      <Grid
        style={{ padding: "64px 24px" }}
        container
        spacing={{ xs: 1, sm: 2, md: 2, lg: 1.5, xl: 2 }}
        columns={{ xs: 4, sm: 8, md: 8, lg: 10, xl: 12 }}
      >
        {defaultCollection?.gallery?.map((artwork) => (
          <ArtPreview
            data={{
              ...artwork,
              artistId: defaultCollection.artistId,
              collectionId: defaultCollection.id,
            }}
            key={artwork.id}
          />
        ))}
      </Grid>
    </Layout>
  );
};

export default Artist;
