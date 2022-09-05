import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id: collectionId, userId, all } = req.query as any;

    if (!collectionId) {
      return res.status(404).json("404 - No collection id found");
    }

    try {
      // if "all" is true, return all artwork (please paginate)
      if (all) {
        const allArtwork = await prisma.painting.findMany({
          where: {
            userId,
          },
        });
        return res.status(200).json(allArtwork);
      }

      // if "all" is false, return artwork in collection
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });

      const response = await prisma.painting.findMany({
        where: { collectionIds: { has: collectionId } },
      });

      const order = collection.order;
      const sorted = response.sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
      );

      res.status(200).json(sorted);
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
