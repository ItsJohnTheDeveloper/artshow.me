import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layout";
import ArtistPage from "../../../components/Profile/Artist";
import { useArtist } from "../../../utils/hooks/useQueryData";
import { GetServerSideProps } from "next";

const LoadingIndicator = () => (
  <div style={{ textAlign: "center", padding: "100px 24px" }}>
    <CircularProgress />
  </div>
);

const Artist = () => {
  const router = useRouter();
  const artistId = router.query?.artist_id as string;

  const { data: artist, isLoading } = useArtist(artistId);

  return (
    <Layout showCrumbs>
      {isLoading ? <LoadingIndicator /> : <ArtistPage artist={artist} />}
    </Layout>
  );
};

/** TODO!! check back later if Prisma supports this in serverless environment. */

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const id = params.artist_id as string;

//   const artist = await prisma.user.findUnique({
//     where: { id },
//   });

//   return {
//     props: {
//       data: {
//         artist: JSON.parse(JSON.stringify(artist)),
//       },
//     },
//   };
// };

export default Artist;
