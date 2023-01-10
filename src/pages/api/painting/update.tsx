import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    const { id } = req.query as any;
    const { data } = req.body as any;
    if (!id || !data) {
      return res.status(404).json("404 - No id or data found");
    }

    try {
      const response = await prisma.painting.update({
        where: { id },
        data,
      });

      res.status(200).json(response);
      console.log(`Painting ${data.id}, PATCHED`);
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
