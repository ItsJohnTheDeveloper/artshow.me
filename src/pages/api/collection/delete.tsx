import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }
    const { id } = req.body;

    try {
      const response = await prisma.collection.delete({
        where: { id },
      });
      res.status(200).json(response);
      console.log(`Collection successfully Deleted`);
    } catch (err) {
      console.error(err);
      res.status(403).json({ message: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
