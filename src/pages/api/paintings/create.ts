import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";
import { HandleAuthRequest } from "../auth/authMiddlware";

const NewPaintingSchema = z.object({
  name: z.string(),
  userId: z.string(),
});

const createPainting = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(404).json("404 - No request body found");
  }

  await HandleAuthRequest(req, res, async () => {
    const result = NewPaintingSchema.safeParse(req.body);
    if (result.success === false) {
      return res.status(400).json({
        message: "400 - bad request",
        detail: result?.error,
      });
    }

    const response = await prisma.painting.create({ data: req.body });
    return res.status(200).json(response);
  });
};

export default apiHandler({
  POST: createPainting,
});
