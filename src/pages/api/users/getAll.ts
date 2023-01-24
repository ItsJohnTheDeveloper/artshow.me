import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers);
      } catch (err) {
        res.status(403).json({ message: `An Error occurred: ${err}` });
      }

      break;
    default:
      return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
