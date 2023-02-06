import { Collection } from "./../../../../models/Collection";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { apiHandler } from "../../../../utils/api";

// TODO: add limit/offset
const getCollectionsByUser = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(404).json("404 - no user id found");
  }
  const response: Collection[] = await prisma.collection.findMany({
    where: { userId: uid },
  });

  return res.status(200).json(response);
};

export default apiHandler({
  GET: getCollectionsByUser,
});
