import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import { GetStaticPaths, GetStaticProps } from "next";
import prisma from "../../../../lib/prisma";
import Head from "next/head";
import { User } from "@prisma/client";

const Artist = (props) => {
  const artist = props.data.artist as User;

  // Create a truncated version of the bio for the meta description
  const seoBio =
    artist.bio.slice(0, 150) + (artist.bio.length > 150 ? "..." : "");

  return (
    <Layout showCrumbs={false}>
      <Head>
        <title>{`${artist.name} / Art Gallery App`}</title>
        <meta
          name="description"
          content={`Artist: ${artist.name} - ${seoBio}`}
        />
      </Head>
      <pre>{JSON.stringify(artist, null, 2)}</pre>
      {/* <ArtistPage artist={artist} /> */}
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

  console.log("inside getStaticProps: ", artist);

  return {
    props: {
      data: {
        artist: JSON.parse(JSON.stringify(artist)),
      },
    },
    revalidate: 5,
  };
};

export default Artist;
