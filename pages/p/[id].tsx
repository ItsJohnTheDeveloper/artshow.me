import React from "react";
import Router from "next/router";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;

  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  const publishPost = async (id: string) => {
    try {
      await fetch(`/api/publish/${id}`, { method: "PUT" });
    } catch (err) {
      console.log(err.response);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await fetch(`/api/post/${id}`, { method: "DELETE" });
      Router.push("/");
    } catch (err) {
      console.log(err.response);
    }
  };

  console.log(props);

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
    </Layout>
  );
};

export default Post;
