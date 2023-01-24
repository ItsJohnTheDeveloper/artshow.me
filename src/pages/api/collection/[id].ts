import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Painting } from "../../../models/Painting";
import { Collection } from "./../../../models/Collection";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      if (!req.query) {
        return res.status(404).json({ message: "No request query found" });
      }
      const { id, artId } = req.query as any;

      try {
        const painting: Painting = await prisma.painting.findUnique({
          where: { id: artId },
        });

        const collection: Collection = await prisma.collection.findUnique({
          where: { id },
        });

        const other = await prisma.painting.findMany({
          where: { collectionIds: { has: id }, NOT: { id: artId } },
        });

        const data = { painting, other, collection };

        res.status(200).json(data);
      } catch (err) {
        res.status(403).json({ message: `An Error occurred: ${err}` });
      }
      break;
    default:
      return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
