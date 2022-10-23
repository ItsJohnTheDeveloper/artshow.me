import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import prisma from "../../../lib/prisma";
import { ArtistDocument } from "../../../models/Artist";
import { CollectionDocument } from "../../../models/Collection";
import { useArtist } from "../../../utils/hooks/useQueryData";

// export const getServerSideProps = async ({ params }) => {
//   const artist: ArtistDocument = await prisma.user.findUnique({
//     where: { id: params.artist_id },
//   });

//   const collections: CollectionDocument[] = await prisma.collection.findMany({
//     where: { userId: params.artist_id },
//   });
//   return {
//     props: {
//       data: {
//         artist: {
//           name: artist.name,
//           bio: artist.bio,
//           profilePic: artist.profilePic,
//           coverPic: "/artist/cover.jpg", // TODO: change later, mock for now
//         },
//       },
//     },
//   };
// };

const Artist = () => {
  const router = useRouter();
  const endpoint = router.query?.artist_id;

  const { data: artist, isError, isLoading } = useArtist(endpoint);
  console.log(isLoading);
  if (artist) {
    artist.coverPic = "/artist/cover.jpg"; // TODO: change later, mock for now
  }

  return (
    <Layout showCrumbs>
      {!isLoading && !isError && <ArtistPage artist={artist} />}
    </Layout>
  );
};

export default Artist;
