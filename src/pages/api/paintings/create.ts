import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const createPainting = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body) {
    return res.status(404).json("404 - No request body found");
  }
  const response = await prisma.painting.create({ data: req.body });
  res.status(200).json(response);
};

export default apiHandler({
  POST: createPainting,
});
