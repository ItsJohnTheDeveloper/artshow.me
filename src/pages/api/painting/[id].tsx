import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query as any;

    if (!id) {
      return res.status(404).json("404 - No id found");
    }

    try {
      const painting = await prisma.painting.findUnique({
        where: { id },
      });

      res.status(200).json(painting);
    } catch (err) {
      res.status(400).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
