import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PATCH") {
    if (!req.body) {
      return res.status(404).json("404 - No request body found");
    }

    const userId = req.query.id as string;
    const { name, bio, profilePic } = req.body;

    try {
      const response = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          bio,
          profilePic,
        },
      });

      res.status(200).json(response);
      console.log(`user successfully PATCHED`);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: `An Error occurred: ${err}` });
    }
  } else {
    return res.status(405).json("405 - Method Not Allowed");
  }
};

export default handle;
