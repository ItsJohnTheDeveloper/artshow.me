import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
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
          bio: artist.bio,
          profilePic: artist.profilePic,
        },
        mockCollections: mockData.collections,
        collections,
      },
    },
  };
};

const Artist = (props) => {
  const { artist, collections } = props.data;

  return (
    <Layout showCrumbs>
      <ArtistPage artist={artist} collections={collections} />
    </Layout>
  );
};

export default Artist;
