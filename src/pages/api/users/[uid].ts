import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequestWithOwnership } from "../auth/authMiddlware";

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = req.query.uid as string;
  if (!uid) {
    return res.status(404).json("404 - no user id found.");
  }
  const response = await prisma.user.findUnique({
    where: { id: uid },
  });

  return res.status(200).json(response);
};

const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const uid = req.query.uid as string;
  if (!uid || !req.body) {
    return res
      .status(404)
      .json({ message: "no request body or user id found" });
  }

  await HandleAuthRequestWithOwnership(req, res, {
    resourceType: "user",
    resourceId: uid,
    callback: async () => {
      const { name, bio, profilePic, coverPic, bioPic } = req.body;

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
      if (coverPic) {
        data = { ...data, coverPic };
      }
      if (bioPic) {
        data = { ...data, bioPic };
      }
      const response = await prisma.user.update({
        where: { id: uid },
        data,
      });

      return res.status(200).json(response);
    },
  });
};

export default apiHandler({
  GET: getUser,
  PATCH: updateUser,
});
