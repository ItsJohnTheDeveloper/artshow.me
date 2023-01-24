import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import { useArtist } from "../../../utils/hooks/useQueryData";

/** TODO!! check back later if Prisma supports this in serverless environment. */

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const id = params.artist_id as any;
//   console.log(`id: ${id}`);

//   console.log("Grabbing Prisma shit");
//   const artist: ArtistDocument = await prisma.user.findUnique({
//     where: { id },
//   });
//   console.log("Done grabbing prisma shit");
//   console.log({ artist });

//   artist.coverPic = "/artist/cover.jpg"; // TODO: change later, mock for now
//   return {
//     props: {
//       data: {
//         artist: {},
//       },
//     },
//   };
// };

const Artist = () => {
  const { artist_id } = useRouter().query;

  const { data: artist, isLoading } = useArtist(artist_id);

  return (
    <Layout showCrumbs>
      {isLoading ? <CircularProgress /> : <ArtistPage artist={artist} />}
    </Layout>
  );
};

export default Artist;
