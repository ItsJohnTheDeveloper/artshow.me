import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    const data = { data: req.body };

    try {
      const paintingRes = await prisma.painting.create(data);

      // once painting is created, add it to the collection.
      await prisma.collection.update({
        where: { id: paintingRes.collectionId },
        data: {
          paintings: {
            push: paintingRes.id,
          },
        },
      });

      res.status(200).json(paintingRes);
      console.log(
        `Painting successfully added to Collection: ${paintingRes.collectionId}`
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
