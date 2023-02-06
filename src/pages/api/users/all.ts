import { User } from "@prisma/client";
import { NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

type PreviewUser = Omit<
  User,
  "password" | "bio" | "refreshTokens" | "createdAt" | "updatedAt"
>;

const allUsers = async (_, res: NextApiResponse) => {
  const response: PreviewUser[] = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
      coverPic: true,
    },
  });
  res.status(200).json(response);
};

export default apiHandler({
  GET: allUsers,
});
