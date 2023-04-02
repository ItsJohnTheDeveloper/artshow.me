import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../../../lib/prisma";

const Artist = (props) => {
  console.log(props);
  const artist = props.data.artist;

  if (!artist) {
    return <div>404 - artist not found</div>;
  }

  return (
    <Layout showCrumbs>
      <ArtistPage artist={artist} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const artists = await prisma.user.findMany();

  const paths = artists.map((artist) => ({
    params: { artist_id: artist.id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params.artist_id as string;

  const artist = await prisma.user.findUnique({
    where: { id },
  });

  return {
    props: {
      data: {
        artist: JSON.parse(JSON.stringify(artist)),
      },
    },
  };
};

export default Artist;
