import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";
import ArtistProfile from "../../components/Profile/Artist";
import Art from "../../components/Gallery/Art";
import { Grid } from "@mui/material";

export const getServerSideProps = async ({ params }) => {
  const mockData = await import("../../mock/mock-data.json");
  return {
    props: { data: mockData.artist },
  };
};

const Artist = (props) => {
  const { bio, coverPhoto, mainPhoto, id, name, gallery } = props.data;
  const artistData = { bio, coverPhoto, mainPhoto, id, name };

  return (
    <Layout>
      <ArtistProfile data={artistData} />
      <Grid
        style={{ padding: "64px 24px" }}
        container
        spacing={{ xs: 1, sm: 2, md: 2, lg: 1.5, xl: 2 }}
        columns={{ xs: 4, sm: 8, md: 8, lg: 10, xl: 12 }}
      >
        {gallery?.map((artwork) => (
          <Art data={artwork} key={artwork.id} />
        ))}
      </Grid>
      {/* <div>list here</div> */}
    </Layout>
  );
};

export default Artist;
