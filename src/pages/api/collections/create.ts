import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequest } from "../auth/authMiddlware";

const createCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(404).json("404 - No request body found");
  }

  await HandleAuthRequest(req, res, async () => {
    const response = await prisma.collection.create({
      data: {
        name,
        userId,
      },
    });
    return res.status(200).json(response);
  });
};

export default apiHandler({
  POST: createCollection,
});
