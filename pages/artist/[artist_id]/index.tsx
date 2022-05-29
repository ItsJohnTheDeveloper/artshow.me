import React, { useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import ArtistProfile from "../../../components/Profile/Artist";
import ArtPreview from "../../../components/Collection/Gallery/ArtPreview";
import { Grid } from "@mui/material";
import { generateNewSample } from "../../../schemas/generateNew";

export const getServerSideProps = async ({ params }) => {
  const mockData = await import("../../../mock/mock-data.json");
  return {
    props: {
      data: { artist: mockData.artist, collections: mockData.collections },
    },
  };
};

const Artist = (props) => {
  const collections = props.data.collections;
  const artist = props.data.artist;
  const defaultCollection = collections.filter(
    (collection) => collection.id === artist.collections[0]
  )[0];

  const [text, setText] = useState("");
  const [body, setBody] = useState("");
  const [age, setAge] = useState(1);

  const [serverMessage, setServerMessage] = useState("");

  const handleUploadSamplePost = async () => {
    try {
      await axios.post("/sample", generateNewSample(text, body, age));
      setServerMessage("Post successfully uploaded");
    } catch (err) {
      console.log(err?.response?.data);
      setServerMessage("Error occurred creating post");
    }

    setTimeout(() => {
      setServerMessage("");
    }, 5000);
  };

  return (
    <Layout showCrumbs>
      <ArtistProfile data={artist} />
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
      <br />
      <br />
      <div>
        text:
        <input
          style={{ color: "black" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <br />
        body:{" "}
        <input
          style={{ color: "black" }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></input>
        <br />
        age:{" "}
        <input
          type={"number"}
          style={{ color: "black" }}
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        ></input>
        <br />
        <button onClick={() => handleUploadSamplePost()}>
          Create test Post
        </button>
        {serverMessage}
      </div>
      <br />
      <br />
    </Layout>
  );
};

export default Artist;
