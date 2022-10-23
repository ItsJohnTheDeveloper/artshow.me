import Link from "next/link";
import React, { useState } from "react";
import Layout from "../components/Layout";
import { useArtwork } from "../utils/hooks/useQueryData";

const Home = () => {
  const [paintingId, setPaintingId] = useState("");
  const { data: artwork, isLoading, isError } = useArtwork(paintingId);

  return (
    <Layout>
      <div className="page">
        <main>this page is intentionally blank.</main>
        <br />
        <span>
          <Link href="/artist/6293dca2d671e0ad7d7878ea">
            view a sample profile
          </Link>{" "}
          or create a new account.
        </span>
        {/* <br /> <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            setPaintingId("6314045cb51b979324080356");
          }}
        >
          {"fetch sample painting from '/api/painting/6314045cb51b979324080356"}
        </button>
        <br /> <br />
        {isLoading && <h4>Loading...</h4>}
        {artwork && <div>{artwork.name}</div>}
        {isError && isError.response.data.message} */}
      </div>
    </Layout>
  );
};

export default Home;
