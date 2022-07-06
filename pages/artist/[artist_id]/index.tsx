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
  const { artist, collections, mockCollections } = props.data;

  return (
    <Layout showCrumbs>
      <ArtistProfile artist={artist} collections={collections} />
    </Layout>
  );
};

export default Artist;
