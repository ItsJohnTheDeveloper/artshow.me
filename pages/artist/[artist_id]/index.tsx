import React from "react";
import Layout from "../../../components/Layout";
import ArtistProfile from "../../../components/Profile/Artist";
import ArtPreview from "../../../components/Collection/Gallery/ArtPreview";
import { Grid } from "@mui/material";
import prisma from "../../../lib/prisma";
import { ArtistDocument } from "../../../models/Artist";
import { CollectionDocument } from "../../../models/Collection";

export const getServerSideProps = async ({ params }) => {
  const mockData = await import("../../../mock/mock-data.json");

  const artist: ArtistDocument = await prisma.user.findUnique({
    where: { id: params.artist_id },
  });

  const collections: CollectionDocument[] = await prisma.collection.findMany({
    where: { userId: params.artist_id },
  });

  return {
    props: {
      data: {
        artist: {
          ...mockData.artist,
          id: params?.artist_id,
          name: artist.name,
        },
        mockCollections: mockData.collections,
        collections,
      },
    },
  };
};

const Artist = (props) => {
  const collections = props.data.mockCollections;
  const artist = props.data.artist;
  const defaultCollection = collections.filter(
    (collection) => collection.id === artist.collections[0]
  )[0];

  return (
    <Layout showCrumbs>
      <ArtistProfile artist={artist} collections={props.data.collections} />
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
