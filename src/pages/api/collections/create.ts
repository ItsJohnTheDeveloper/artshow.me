import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequest } from "../auth/authMiddlware";

const NewCollectionSchema = z.object({
  name: z.string(),
  userId: z.string(),
});

const createCollection = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, userId } = req.body;
  console.log({ name, userId });
  if (!name || !userId) {
    return res.status(404).json("404 - No request body found");
  }

  await HandleAuthRequest(req, res, async () => {
    const result = NewCollectionSchema.safeParse(req.body);
    if (result.success === false) {
      return res.status(400).json({
        message: "400 - bad request",
        detail: result?.error,
      });
    }

    try {
      const response = await prisma.collection.create({
        data: {
          name,
          userId,
        },
      });
      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export default apiHandler({
  POST: createCollection,
});
