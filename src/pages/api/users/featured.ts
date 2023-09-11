import { NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const allFeaturedUsers = async (_, res: NextApiResponse) => {
  const response = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      profilePic: true,
    },
    take: 10, // @todo - add a 'featured' field to the user model
  });
  return res.status(200).json(response);
};

export default apiHandler({
  GET: allFeaturedUsers,
});
