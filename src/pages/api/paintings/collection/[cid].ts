import { Painting } from "../../../../models/Painting";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { apiHandler } from "../../../../utils/api";

const getPaintingsInCollection = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { cid } = req.query;
  if (!cid) {
    return res.status(404).json("404 - no collection id found.");
  }
  const collection = await prisma.collection.findUnique({
    where: { id: cid },
  });

  const response: Painting[] = await prisma.painting.findMany({
    where: { collectionIds: { has: cid } },
  });

  const order = collection.order;
  const sorted = response.sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
  );

  res.status(200).json(sorted);
};

export default apiHandler({
  GET: getPaintingsInCollection,
});
