import { Collection } from "../../../models/Collection";
import { Painting } from "../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const getUsersCollection = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const id = req.query.id as string;
  const artId = req.query.artId as string;

  if (!id || !artId) {
    return res.status(404).json({ message: "No request body found" });
  }

  const painting = await prisma.painting.findUnique({
    where: { id: artId },
  });

  const collection = await prisma.collection.findUnique({
    where: { id },
  });

  const other = await prisma.painting.findMany({
    where: { collectionIds: { has: id }, NOT: { id: artId } },
  });

  return res.status(200).json({ painting, other, collection });
};

export default apiHandler({
  GET: getUsersCollection,
});
