import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: { feed: [] } };
};

type Props = {
  feed: PostProps[];
};

const Blog: React.FC<Props> = (props) => {
  console.log({ props });

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          <Link href={"/artist/1234"}>Sample artist page</Link>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
