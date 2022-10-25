import { GetServerSideProps } from "next";
import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import prisma from "../../../lib/prisma";
import { ArtistDocument } from "../../../models/Artist";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params.artist_id as any;
  const artist: ArtistDocument = await prisma.user.findUnique({
    where: { id },
  });

  artist.coverPic = "/artist/cover.jpg"; // TODO: change later, mock for now
  return {
    props: {
      data: {
        artist: JSON.parse(JSON.stringify(artist)),
      },
    },
  };
};

const Artist = (props) => {
  const { artist } = props.data;

  console.log(artist);

  return (
    <Layout showCrumbs>
      artist: {artist.id}
      <br />
      id: {artist.id}
      {/* <ArtistPage artist={artist} /> */}
    </Layout>
  );
};

export default Artist;
