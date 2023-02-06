import { Collection } from "../../../models/Collection";
import { Painting } from "../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { apiHandler } from "../../../utils/api";

const getUsersCollection = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(404).json({ message: "No request body found" });
  }
  const { id, artId } = req.query as any;

  const painting: Painting = await prisma.painting.findUnique({
    where: { id: artId },
  });

  const collection: Collection = await prisma.collection.findUnique({
    where: { id },
  });

  const other = await prisma.painting.findMany({
    where: { collectionIds: { has: id }, NOT: { id: artId } },
  });

  res.status(200).json({ painting, other, collection });
};

export default apiHandler({
  GET: getUsersCollection,
});
