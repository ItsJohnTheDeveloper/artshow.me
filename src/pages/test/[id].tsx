import { GetServerSideProps } from "next";
import prisma from "../../../lib/prisma";

const index = (props) => {
  console.log(props);
  return <div>check your console for logs</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params.id as string;

  const artist = await prisma.user.findUnique({
    where: { id },
  });

  return {
    props: {
      data: {
        artist: JSON.parse(JSON.stringify(artist)),
      },
    },
  };
};

export default index;
