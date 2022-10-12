import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";

const Home = () => {
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
      </div>
    </Layout>
  );
};

export default Home;
