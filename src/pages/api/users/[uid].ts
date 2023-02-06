import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

type UserProfile = Omit<User, "password">;

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(404).json("404 - no user id found.");
  }
  const response: UserProfile = await prisma.user.findUnique({
    where: { id: uid },
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
      coverPic: true,
      bio: true,
      refreshTokens: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(response);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body || !req.query.uid) {
    return res
      .status(404)
      .json({ message: "no request body or user id found" });
  }
  const { name, bio, profilePic } = req.body;

  let data;
  if (name) {
    data = { ...data, name };
  }
  if (bio) {
    data = { ...data, bio };
  }
  if (profilePic) {
    data = { ...data, profilePic };
  }

  const { uid } = req.query;
  const response: UserProfile = await prisma.user.update({
    where: { id: uid },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      profilePic: true,
      coverPic: true,
      bio: true,
      refreshTokens: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json(response);
};

export default apiHandler({
  GET: getUser,
  PATCH: updateUser,
});
