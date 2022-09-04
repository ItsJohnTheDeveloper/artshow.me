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

      // Adding a painting without belonging to a collection.
      if (!paintingRes?.collectionIds?.length) {
        res.status(200).json(paintingRes);
        console.log(
          `Painting uploaded without a collection: ${paintingRes.id}`
        );
      } else {
        // If painting belongs to collection(s), add it.
        paintingRes.collectionIds.forEach(async (id) => {
          await prisma.collection.update({
            where: { id },
            data: {
              paintings: {
                push: paintingRes.id,
              },
            },
          });
          console.log(
            `Painting successfully added to Collection: ${paintingRes.collectionIds}`
          );
        });

        res.status(200).json(paintingRes);
      }
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
