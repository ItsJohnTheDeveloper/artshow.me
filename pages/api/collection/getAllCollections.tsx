import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { userId, limited } = req.query as any;

    if (!userId) {
      res.status(404).json("404 - No user id found");
    }

    try {
      const collectionsRes = await prisma.collection.findMany({
        where: { userId },
      });

      if (limited) {
        return Promise.resolve(collectionsRes).then((result) => {
          res.status(200).json(result);
        });
      }

      const listPromise = await Promise.all(
        collectionsRes.map(async (collection) => {
          const paintingsInCollection = await prisma.painting.findMany({
            where: { collectionIds: { has: collection.id } },
            // take: 3,
          });

          const moddedCollection = {
            collectionName: collection.name,
            paintings: paintingsInCollection,
            size: collection.paintings.length,
          };
          return moddedCollection;
        })
      );

      Promise.resolve(listPromise).then((result) => {
        res.status(200).json(result);
      });
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
