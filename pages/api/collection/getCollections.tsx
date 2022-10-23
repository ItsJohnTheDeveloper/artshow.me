import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { showAllOption } from "../../../utils/helpers/getDefaultValues";

//TODO: please paginate this!!!
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id: collectionId, userId, limited } = req.query as any;

    const showAllUsersArt = collectionId === showAllOption.id;

    try {
      // if "limited" is true, return all collections.
      if (limited) {
        const collections = await prisma.collection.findMany({
          where: { userId },
        });

        return res.status(200).json(collections);
      }

      // if "Show all" is the collectionId, return all artwork (all of users art).
      if (showAllUsersArt) {
        const allArtwork = await prisma.painting.findMany({
          where: {
            userId,
          },
        });
        return res.status(200).json(allArtwork);
      }

      // else return the collection artwork based on the collectionId.
      if (!collectionId) {
        return res.status(404).json("404 - No collection id found");
      }
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
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
