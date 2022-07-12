import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const collectionId = req.query.id as string;
    if (!collectionId) {
      return res.status(404).json("404 - No collection id found");
    }

    try {
      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });

      const response = await prisma.painting.findMany({
        where: { collectionId },
      });

      const order = collection.order;
      const sorted = response.sort(
        (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
      );

      res.status(200).json(sorted);
      console.log(
        `Paintings in collection: ${collectionId} successfully FETCHED`
      );
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
