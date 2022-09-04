import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    const { id, order } = req.body as any;
    if (!id || !order) {
      return res
        .status(404)
        .json("404 - No collection id or collection order found");
    }

    try {
      const response = await prisma.collection.update({
        where: { id },
        data: { order },
      });

      res.status(200).json(response);
      console.log(`Collection ${id}, order PATCHED`);
    } catch (err) {
      console.error(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
