import { Painting } from "../../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { apiHandler } from "../../../../utils/api";

const getPaintingsByUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(404).json("404 - no user id found.");
  }
  const response: Painting[] = await prisma.painting.findMany({
    where: { userId: uid },
  });
  res.status(200).json(response);
};

export default apiHandler({
  GET: getPaintingsByUser,
});
