import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    if (!req.query) {
      return res.status(404).json("404 - No request query found");
    }

    const { artId } = req.query;

    try {
      const painting = await prisma.painting.findUnique({
        where: { id: artId },
      });

      const colIds = painting.collectionIds;
      const response = await prisma.collection.findMany({
        where: { id: { in: colIds } },
      });

      res.status(200).json(response);
      console.log(`Collection successfully Created`);
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
