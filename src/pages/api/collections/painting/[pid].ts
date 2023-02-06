import { Painting } from "./../../../../models/Painting";
import { Collection } from "./../../../../models/Collection";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { apiHandler } from "../../../../utils/api";

const getCollectionsThatPaintingBelongTo = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { pid } = req.query;
  if (!pid) {
    return res.status(404).json("404 - no painting id found");
  }
  const painting: Painting = await prisma.painting.findUnique({
    where: { id: pid },
  });

  const colIds = painting.collectionIds;
  const response: Collection[] = await prisma.collection.findMany({
    where: { id: { in: colIds } },
  });

  return res.status(200).json(response);
};

export default apiHandler({
  GET: getCollectionsThatPaintingBelongTo,
});
