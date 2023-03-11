import { NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const allUsers = async (_, res: NextApiResponse) => {
  const response = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
      coverPic: true,
    },
  });
  return res.status(200).json(response);
};

export default apiHandler({
  GET: allUsers,
});
