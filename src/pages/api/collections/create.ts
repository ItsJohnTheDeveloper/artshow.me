import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const createCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(404).json("404 - No request body found");
  }
  const { name, userId } = req.body;
  const response = await prisma.collection.create({
    data: {
      name,
      userId,
    },
  });

  res.status(200).json(response);
};

export default apiHandler({
  POST: createCollection,
});
